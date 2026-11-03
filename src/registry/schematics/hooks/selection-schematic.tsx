import { Check, CheckSquare } from "lucide-react"

export function SelectionSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center select-none">
      {/* Mockup table / list card */}
      <div className="relative flex h-24 w-40 flex-col overflow-hidden rounded-lg border border-border/70 bg-card/60 shadow-xs">
        {/* Table header */}
        <div className="flex h-5 items-center gap-2 border-b border-border/50 bg-muted/40 px-2.5">
          <div className="flex size-2.5 items-center justify-center rounded-xs border border-primary bg-primary/20">
            <Check className="size-2 text-primary" />
          </div>
          <div className="h-1.5 w-16 rounded bg-muted-foreground/40" />
        </div>

        {/* Rows */}
        <div className="flex flex-1 flex-col justify-center gap-1.5 p-2">
          {/* Row 1: Selected */}
          <div className="flex items-center gap-2 rounded bg-primary/10 px-1.5 py-1">
            <div className="flex size-2.5 items-center justify-center rounded-xs bg-primary text-primary-foreground">
              <Check className="size-2" />
            </div>
            <div className="h-1.5 w-18 rounded bg-foreground/60" />
          </div>

          {/* Row 2: Selected */}
          <div className="flex items-center gap-2 rounded bg-primary/10 px-1.5 py-1">
            <div className="flex size-2.5 items-center justify-center rounded-xs bg-primary text-primary-foreground">
              <Check className="size-2" />
            </div>
            <div className="h-1.5 w-12 rounded bg-foreground/60" />
          </div>

          {/* Row 3: Unselected */}
          <div className="flex items-center gap-2 px-1.5 py-0.5 opacity-40">
            <div className="size-2.5 rounded-xs border border-border" />
            <div className="h-1.5 w-14 rounded bg-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute right-4 bottom-2 flex items-center gap-1 rounded-full border border-primary/40 bg-background/95 px-2 py-0.5 shadow-[0_0_10px_var(--pp-primary-glow)]">
        <CheckSquare className="size-2.5 text-primary" />
        <span className="font-mono text-[9px] font-semibold text-primary">
          2 items
        </span>
      </div>
    </div>
  )
}

export default SelectionSchematic
