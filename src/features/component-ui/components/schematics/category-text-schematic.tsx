import { Type } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface CategoryTextSchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderComponentCategorySchematic`. */
  active?: boolean
  className?: string
}

export function CategoryTextSchematic({
  active,
  className,
}: CategoryTextSchematicProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Type className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>MIDDLE TRUNCATION • TEXT</span>
      </div>

      <div className="flex w-full max-w-[210px] flex-col items-center gap-1.5 rounded-md border border-zinc-900/10 bg-background px-3 py-3 shadow-xs sm:max-w-[230px] dark:border-white/10 dark:bg-zinc-950">
        {/* Middle-truncated text with bracket badges */}
        <div className="flex items-center gap-1.5">
          <span className="flex h-3.5 min-w-4 items-center justify-center rounded-xs border border-zinc-900/15 bg-zinc-900/[0.05] px-1 font-mono text-[6px] font-medium text-zinc-900/50 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/50">
            {"{"}
          </span>
          <span
            className={cn(
              "font-mono text-[9px] leading-none font-bold tracking-tight text-zinc-900/90 transition-all duration-300 dark:text-white/90",
              "group-hover:tracking-[0.08em]",
              active && "tracking-[0.08em]"
            )}
          >
            byphong
            <span className="text-zinc-900/40 dark:text-white/40">...</span>
            components
          </span>
          <span className="flex h-3.5 min-w-4 items-center justify-center rounded-xs border border-zinc-900/15 bg-zinc-900/[0.05] px-1 font-mono text-[6px] font-medium text-zinc-900/50 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/50">
            {"}"}
          </span>
        </div>

        {/* Neon baseline trace */}
        <div className="relative flex h-1.5 w-full items-center justify-center">
          {/* Blurred glow under the trace */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute h-1.5 w-40 rounded-full bg-gradient-to-r from-blue-500/50 via-cyan-400/60 to-emerald-400/50 blur-[3px] transition-all duration-300",
              "opacity-40 group-hover:w-44 group-hover:opacity-90 dark:from-blue-400/50 dark:via-cyan-400/60 dark:to-emerald-400/50",
              active && "w-44 opacity-90"
            )}
          />
          {/* Sharp baseline trace */}
          <div
            className={cn(
              "relative h-px w-40 bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300",
              "group-hover:w-44",
              active && "w-44"
            )}
          />
        </div>

        {/* Micro caption */}
        <div className="font-mono text-[5px] tracking-[0.3em] text-zinc-900/35 uppercase dark:text-white/30">
          canvas • binary search
        </div>
      </div>
    </div>
  )
}
