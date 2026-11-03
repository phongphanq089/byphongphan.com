import { ArrowDownUp, GripVertical, ListOrdered } from "lucide-react"

export function ListStateSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center select-none">
      {/* Mockup list card */}
      <div className="relative flex h-24 w-40 flex-col overflow-hidden rounded-lg border border-border/70 bg-card/60 shadow-xs">
        {/* Header */}
        <div className="flex h-5 items-center justify-between border-b border-border/50 bg-muted/40 px-2.5">
          <div className="flex items-center gap-1.5">
            <ListOrdered className="size-2.5 text-muted-foreground" />
            <span className="font-mono text-[9px] font-semibold text-muted-foreground">
              useListState
            </span>
          </div>
          <div className="h-1.5 w-6 rounded bg-primary/40" />
        </div>

        {/* List items */}
        <div className="flex flex-1 flex-col justify-center gap-1.5 p-2">
          {/* Row 1 */}
          <div className="flex items-center justify-between rounded bg-muted/30 px-1.5 py-0.5">
            <div className="flex items-center gap-1.5">
              <GripVertical className="size-2.5 text-muted-foreground/50" />
              <div className="h-1.5 w-14 rounded bg-foreground/60" />
            </div>
            <div className="size-1.5 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Row 2: Reordered / Active */}
          <div className="flex items-center justify-between rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 shadow-[0_0_8px_var(--pp-primary-glow)]">
            <div className="flex items-center gap-1.5">
              <ArrowDownUp className="size-2.5 text-primary" />
              <div className="h-1.5 w-18 rounded bg-primary font-medium" />
            </div>
            <div className="size-1.5 rounded-full bg-primary" />
          </div>

          {/* Row 3 */}
          <div className="flex items-center justify-between rounded bg-muted/30 px-1.5 py-0.5 opacity-60">
            <div className="flex items-center gap-1.5">
              <GripVertical className="size-2.5 text-muted-foreground/50" />
              <div className="h-1.5 w-12 rounded bg-foreground/60" />
            </div>
            <div className="size-1.5 rounded-full bg-muted-foreground/30" />
          </div>
        </div>
      </div>

      {/* Floating count badge */}
      <div className="absolute right-4 bottom-2 flex items-center gap-1 rounded-full border border-primary/40 bg-background/95 px-2 py-0.5 shadow-[0_0_10px_var(--pp-primary-glow)]">
        <ArrowDownUp className="size-2.5 text-primary" />
        <span className="font-mono text-[9px] font-semibold text-primary">
          CRUD / Reorder
        </span>
      </div>
    </div>
  )
}

export default ListStateSchematic
