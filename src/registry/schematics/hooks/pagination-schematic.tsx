import { ChevronLeft, ChevronRight, Hash } from "lucide-react"

export function PaginationSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center select-none">
      {/* Pagination container */}
      <div className="relative flex items-center gap-1 rounded-lg border border-border/70 bg-card/60 p-1.5 shadow-xs">
        {/* Prev button */}
        <div className="flex size-6 items-center justify-center rounded border border-border/50 text-muted-foreground/60">
          <ChevronLeft className="size-3" />
        </div>

        {/* Page 1 */}
        <div className="flex size-6 items-center justify-center rounded border border-border/40 font-mono text-[10px] text-muted-foreground">
          1
        </div>

        {/* Active Page 2 */}
        <div className="flex size-6 items-center justify-center rounded border border-primary/60 bg-primary font-mono text-[10px] font-bold text-primary-foreground shadow-[0_0_8px_var(--pp-primary-glow)]">
          2
        </div>

        {/* Ellipsis */}
        <div className="flex size-4 items-center justify-center font-mono text-[9px] text-muted-foreground/60">
          •••
        </div>

        {/* Page 9 */}
        <div className="flex size-6 items-center justify-center rounded border border-border/40 font-mono text-[10px] text-muted-foreground">
          9
        </div>

        {/* Next button */}
        <div className="flex size-6 items-center justify-center rounded border border-border/50 text-muted-foreground">
          <ChevronRight className="size-3" />
        </div>
      </div>

      {/* Floating status badge */}
      <div className="absolute right-4 bottom-2 flex items-center gap-1 rounded-full border border-primary/40 bg-background/95 px-2 py-0.5 shadow-[0_0_10px_var(--pp-primary-glow)]">
        <Hash className="size-2.5 text-primary" />
        <span className="font-mono text-[9px] font-semibold text-primary">
          Page 2/9
        </span>
      </div>
    </div>
  )
}

export default PaginationSchematic
