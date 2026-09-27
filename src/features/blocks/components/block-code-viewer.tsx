import { FileCode } from "lucide-react"
import { useMemo } from "react"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
  CodeBlockWrapToggle,
} from "@/registry/ui/code-block"
import { cn } from "@/shared/lib"

import type { ResolvedBlockFile } from "../types"

interface BlockCodeViewerProps {
  file: ResolvedBlockFile | null
  className?: string
}

export function BlockCodeViewer({ file, className }: BlockCodeViewerProps) {
  const language = useMemo(() => {
    if (!file) return "typescript"
    const ext = file.name.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "tsx":
      case "jsx":
        return "tsx"
      case "ts":
      case "js":
        return "typescript"
      case "css":
        return "css"
      case "json":
        return "json"
      case "html":
        return "html"
      default:
        return "typescript"
    }
  }, [file])

  if (!file) {
    return (
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground",
          className
        )}
      >
        <FileCode className="size-8 opacity-40" />
        <p className="text-xs">
          Select a file from the explorer to view its source code.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn("flex h-full w-full flex-col overflow-hidden", className)}
    >
      <CodeBlock
        key={file.path}
        code={file.code}
        language={language}
        showLineNumbers
        className="flex h-full w-full flex-col overflow-hidden rounded-none border-none bg-transparent"
      >
        <CodeBlockHeader className="shrink-0 border-b border-border/60 bg-muted/20 px-4 py-2">
          <div className="flex items-center gap-2">
            <FileCode className="size-3.5 text-primary" />
            <CodeBlockTitle className="font-mono text-xs font-medium text-foreground">
              {file.path}
            </CodeBlockTitle>
          </div>
          <CodeBlockLanguage className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase" />
          <div className="ml-auto flex items-center gap-1">
            <CodeBlockWrapToggle />
            <CodeBlockCopyButton />
          </div>
        </CodeBlockHeader>
        <div className="flex-1 overflow-auto">
          <CodeBlockContent />
        </div>
      </CodeBlock>
    </div>
  )
}
