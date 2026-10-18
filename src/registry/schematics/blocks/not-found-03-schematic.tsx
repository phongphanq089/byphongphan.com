import { Grid3X3 } from "lucide-react"

export function NotFound03Schematic() {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Grid3X3 className="size-3 text-primary" />
        <span>PIXEL TRAIL • 404 VOID</span>
      </div>

      <div className="relative flex h-30 w-52 flex-col items-center justify-center overflow-hidden rounded-md border border-zinc-900/10 bg-background p-2 shadow-xs dark:border-white/10 dark:bg-zinc-950">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-1 p-2 opacity-20">
          {Array.from({ length: 72 }).map((_, i) => (
            <div key={i} className="size-1 rounded-[1px] bg-foreground/40" />
          ))}
        </div>

        {/* Illuminated Trail Curve (Glowing pixels) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-4 left-6 size-2 rounded-[1px] bg-zinc-950 dark:bg-white" />
          <div className="absolute top-6 left-12 size-2 rounded-[1px] bg-zinc-950 dark:bg-white" />
          <div className="absolute top-10 left-18 size-2.5 rounded-[1px] bg-primary" />
          <div className="absolute top-14 left-24 size-2.5 rounded-[1px] bg-primary" />
          <div className="absolute top-16 left-32 size-2 rounded-[1px] bg-zinc-950 dark:bg-white" />
          <div className="absolute top-18 left-40 size-1.5 rounded-[1px] bg-zinc-950/70 dark:bg-white/70" />
        </div>

        {/* Center 404 overlay */}
        <div className="relative z-10 flex flex-col items-center gap-0.5">
          <span className="font-mono text-lg font-black tracking-tighter text-foreground sm:text-xl">
            404
          </span>
          <div className="h-0.5 w-8 rounded-full bg-primary/80" />
          <span className="font-mono text-[7px] text-muted-foreground">
            PIXEL VOID
          </span>
        </div>
      </div>
    </div>
  )
}
