import { Command, Keyboard, Search, Sparkles, X } from "lucide-react"
import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { cn } from "../../utils/cn"
import type { ShortcutCategory } from "./shortcuts-data"
import { SHORTCUT_CATEGORIES, SHORTCUTS_DATA } from "./shortcuts-data"

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [platform, setPlatform] = React.useState<"mac" | "windows">("windows")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<
    ShortcutCategory | "all"
  >("all")

  // Detect OS on initial mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
      setPlatform(isMac ? "mac" : "windows")
    }
  }, [])

  const filteredShortcuts = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return SHORTCUTS_DATA.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false
      }
      // Search filter
      if (!query) return true
      return (
        item.action.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.windows.join(" ").toLowerCase().includes(query) ||
        item.mac.join(" ").toLowerCase().includes(query)
      )
    })
  }, [searchQuery, selectedCategory])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-[95vw] max-w-xl flex-col overflow-hidden border border-border/80 bg-background/95 p-0 shadow-2xl backdrop-blur-xl sm:max-w-xl sm:rounded-2xl">
        {/* Header with Title & Platform Switcher */}
        <DialogHeader className="w-full min-w-0 space-y-3 border-b border-border/50 bg-muted/20 px-5 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
              <Keyboard className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
                Keyboard shortcuts
              </DialogTitle>
              <DialogDescription className="mt-0.5 truncate text-xs text-muted-foreground">
                Fast typing and structural editing shortcuts for your workspace
              </DialogDescription>
            </div>
          </div>

          {/* Platform Switcher Segmented Control (macOS vs Windows) */}
          <div className="grid w-full grid-cols-2 gap-1 rounded-lg border border-border/60 bg-muted/50 p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setPlatform("mac")}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                platform === "mac"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Command className="size-3.5" />
              <span>macOS</span>
            </button>
            <button
              type="button"
              onClick={() => setPlatform("windows")}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                platform === "windows"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <svg
                className="size-3 fill-current text-blue-500"
                viewBox="0 0 24 24"
              >
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
              </svg>
              <span>Windows / Linux</span>
            </button>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="w-full min-w-0 space-y-2">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search shortcuts (e.g. heading, list, code, font, bold)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-input bg-background/80 py-1.5 pr-8 pl-9 text-xs transition-all outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-2.5 flex size-4 -translate-y-1/2 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex w-full min-w-0 scrollbar-none items-center gap-1 overflow-x-auto pb-0.5">
              {SHORTCUT_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "shrink-0 cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-medium whitespace-nowrap transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>
        </DialogHeader>

        {/* Shortcuts Table */}
        <div className="w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-5 py-2">
          {/* Table Header */}
          <div className="sticky top-0 z-10 grid grid-cols-[1fr_auto] items-center border-b border-border/50 bg-background/95 px-1 py-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase backdrop-blur-xs">
            <span>ACTION</span>
            <span>SHORTCUT</span>
          </div>

          {filteredShortcuts.length > 0 ? (
            <div className="w-full min-w-0 divide-y divide-border/30">
              {filteredShortcuts.map((item) => {
                const keys = platform === "mac" ? item.mac : item.windows
                return (
                  <div
                    key={item.id}
                    className="group grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-muted/40"
                  >
                    {/* Left: Action & Description */}
                    <div className="min-w-0 pr-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold text-foreground">
                          {item.action}
                        </span>
                        {item.badge && (
                          <span
                            className={cn(
                              "py-0.2 rounded-md border px-1.5 text-[9px] font-semibold",
                              item.badge === "Popular" &&
                                "border-primary/20 bg-primary/10 text-primary",
                              item.badge === "Markdown" &&
                                "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                              item.badge === "Developer" &&
                                "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                              item.badge === "Tasks" &&
                                "border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400",
                              item.badge === "Help" &&
                                "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400",
                              item.badge === "Essential" &&
                                "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    {/* Right: Key Combination */}
                    <div className="flex shrink-0 items-center justify-end gap-1">
                      {keys.map((k, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && (
                            <span className="text-[10px] font-semibold text-muted-foreground/70 select-none">
                              +
                            </span>
                          )}
                          <kbd className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-md border border-border/90 bg-muted/70 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-foreground shadow-2xs group-hover:border-border group-hover:bg-muted">
                            {k}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-1 py-12 text-center text-muted-foreground">
              <Search className="mx-auto size-6 text-muted-foreground/40" />
              <div className="text-xs font-medium">No shortcuts found</div>
              <div className="text-[11px] opacity-70">
                Try searching for another keyword or switch category
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex w-full min-w-0 items-center justify-between border-t border-border/50 bg-muted/10 px-5 py-2.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <Sparkles className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">
              Tip: Press{" "}
              <kbd className="rounded border border-border/80 bg-background px-1.5 py-0.5 font-mono font-semibold text-foreground">
                {platform === "mac" ? "⌘" : "Ctrl"} + /
              </kbd>{" "}
              anytime in the editor
            </span>
          </div>
          <span className="shrink-0 font-mono text-[10px] opacity-70">
            {filteredShortcuts.length} of {SHORTCUTS_DATA.length}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
