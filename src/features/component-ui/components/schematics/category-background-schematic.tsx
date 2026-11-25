import { CircleDashed } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface CategoryBackgroundSchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderComponentCategorySchematic`. */
  active?: boolean
  className?: string
}

export function CategoryBackgroundSchematic({
  active,
  className,
}: CategoryBackgroundSchematicProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <CircleDashed className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>CURSOR AMBIENT • BACKGROUND</span>
      </div>

      {/* Ambient canvas frame with dot matrix + overlapping contour gradients */}
      <div className="relative h-20 w-full max-w-[210px] overflow-hidden rounded-md border border-zinc-900/10 bg-background shadow-xs sm:max-w-[230px] dark:border-white/10 dark:bg-zinc-950">
        {/* Dot matrix grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle,rgba(120,120,120,0.35)_1px,transparent_1px)] [background-size:8px_8px] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1px)]"
        />

        {/* Left contour ring — blue */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 left-[30%] size-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/35 bg-[radial-gradient(circle,rgba(59,130,246,0.22)_0%,transparent_70%)] transition-all duration-500 ease-out",
            "group-hover:size-[4.75rem] group-hover:border-blue-400/60 group-hover:bg-[radial-gradient(circle,rgba(59,130,246,0.3)_0%,transparent_70%)] dark:border-blue-400/35 dark:bg-[radial-gradient(circle,rgba(96,165,250,0.22)_0%,transparent_70%)]",
            active &&
              "size-[4.75rem] border-blue-400/60 dark:border-blue-400/60"
          )}
        />
        {/* Left inner contour ring */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 left-[30%] size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/45 transition-all duration-500 ease-out dark:border-blue-400/45",
            "group-hover:size-8 group-hover:border-cyan-400/60",
            active && "size-8 border-cyan-400/60"
          )}
        />

        {/* Right contour ring — cyan */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 left-[68%] size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30 bg-[radial-gradient(circle,rgba(34,211,238,0.18)_0%,transparent_70%)] transition-all duration-500 ease-out",
            "group-hover:size-[5.25rem] group-hover:border-cyan-300/55 group-hover:bg-[radial-gradient(circle,rgba(34,211,238,0.26)_0%,transparent_70%)] dark:border-cyan-400/30 dark:bg-[radial-gradient(circle,rgba(34,211,238,0.2)_0%,transparent_70%)]",
            active &&
              "size-[5.25rem] border-cyan-300/55 dark:border-cyan-400/55"
          )}
        />

        {/* Simulated cursor dot */}
        <div className="absolute top-1/2 left-[54%] size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900/70 shadow-[0_0_6px_rgba(9,9,11,0.4)] transition-transform duration-500 group-hover:scale-125 dark:bg-white/80 dark:shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
      </div>

      {/* Micro caption */}
      <div className="font-mono text-[5px] tracking-[0.3em] text-zinc-900/35 uppercase dark:text-white/30">
        radial-gradient • cursor
      </div>
    </div>
  )
}
