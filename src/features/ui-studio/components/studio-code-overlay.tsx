/* eslint-disable react-hooks/set-state-in-effect */
import { ArrowLeft, FileCode2, X } from "lucide-react"
import { motion, useDragControls } from "motion/react"
import * as React from "react"

import { CopyButton } from "@/registry/animated/button/copy-button"
import { useMediaQuery } from "@/registry/hooks/use-media-query"
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
  /** Switch back to the docs view (docs remain mounted behind this drawer). */
  onBack?: () => void
  /** Close the entire docs panel. */
  onClose?: () => void
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
 * Source-Code drawer rendered on top of the docs view.
 * On desktop it floats as an absolutely-anchored drawer card that you can
 * drag downward to dismiss (drag-to-dismiss) or close with the X button.
 */
export function StudioCodeOverlay({
  item,
  onBack,
  onClose,
  activeVariantId,
  onSelectVariant,
}: StudioCodeOverlayProps) {
  // Blocks ship without MDX docs — no "back" affordance there
  const hasDocs = item.collection !== "blocks" && Boolean(onBack)
  const isDrawerMode = useMediaQuery("max-xl")
  const dragControls = useDragControls()
  const dismiss = onBack ?? onClose

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

  const content = (
    <>
      {/* Grab handle — desktop right-panel only (>= xl); drawer mode (< xl) uses Base UI swipe bar */}
      {!isDrawerMode ? (
        <div
          onPointerDown={(event) => {
            if (event.button === 0) dragControls.start(event)
          }}
          role="separator"
          aria-orientation="horizontal"
          aria-label="Drag down to close"
          className="flex h-6 w-full shrink-0 cursor-grab touch-none items-center justify-center border-b border-border/40 transition-colors select-none hover:bg-accent/40 active:cursor-grabbing"
        >
          <span className="h-1 w-10 rounded-full bg-muted-foreground/40 transition-colors hover:bg-muted-foreground/80" />
        </div>
      ) : null}

      {/* Tool header: back + active file + copy + close */}
      <div
        onPointerDown={(event) => {
          if (!isDrawerMode && event.button === 0) {
            const target = event.target as HTMLElement
            if (!target.closest("button, a, input, select")) {
              dragControls.start(event)
            }
          }
        }}
        className={cn(
          "flex h-11 shrink-0 items-center gap-2 border-b border-border/70 px-3",
          !isDrawerMode && "cursor-grab select-none active:cursor-grabbing"
        )}
      >
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

        <div className="flex shrink-0 items-center gap-1">
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

          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              title="Close panel (Esc)"
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
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
    </>
  )

  // Drawer mode (< xl): native flex container inside Base UI DrawerPopup (no redundant motion.div wrapper)
  if (isDrawerMode) {
    return <div className="flex h-full min-h-0 w-full flex-col">{content}</div>
  }

  // Desktop (>= xl): bottom-anchored draggable drawer card inside the docked panel column
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      drag="y"
      dragControls={dragControls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: 600 }}
      dragElastic={{ top: 0, bottom: 0.15 }}
      dragSnapToOrigin
      onDragEnd={(_, info) => {
        if (info.offset.y > 100 || info.velocity.y > 300) {
          dismiss?.()
        }
      }}
      className="absolute inset-0 z-20 flex h-full w-full flex-col border-l border-border/60 bg-background/98 backdrop-blur-xl"
    >
      {content}
    </motion.div>
  )
}
