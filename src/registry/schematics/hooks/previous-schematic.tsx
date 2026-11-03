import { ArrowRight } from "lucide-react"

export function PreviousSchematic() {
  return (
    <div className="flex h-32 w-full max-w-[260px] items-center justify-center gap-2.5 select-none">
      {/* Previous value */}
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-3">
        <span className="text-[9px] font-medium tracking-wider text-muted-foreground uppercase">
          Previous
        </span>

        <span className="font-mono text-sm font-medium text-muted-foreground">
          v1.0
        </span>
      </div>

      <ArrowRight className="size-4 shrink-0 text-muted-foreground/50" />

      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/[0.06] px-3 py-3">
        <span className="text-[9px] font-medium tracking-wider text-primary uppercase">
          Current
        </span>

        <span className="font-mono text-sm font-semibold text-foreground">
          v2.0
        </span>
      </div>
    </div>
  )
}

export default PreviousSchematic
