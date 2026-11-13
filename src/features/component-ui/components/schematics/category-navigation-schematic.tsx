import { Navigation } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface CategoryNavigationSchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderComponentCategorySchematic`. */
  active?: boolean
  className?: string
}

const TICKS = Array.from({ length: 25 }, (_, i) => i)

export function CategoryNavigationSchematic({
  active,
  className,
}: CategoryNavigationSchematicProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Navigation className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>LINE NAV • NAVIGATION</span>
      </div>

      <div className="flex w-full max-w-[210px] flex-col items-center gap-1.5 rounded-md border border-zinc-900/10 bg-background px-3 py-2.5 shadow-xs sm:max-w-[230px] dark:border-white/10 dark:bg-zinc-950">
        {/* Tab row */}
        <div className="flex items-center gap-4 pb-1">
          {["Home", "Docs", "Pricing"].map((tab) => (
            <span
              key={tab}
              className={cn(
                "font-mono text-[8px] tracking-widest uppercase transition-colors duration-200",
                tab === "Docs"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-900/35 dark:text-white/30"
              )}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Rail with tick marks + spring indicator */}
        <div className="relative flex h-2 w-full items-center">
          {/* Base line */}
          <div className="h-px w-full bg-zinc-900/20 dark:bg-white/15" />
          {/* Tick marks */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
            {TICKS.map((i) => (
              <span
                key={i}
                className={cn(
                  "w-px bg-zinc-900/30 dark:bg-white/25",
                  i % 6 === 0 ? "h-2" : "h-1"
                )}
              />
            ))}
          </div>
          {/* Spring indicator under the active tab */}
          <div
            className={cn(
              "absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-300 group-hover:w-12 dark:from-cyan-400 dark:to-blue-400",
              active && "w-12"
            )}
          />
        </div>

        {/* Sub-pixel rail caption */}
        <div className="font-mono text-[5px] tracking-[0.3em] text-zinc-900/35 uppercase dark:text-white/30">
          |===|========|
        </div>
      </div>
    </div>
  )
}
