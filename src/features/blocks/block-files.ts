import type { BlockItem, FileTreeNode, ResolvedBlockFile } from "./types"

/**
 * Vite glob import for all raw block source files.
 * Convention: src/registry/block/{blockSlug}/**
 *
 * Each block's files are stored under: src/registry/block/{slug}/
 * The glob captures all .ts, .tsx, .css files recursively.
 */
const rawBlockFiles = import.meta.glob<string>(
  "../../registry/block/*/**/*.{ts,tsx,css}",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
)

/**
 * Resolve a block's file list by matching slug against the raw glob imports.
 * Falls back to generating a sample placeholder if no real files exist yet.
 */
export function resolveBlockFiles(block: BlockItem): ResolvedBlockFile[] {
  const prefix = `../../registry/block/${block.slug}/`
  const resolved: ResolvedBlockFile[] = []

  for (const [filePath, code] of Object.entries(rawBlockFiles)) {
    if (filePath.startsWith(prefix)) {
      // Strip the prefix to get the relative display path
      const relativePath = filePath.slice(prefix.length)
      const name = relativePath.split("/").pop() ?? relativePath

      resolved.push({
        path: relativePath,
        name,
        code: code,
      })
    }
  }

  // Fallback placeholder if block files are not yet in the registry
  if (resolved.length === 0) {
    const pascalTitle = block.title.replace(/[^a-zA-Z0-9]/g, "")
    resolved.push({
      path: `components/${block.slug}.tsx`,
      name: `${block.slug}.tsx`,
      code: `export function ${pascalTitle}Block() {\n  return (\n    <section className="py-16 text-center">\n      <h2 className="text-3xl font-bold">${block.title}</h2>\n      <p className="mt-2 text-muted-foreground">${block.description}</p>\n    </section>\n  )\n}\n`,
    })
  }

  return resolved
}

/**
 * Build a hierarchical file tree from a flat list of resolved files.
 * Used to render the VS Code-style file explorer sidebar.
 */
export function buildFileTree(files: ResolvedBlockFile[]): FileTreeNode[] {
  const root: FileTreeNode[] = []

  for (const file of files) {
    const parts = file.path.split("/")
    let currentLevel = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isFile = i === parts.length - 1

      if (isFile) {
        currentLevel.push({
          type: "file",
          name: part,
          path: file.path,
        })
      } else {
        let folder = currentLevel.find(
          (node): node is FileTreeNode & { type: "folder" } =>
            node.type === "folder" && node.name === part
        )

        if (!folder) {
          folder = {
            type: "folder",
            name: part,
            children: [],
          }
          currentLevel.push(folder)
        }

        currentLevel = folder.children
      }
    }
  }

  // Sort each level: folders first, then files, both alphabetically
  function sortLevel(nodes: FileTreeNode[]): void {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    for (const node of nodes) {
      if (node.type === "folder") {
        sortLevel(node.children)
      }
    }
  }

  sortLevel(root)
  return root
}
