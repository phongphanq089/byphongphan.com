import { ChevronRight, File, Folder, FolderOpen } from "lucide-react"
import { useState } from "react"

import { cn } from "@/shared/lib"

import type { FileTreeNode } from "../types"

interface FileTreeProps {
  tree: FileTreeNode[]
  activeFile: string | null
  onSelectFile: (path: string) => void
}

interface FileTreeItemProps {
  node: FileTreeNode
  depth: number
  activeFile: string | null
  onSelectFile: (path: string) => void
}

function FileTreeItem({
  node,
  depth,
  activeFile,
  onSelectFile,
}: FileTreeItemProps) {
  const [isOpen, setIsOpen] = useState(true)

  if (node.type === "file") {
    const isActive = activeFile === node.path
    const ext = node.name.split(".").pop() ?? ""

    return (
      <button
        type="button"
        onClick={() => onSelectFile(node.path)}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-2 py-1 text-left text-xs transition-colors",
          isActive
            ? "bg-pp-primary/10 font-semibold text-pp-primary"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <FileIcon ext={ext} className="size-3.5 shrink-0" />
        <span className="truncate">{node.name}</span>
      </button>
    )
  }

  // Folder node
  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-1 rounded-md px-2 py-1 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <ChevronRight
          className={cn(
            "size-3 shrink-0 transition-transform duration-150",
            isOpen && "rotate-90"
          )}
        />
        {isOpen ? (
          <FolderOpen className="size-3.5 shrink-0 text-pp-primary/70" />
        ) : (
          <Folder className="size-3.5 shrink-0 text-pp-primary/70" />
        )}
        <span className="truncate font-medium">{node.name}</span>
      </button>

      {isOpen && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.type === "file" ? child.path : child.name}
              node={child}
              depth={depth + 1}
              activeFile={activeFile}
              onSelectFile={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/** Maps file extensions to color-coded icon styling */
function FileIcon({ ext, className }: { ext: string; className?: string }) {
  const colorClass = (() => {
    switch (ext) {
      case "tsx":
      case "jsx":
        return "text-sky-400"
      case "ts":
        return "text-blue-400"
      case "css":
        return "text-purple-400"
      case "json":
        return "text-amber-400"
      default:
        return "text-muted-foreground"
    }
  })()

  return <File className={cn(className, colorClass)} />
}

export function BlockFileTree({
  tree,
  activeFile,
  onSelectFile,
}: FileTreeProps) {
  return (
    <div className="flex flex-col gap-0.5 py-2">
      {tree.map((node) => (
        <FileTreeItem
          key={node.type === "file" ? node.path : node.name}
          node={node}
          depth={0}
          activeFile={activeFile}
          onSelectFile={onSelectFile}
        />
      ))}
    </div>
  )
}
