import { Sliders } from "lucide-react"

export function ArtcraftScroll01Schematic() {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Top Header Badge */}
      <div className="flex items-center gap-1.5 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Sliders className="size-3 text-primary" />
        <span>KINETIC SCROLL SCRUBBER • BLOCK</span>
      </div>

      {/* Minimalist Skeleton Wireframe Box */}
      <div className="relative flex h-28 w-56 items-center justify-between overflow-hidden rounded-md border border-zinc-900/10 bg-zinc-100/60 p-3 shadow-2xs transition-colors dark:border-white/10 dark:bg-zinc-950">
        {/* Left: Skeleton Page Content */}
        <div className="flex flex-1 flex-col gap-1.5 opacity-60">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-6 rounded bg-primary/50" />
            <span className="h-1 w-10 rounded bg-foreground/20" />
          </div>
          <div className="h-3 w-20 rounded bg-foreground/70" />
          <div className="h-1.5 w-28 rounded bg-foreground/25" />
          <div className="h-1.5 w-24 rounded bg-foreground/20" />
          <div className="mt-1 flex gap-1.5">
            <div className="h-4 w-8 rounded bg-foreground/10" />
            <div className="h-4 w-8 rounded bg-foreground/10" />
            <div className="h-4 w-8 rounded bg-foreground/10" />
          </div>
        </div>

        {/* Right: Curved Rail Track & Ticks */}
        <div className="relative flex h-full w-14 items-center justify-end">
          <svg
            viewBox="0 0 60 100"
            className="absolute inset-0 h-full w-full stroke-primary/40"
            fill="none"
          >
            <path
              d="M 12 14 L 34 14 A 12 12 0 0 1 46 26 L 46 72 A 12 12 0 0 1 34 84 L 12 84"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          </svg>

          {/* Indicator Bar */}
          <div className="absolute top-[48%] right-0 z-10 flex items-center">
            <span className="mr-1 font-mono text-[7px] font-bold text-primary">
              047%
            </span>
            <div className="h-[2px] w-5 bg-primary shadow-[0_0_6px_var(--primary)]" />
          </div>

          {/* Ticks */}
          <div className="flex h-full flex-col justify-between py-1 opacity-50">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`h-[1px] self-end bg-foreground/60 ${
                  i % 2 === 0 ? "w-2.5" : "w-1.5"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
