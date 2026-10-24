import { ChevronsUpDown } from "lucide-react"

export function ScrollAreaSchematic() {
  return (
    <div className="relative flex h-36 w-full max-w-[320px] overflow-hidden rounded-lg border border-black/10 bg-muted/60 p-3 select-none dark:border-white/15 dark:bg-neutral-900/80">
      {/* Inner simulated content area */}
      <div className="flex flex-1 flex-col gap-2 pr-3">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-black/5 pb-1 dark:border-white/10">
          <div className="h-2 w-16 rounded bg-black/60 dark:bg-white/80" />
          <ChevronsUpDown className="size-3 text-muted-foreground/60" />
        </div>

        {/* Content item skeletons */}
        <div className="flex items-center gap-2">
          <div className="size-3 shrink-0 rounded bg-pp-primary/30" />
          <div className="h-1.5 w-28 rounded bg-black/40 dark:bg-white/40" />
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 shrink-0 rounded bg-pp-primary/30" />
          <div className="h-1.5 w-36 rounded bg-black/30 dark:bg-white/30" />
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 shrink-0 rounded bg-pp-primary/30" />
          <div className="h-1.5 w-20 rounded bg-black/40 dark:bg-white/40" />
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 shrink-0 rounded bg-pp-primary/30" />
          <div className="h-1.5 w-32 rounded bg-black/20 dark:bg-white/20" />
        </div>
      </div>

      {/* Simulated Scrollbar Track & Thumb */}
      <div className="relative flex h-full w-2 shrink-0 flex-col items-center justify-start rounded-full bg-black/5 p-0.5 dark:bg-white/5">
        <div className="h-10 w-full rounded-full bg-pp-primary/70 shadow-[0_0_8px_var(--pp-primary-glow)] dark:bg-pp-primary" />
      </div>

      {/* Bottom fade hint */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-muted/90 to-transparent dark:from-neutral-900/90" />
    </div>
  )
}
