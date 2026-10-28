import { Waves } from "lucide-react"

export function KoiBackgroundSchematic() {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Top Header Badge */}
      <div className="flex items-center gap-1.5 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Waves className="size-3 text-primary" />
        <span>CANVAS SURFACE • KOI POND</span>
      </div>

      {/* Minimalist Skeleton Wireframe Box */}
      <div className="relative flex h-28 w-52 flex-col items-center justify-between overflow-hidden rounded-md border border-zinc-900/10 bg-zinc-100/60 p-3 shadow-2xs transition-colors dark:border-white/10 dark:bg-zinc-950">
        {/* Subtle Ambient Wave Ripples (Background) */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
          <div className="size-24 rounded-full border border-orange-500/20" />
          <div className="absolute size-14 rounded-full border border-orange-500/30" />
        </div>

        {/* Top Skeleton Meta Badges */}
        <div className="relative z-10 flex w-full items-center justify-between">
          <div className="h-1.5 w-10 rounded-full bg-zinc-900/10 dark:bg-white/10" />
          <div className="flex items-center gap-1">
            <span className="size-1 rounded-full bg-primary" />
            <span className="font-mono text-[7px] text-zinc-500 dark:text-zinc-400">
              60 FPS
            </span>
          </div>
        </div>

        {/* Center Text & Status */}
        <div className="relative z-10 flex flex-col items-center gap-1 text-center">
          <span className="font-mono text-xs font-semibold tracking-wider text-foreground">
            KOI BACKGROUND
          </span>
          <span className="font-mono text-[8px] text-muted-foreground">
            Fluid Hydrodynamics Canvas
          </span>
        </div>

        {/* Bottom Skeleton Bar */}
        <div className="relative z-10 flex w-full items-center justify-center gap-1.5">
          <div className="h-1 w-12 rounded-full bg-zinc-900/10 dark:bg-white/10" />
          <div className="h-1 w-8 rounded-full bg-primary/40" />
          <div className="h-1 w-12 rounded-full bg-zinc-900/10 dark:bg-white/10" />
        </div>
      </div>
    </div>
  )
}
