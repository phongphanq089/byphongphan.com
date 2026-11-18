import { ChevronsUpDown } from "lucide-react"

export function ScrollAreaSchematic() {
  return (
    <div className="relative flex h-34 w-54 overflow-hidden rounded-xl border border-white/15 bg-muted/60 p-3 select-none dark:bg-neutral-950/80">
      {/* Inner simulated content area */}
      <div className="flex flex-1 flex-col justify-between pr-3">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-1">
          <div className="h-1.5 w-16 rounded bg-white/80" />
          <ChevronsUpDown className="size-2.5 text-muted-foreground/60" />
        </div>

        {/* Content item skeletons */}
        <div className="flex flex-col gap-1.5 py-1">
          <div className="flex items-center gap-1.5">
            <div className="size-2 shrink-0 rounded bg-primary/40" />
            <div className="h-1 w-24 rounded bg-white/40" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 shrink-0 rounded bg-primary/40" />
            <div className="h-1 w-28 rounded bg-white/30" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 shrink-0 rounded bg-primary/40" />
            <div className="h-1 w-20 rounded bg-white/40" />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 pt-1 font-mono text-[8px] text-muted-foreground/60">
          Scroll Contain
        </div>
      </div>

      {/* Simulated Scrollbar Track & Thumb */}
      <div className="relative flex h-full w-1.5 shrink-0 flex-col items-center justify-start rounded-full bg-white/5 p-0.5">
        <div className="h-10 w-full rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
      </div>
    </div>
  )
}
