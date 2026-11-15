import { BookOpen, ChevronRight, Code2, PanelLeft, Search } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Kbd } from "@/shared/ui/core"
import { openCommandMenu } from "@/widgets/command-menu"

interface StudioHeaderProps {
  collectionLabel: string
  itemTitle?: string
  panel: "closed" | "docs" | "code"
  isSidebarOpen: boolean
  onToggleSidebar: () => void
  onToggleDocs: () => void
  onToggleCode: () => void
}

const PANEL_BUTTON_BASE =
  "inline-flex h-7 items-center gap-1.5 rounded-md px-2 font-mono text-[10px] tracking-wider uppercase transition-colors outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"

export function StudioHeader({
  collectionLabel,
  itemTitle,
  panel,
  isSidebarOpen,
  onToggleSidebar,
  onToggleDocs,
  onToggleCode,
}: StudioHeaderProps) {
  return (
    <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border/70 bg-background/80 px-2 backdrop-blur-sm sm:px-3">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar (Ctrl+B)"
        title="Toggle sidebar (Ctrl+B)"
        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
      >
        <PanelLeft
          className={cn(
            "size-4 transition-transform duration-300",
            !isSidebarOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      <nav
        aria-label="Studio breadcrumb"
        className="flex min-w-0 items-center gap-1 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase"
      >
        <span className="hidden xs:inline">Studio</span>
        <ChevronRight
          className="hidden size-3 opacity-60 xs:inline"
          aria-hidden="true"
        />
        <span className="text-foreground">{collectionLabel}</span>
        {itemTitle ? (
          <>
            <ChevronRight className="size-3 opacity-60" aria-hidden="true" />
            <span className="max-w-40 truncate text-foreground sm:max-w-56">
              {itemTitle}
            </span>
          </>
        ) : null}
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={openCommandMenu}
          aria-label="Open command palette (Ctrl+K)"
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <Search className="size-3.5" aria-hidden="true" />
          <Kbd className="h-4 min-w-4 px-1 text-[9px]">⌘K</Kbd>
        </button>

        <div
          role="group"
          aria-label="Right panel"
          className="flex items-center gap-0.5 rounded-md border border-border/60 bg-muted/30 p-0.5"
        >
          <button
            type="button"
            onClick={onToggleDocs}
            aria-pressed={panel === "docs"}
            className={cn(
              PANEL_BUTTON_BASE,
              panel === "docs"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground"
            )}
          >
            <BookOpen className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Docs</span>
          </button>
          <button
            type="button"
            onClick={onToggleCode}
            aria-pressed={panel === "code"}
            className={cn(
              PANEL_BUTTON_BASE,
              panel === "code"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground"
            )}
          >
            <Code2 className="size-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Code</span>
          </button>
        </div>
      </div>
    </div>
  )
}
