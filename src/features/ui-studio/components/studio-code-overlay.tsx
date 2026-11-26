/* eslint-disable react-hooks/set-state-in-effect */
import { ArrowLeftIcon, FileCodeIcon, XIcon } from "@phosphor-icons/react"
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
      {/* Top header integrated cleanly alongside floating StudioHeader controls */}
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
          "flex shrink-0 items-center gap-2",
          isDrawerMode
            ? "h-11 justify-between px-4"
            : "h-13.5 cursor-grab pr-[19.5rem] pl-4 select-none active:cursor-grabbing"
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          {hasDocs ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to docs"
              title="Back to docs"
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <ArrowLeftIcon size={16} aria-hidden="true" />
            </button>
          ) : null}

          <span className="min-w-0 truncate text-sm font-semibold tracking-tight text-foreground">
            {item.title}
          </span>
        </div>

        {isDrawerMode && onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            title="Close panel (Esc)"
            className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <XIcon size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {/* Unified File Tabs + Language / Wrap / Copy Toolbar + Code Viewport */}
      {currentFile ? (
        <CodeBlock
          key={currentFile.path}
          code={currentFile.code}
          language={fileLanguage(currentFile.name)}
          showLineNumbers
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border-none bg-transparent shadow-none"
        >
          <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-y border-border/50 bg-muted/25 px-3">
            {resolvedFiles.length > 0 ? (
              <div
                role="tablist"
                aria-label="Source files"
                className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
              >
                {resolvedFiles.map((file) => {
                  const isActive = file.path === currentFile.path
                  return (
                    <button
                      key={file.path}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleTabClick(file.path, file.variantId)}
                      title={file.path}
                      className={cn(
                        "flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        isActive
                          ? "bg-background font-medium text-foreground shadow-2xs ring-1 ring-border/60 dark:bg-white/[0.08] dark:ring-white/10"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      <FileCodeIcon size={13} aria-hidden="true" />
                      {file.name}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex-1" />
            )}

            <div className="flex shrink-0 items-center gap-1.5 border-l border-border/50 pl-2">
              <CodeBlockLanguage className="border-border/50 bg-background/70 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase" />
              <CodeBlockWrapToggle className="h-7 rounded-md px-2 text-[11px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground" />
              <CopyButton
                text={currentFile.code}
                size="icon"
                variant="ghost"
                aria-label="Copy code"
                title="Copy code"
                className="size-7 shrink-0 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              />
            </div>
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

  // Desktop (>= xl): crisp elevated code card starting flush at top without dead padding
  return (
    <motion.div
      initial={{ y: "100%", opacity: 0.5 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0.5 }}
      transition={{ type: "spring", stiffness: 400, damping: 34 }}
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
      className="absolute inset-0 z-20 flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-xs"
    >
      {content}
    </motion.div>
  )
}
