/* eslint-disable react-hooks/set-state-in-effect */
import { BookOpen, Code2, FileCode2, X } from "lucide-react"
import * as React from "react"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
  CodeBlockWrapToggle,
} from "@/registry/ui/code-block"
import { cn } from "@/shared/lib/utils"
import { ScrollArea } from "@/shared/ui"
import { CodeBlockCommand } from "@/shared/ui/core/code-block"

import type { StudioItem } from "../model/types"
import { getStudioSourceFiles } from "../model/unified-registry.adapter"

interface StudioRightPanelProps {
  item: StudioItem
  panel: "docs" | "code"
  onPanelChange: (panel: "docs" | "code" | null) => void
  activeVariantId?: string
  onSelectVariant: (variantId: string | null) => void
}

const TAB_BASE =
  "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 font-mono text-[10px] tracking-wider uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"

export function StudioRightPanel({
  item,
  panel,
  onPanelChange,
  activeVariantId,
  onSelectVariant,
}: StudioRightPanelProps) {
  const sourceFiles = React.useMemo(() => getStudioSourceFiles(item), [item])
  const [activeFilePath, setActiveFilePath] = React.useState<string | null>(
    null
  )

  const currentFile =
    sourceFiles.find((file) => file.path === activeFilePath) ??
    sourceFiles[0] ??
    null

  React.useEffect(() => {
    setActiveFilePath(null)
  }, [item.id])

  return (
    <div className="flex h-full w-[380px] max-w-[92vw] flex-col bg-background">
      {/* Panel header: tabs + close */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border/70 px-3">
        <div
          role="tablist"
          aria-label="Panel mode"
          className="flex items-center gap-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={panel === "docs"}
            onClick={() => onPanelChange("docs")}
            className={cn(
              TAB_BASE,
              panel === "docs"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            Docs
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={panel === "code"}
            onClick={() => onPanelChange("code")}
            className={cn(
              TAB_BASE,
              panel === "code"
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code2 className="size-3.5" aria-hidden="true" />
            Code
          </button>
        </div>

        <button
          type="button"
          onClick={() => onPanelChange(null)}
          aria-label="Close panel (Esc)"
          title="Close panel (Esc)"
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>

      {panel === "docs" ? (
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col gap-5 p-4 sm:p-5">
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {item.categoryName ? (
                  <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-muted-foreground uppercase">
                    {item.categoryName}
                  </span>
                ) : null}
                {item.isNew ? (
                  <span className="rounded-full border border-pp-primary/40 bg-pp-primary/10 px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-pp-primary uppercase">
                    New
                  </span>
                ) : null}
                {item.isUpdated ? (
                  <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[8px] tracking-[0.2em] text-amber-600 uppercase dark:text-amber-400">
                    Updated
                  </span>
                ) : null}
              </div>
              <h3 className="font-serif text-xl leading-tight font-bold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground/60 uppercase">
                Install
              </p>
              <CodeBlockCommand name={item.slug} className="mt-1" />
            </div>

            {item.variants && item.variants.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                <p className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground/60 uppercase">
                  Variants · {item.variants.length}
                </p>
                <ul className="flex flex-col gap-1">
                  {item.variants.map((variant) => {
                    const isActive = variant.id === activeVariantId
                    return (
                      <li key={variant.id}>
                        <button
                          type="button"
                          onClick={() =>
                            onSelectVariant(isActive ? null : variant.id)
                          }
                          aria-pressed={isActive}
                          className={cn(
                            "flex w-full flex-col gap-0.5 rounded-lg border px-3 py-2 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            isActive
                              ? "border-pp-primary/50 bg-pp-primary/5"
                              : "border-border/60 hover:border-border hover:bg-accent/40"
                          )}
                        >
                          <span className="text-[12px] font-semibold text-foreground">
                            {variant.title}
                          </span>
                          {variant.description ? (
                            <span className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                              {variant.description}
                            </span>
                          ) : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}

            {item.dependencies && item.dependencies.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                <p className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground/60 uppercase">
                  Dependencies
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {item.dependencies.map((dependency) => (
                    <li
                      key={dependency}
                      className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                    >
                      {dependency}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          {/* File tabs */}
          {sourceFiles.length > 0 ? (
            <div
              role="tablist"
              aria-label="Source files"
              className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-border/60 px-2 py-1.5"
            >
              {sourceFiles.map((file) => {
                const isActive = file.path === currentFile?.path
                return (
                  <button
                    key={file.path}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveFilePath(file.path)}
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

          {currentFile ? (
            <CodeBlock
              key={currentFile.path}
              code={currentFile.code}
              language={currentFile.name.endsWith(".css") ? "css" : "tsx"}
              showLineNumbers
              className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border-none bg-transparent"
            >
              <CodeBlockHeader className="shrink-0 border-b border-border/60 bg-muted/20 px-3 py-1.5">
                <CodeBlockTitle className="truncate font-mono text-[10px] text-muted-foreground">
                  {currentFile.path}
                </CodeBlockTitle>
                <CodeBlockLanguage className="ml-auto font-mono text-[9px] tracking-wider text-muted-foreground uppercase" />
                <CodeBlockWrapToggle />
                <CodeBlockCopyButton />
              </CodeBlockHeader>
              <ScrollArea className="min-h-0 flex-1">
                <CodeBlockContent />
              </ScrollArea>
            </CodeBlock>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6 text-center text-xs text-muted-foreground">
              No source files matched for this entry.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
