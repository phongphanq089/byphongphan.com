import {
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature,
} from "@headless-tree/core"
import { useTree } from "@headless-tree/react"
import { File, Folder, FolderOpen } from "lucide-react"
import { useEffect, useMemo } from "react"

import { cn } from "@/shared/lib"
import { Tree, TreeItem, TreeItemLabel } from "@/shared/ui/core/tree"

import type { FileTreeNode, ResolvedBlockFile } from "../types"

interface FileTreeItemData {
  id: string
  name: string
  isFolder: boolean
  path?: string
  children: string[]
}

export interface BlockFileTreeProps {
  files?: ResolvedBlockFile[]
  tree?: FileTreeNode[]
  activeFile: string | null
  onSelectFile: (path: string) => void
  className?: string
}

function buildTreeData(
  nodes?: FileTreeNode[],
  files?: ResolvedBlockFile[]
): {
  items: Record<string, FileTreeItemData>
  allFolderIds: string[]
} {
  const items: Record<string, FileTreeItemData> = {
    root: { id: "root", name: "root", isFolder: true, children: [] },
  }
  const allFolderIds = new Set<string>(["root"])

  if (files && files.length > 0) {
    for (const file of files) {
      const parts = file.path.split("/")
      let currentId = "root"
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const isFile = i === parts.length - 1
        const itemId = isFile ? file.path : parts.slice(0, i + 1).join("/")

        if (!items[itemId]) {
          items[itemId] = {
            id: itemId,
            name: part,
            isFolder: !isFile,
            path: isFile ? file.path : undefined,
            children: [],
          }
          if (!items[currentId].children.includes(itemId)) {
            items[currentId].children.push(itemId)
          }
          if (!isFile) {
            allFolderIds.add(itemId)
          }
        }
        currentId = itemId
      }
    }
  } else if (nodes && nodes.length > 0) {
    function traverse(nodeList: FileTreeNode[], parentId: string) {
      for (const node of nodeList) {
        if (node.type === "file") {
          items[node.path] = {
            id: node.path,
            name: node.name,
            isFolder: false,
            path: node.path,
            children: [],
          }
          if (!items[parentId].children.includes(node.path)) {
            items[parentId].children.push(node.path)
          }
        } else {
          const folderId = `${parentId}/${node.name}`
          items[folderId] = {
            id: folderId,
            name: node.name,
            isFolder: true,
            children: [],
          }
          allFolderIds.add(folderId)
          if (!items[parentId].children.includes(folderId)) {
            items[parentId].children.push(folderId)
          }
          traverse(node.children, folderId)
        }
      }
    }
    traverse(nodes, "root")
  }

  // Sort each node's children: folders first, then alphabetical
  for (const item of Object.values(items)) {
    item.children.sort((a, b) => {
      const itemA = items[a]
      const itemB = items[b]
      if (!itemA || !itemB) return 0
      if (itemA.isFolder !== itemB.isFolder) {
        return itemA.isFolder ? -1 : 1
      }
      return itemA.name.localeCompare(itemB.name)
    })
  }

  return { items, allFolderIds: Array.from(allFolderIds) }
}

/** Maps file extensions to color-coded icon styling */
function FileIcon({ ext, className }: { ext: string; className?: string }) {
  const colorClass = (() => {
    switch (ext) {
      case "tsx":
      case "jsx":
        return "text-sky-400"
      case "ts":
      case "js":
        return "text-blue-400"
      case "css":
        return "text-purple-400"
      case "json":
        return "text-amber-400"
      default:
        return "text-muted-foreground"
    }
  })()

  return <File className={cn("size-3.5 shrink-0", colorClass, className)} />
}

export function BlockFileTree({
  files,
  tree: legacyTree,
  activeFile,
  onSelectFile,
  className,
}: BlockFileTreeProps) {
  const treeData = useMemo(
    () => buildTreeData(legacyTree, files),
    [legacyTree, files]
  )

  const tree = useTree<FileTreeItemData>({
    rootItemId: "root",
    getItemName: (item) => treeData.items[item.getId()]?.name ?? item.getId(),
    isItemFolder: (item) => treeData.items[item.getId()]?.isFolder ?? false,
    dataLoader: {
      getItem: (id) => treeData.items[id],
      getChildren: (id) => treeData.items[id]?.children ?? [],
    },
    features: [syncDataLoaderFeature, selectionFeature, hotkeysCoreFeature],
    initialState: {
      expandedItems: treeData.allFolderIds,
      selectedItems: activeFile ? [activeFile] : [],
    },
    onPrimaryAction: (item) => {
      if (!item.isFolder()) {
        onSelectFile(item.getId())
      }
    },
  })

  // Synchronize selection when activeFile changes externally
  useEffect(() => {
    if (activeFile && treeData.items[activeFile]) {
      tree.setSelectedItems([activeFile])
    }
  }, [activeFile, tree, treeData.items])

  return (
    <div className={cn("w-full p-1.5", className)}>
      <Tree
        tree={tree}
        indent={14}
        toggleIconType="chevron"
        className="w-full gap-0.5"
      >
        {tree.getItems().map((item) => {
          const isFolder = item.isFolder()
          const name = item.getItemName()
          const isSelected = !isFolder && item.getId() === activeFile
          const ext = name.split(".").pop()?.toLowerCase() ?? ""

          return (
            <TreeItem
              key={item.getId()}
              item={item}
              className="w-full text-left"
              onClick={() => {
                if (!isFolder) {
                  onSelectFile(item.getId())
                }
              }}
            >
              <TreeItemLabel
                className={cn(
                  "cursor-pointer text-xs transition-colors",
                  isSelected
                    ? "bg-pp-primary/10 font-medium text-pp-primary hover:bg-pp-primary/15"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {isFolder ? (
                  item.isExpanded() ? (
                    <FolderOpen className="size-3.5 shrink-0 text-pp-primary/70" />
                  ) : (
                    <Folder className="size-3.5 shrink-0 text-pp-primary/70" />
                  )
                ) : (
                  <FileIcon ext={ext} />
                )}
                <span className="truncate">{name}</span>
              </TreeItemLabel>
            </TreeItem>
          )
        })}
      </Tree>
    </div>
  )
}
