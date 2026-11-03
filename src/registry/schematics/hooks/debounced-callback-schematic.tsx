import { ArrowRight, Clock, Sparkles } from "lucide-react"

export function DebouncedCallbackSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center select-none">
      {/* Container card */}
      <div className="relative flex h-24 w-42 flex-col justify-between overflow-hidden rounded-lg border border-border/70 bg-card/60 p-2.5 shadow-xs">
        {/* Rapid trigger pulses */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground/80">
            <span>Input events</span>
            <span className="font-semibold text-primary">4 calls</span>
          </div>

          <div className="flex items-center gap-1.5 py-1">
            <span className="h-3 w-1.5 rounded-full bg-muted-foreground/30" />
            <span className="h-3 w-1.5 rounded-full bg-muted-foreground/40" />
            <span className="h-3 w-1.5 rounded-full bg-muted-foreground/50" />
            <span className="h-3.5 w-1.5 animate-pulse rounded-full bg-primary/70" />
            <div className="h-px flex-1 border-t border-dashed border-border/80" />
            <ArrowRight className="size-2.5 text-muted-foreground/50" />
          </div>
        </div>

        {/* Debounced output execution */}
        <div className="flex items-center justify-between rounded border border-primary/30 bg-primary/10 px-2 py-1">
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-medium text-foreground">
            <Sparkles className="size-2.5 text-primary" />
            <span>callback()</span>
          </div>
          <span className="font-mono text-[8px] font-semibold text-primary">
            1 execution
          </span>
        </div>
      </div>

      {/* Floating delay badge */}
      <div className="absolute right-3 bottom-2 flex items-center gap-1 rounded-full border border-primary/40 bg-background/95 px-2 py-0.5 shadow-[0_0_10px_var(--pp-primary-glow)]">
        <Clock className="size-2.5 text-primary" />
        <span className="font-mono text-[9px] font-semibold text-primary">
          300ms
        </span>
      </div>
    </div>
  )
}

export default DebouncedCallbackSchematic
