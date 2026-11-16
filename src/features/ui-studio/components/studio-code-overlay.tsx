/* eslint-disable react-hooks/set-state-in-effect */
import { ArrowLeft, FileCode2 } from "lucide-react"
import * as React from "react"

import { CopyButton } from "@/registry/animated/button/copy-button"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLanguage,
  CodeBlockWrapToggle,
} from "@/registry/ui/code-block"
import { cn } from "@/shared/lib/utils"
import { ScrollArea } from "@/shared/ui"

import { getStudioResolvedFiles } from "../model/studio-mdx.adapter"
import type { StudioItem } from "../model/types"

interface StudioCodeOverlayProps {
  item: StudioItem
  /** Switch back to the docs view. Only offered when the item ships docs. */
  onBack?: () => void
  activeVariantId?: string
  onSelectVariant: (variantId: string | null) => void
}

function fileLanguage(name: string): string {
  return name.endsWith(".css")
    ? "css"
    : name.endsWith(".ts") && !name.endsWith(".d.ts")
      ? "ts"
      : "tsx"
}

/**
 * Full-height code viewer for a studio item: file tabs (main source,
 * helpers, one tab per variant), line-numbered Shiki output, and — when the
 * item ships docs — a back button returning to the docs view. Selecting a
 * variant tab activates that variant on the stage (and vice versa).
 */
export function StudioCodeOverlay({
  item,
  onBack,
  activeVariantId,
  onSelectVariant,
}: StudioCodeOverlayProps) {
  // Blocks ship without MDX docs — no "back" affordance there
  const hasDocs = item.collection !== "blocks" && Boolean(onBack)

  const resolvedFiles = React.useMemo(
    () => getStudioResolvedFiles(item),
    [item]
  )
  const [activeFilePath, setActiveFilePath] = React.useState<string | null>(
    null
  )

  const currentFile =
    resolvedFiles.find((file) => file.path === activeFilePath) ??
    resolvedFiles[0] ??
    null

  // Reset the selected tab whenever the item changes
  React.useEffect(() => {
    setActiveFilePath(null)
  }, [item.id])

  // Keep the code tab in sync with the stage's active variant
  React.useEffect(() => {
    if (!activeVariantId) return
    const variantFile = resolvedFiles.find(
      (file) => file.variantId === activeVariantId
    )
    if (variantFile) setActiveFilePath(variantFile.path)
  }, [activeVariantId, resolvedFiles])

  const handleTabClick = (filePath: string, variantId?: string) => {
    setActiveFilePath(filePath)
    if (variantId) onSelectVariant(variantId)
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Tool header: back + active file + copy */}
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border/70 px-3">
        {hasDocs ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to docs"
            title="Back to docs"
            className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 font-sans text-[11px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Source Code
          </button>
        ) : null}

        <span
          title={currentFile?.path}
          className="min-w-0 flex-1 truncate text-center font-mono text-[10px] text-muted-foreground"
        >
          {currentFile?.name ?? "—"}
        </span>

        {currentFile ? (
          <CopyButton
            text={currentFile.code}
            size="icon"
            variant="ghost"
            aria-label="Copy code"
            title="Copy code"
            className="size-7 shrink-0 text-muted-foreground hover:text-foreground"
          />
        ) : null}
      </div>

      {/* File tabs: main + helpers + variants */}
      {resolvedFiles.length > 0 ? (
        <div
          role="tablist"
          aria-label="Source files"
          className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-border/60 px-2 py-1.5"
        >
          {resolvedFiles.map((file) => {
            const isActive = file.path === currentFile?.path
            return (
              <button
                key={file.path}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(file.path, file.variantId)}
                title={file.path}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <FileCode2 className="size-3" aria-hidden="true" />
                {file.name}
              </button>
            )
          })}
        </div>
      ) : null}

      {/* Code content */}
      {currentFile ? (
        <CodeBlock
          key={currentFile.path}
          code={currentFile.code}
          language={fileLanguage(currentFile.name)}
          showLineNumbers
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border-none bg-transparent"
        >
          <div className="flex h-8 shrink-0 items-center justify-between border-b border-border/60 bg-muted/20 px-3">
            <CodeBlockLanguage className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase" />
            <CodeBlockWrapToggle />
          </div>
          <ScrollArea className="min-h-0 flex-1" orientation="both">
            <CodeBlockContent />
          </ScrollArea>
        </CodeBlock>
      ) : (
        <div className="flex flex-1 items-center justify-center p-6 text-center text-xs text-muted-foreground">
          No source files matched for this entry.
        </div>
      )}
    </div>
  )
}
