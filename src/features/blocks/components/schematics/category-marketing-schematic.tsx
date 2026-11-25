import { Megaphone } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface CategoryMarketingSchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderBlockCategorySchematic`. */
  active?: boolean
  className?: string
}

export function CategoryMarketingSchematic({
  active,
  className,
}: CategoryMarketingSchematicProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Megaphone className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>HERO &amp; METRICS • MARKETING</span>
      </div>

      <div className="flex w-[210px] flex-col items-center gap-1.5 rounded-md border border-zinc-900/10 bg-background p-2.5 shadow-xs sm:w-[280px] sm:gap-2 sm:p-3.5 dark:border-white/10 dark:bg-zinc-950">
        {/* Eyebrow */}
        <div className="h-1.5 w-10 rounded-full bg-zinc-900/30 sm:w-12 dark:bg-white/30" />

        {/* Headline: 2-line wireframe */}
        <div
          className={cn(
            "h-2 w-36 rounded-full bg-zinc-900/60 group-hover:bg-zinc-900 sm:h-2.5 sm:w-44 dark:bg-white/60 dark:group-hover:bg-white",
            active && "bg-zinc-900 dark:bg-white"
          )}
        />
        <div className="h-1.5 w-28 rounded-full bg-zinc-900/85 group-hover:bg-zinc-900 sm:h-2 sm:w-32 dark:bg-white/85 dark:group-hover:bg-white" />

        {/* Subline */}
        <div className="h-1 w-32 rounded-full bg-zinc-900/30 sm:h-1.5 sm:w-36 dark:bg-white/30" />

        {/* CTA row */}
        <div className="mt-0.5 flex items-center gap-2 sm:mt-1">
          <div className="h-3 w-12 rounded-full bg-zinc-900/85 sm:h-3.5 sm:w-14 dark:bg-white/85" />
          <div className="h-3 w-12 rounded-full border border-zinc-900/30 sm:h-3.5 sm:w-14 dark:border-white/30" />
        </div>

        {/* Metric pills */}
        <div className="mt-1 grid w-full grid-cols-2 gap-1.5 sm:mt-1.5 sm:gap-2">
          <div
            className={cn(
              "flex flex-col items-start gap-1 rounded-[4px] border p-2 group-hover:-translate-y-0.5",
              "border-zinc-900/10 bg-zinc-900/[0.04] dark:border-white/10 dark:bg-white/[0.04]",
              "group-hover:border-blue-500/30 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.12)] dark:group-hover:border-blue-400/30",
              active &&
                "-translate-y-0.5 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.12)] dark:border-blue-400/30"
            )}
          >
            <span className="font-mono text-[10px] leading-none font-bold text-blue-600 dark:text-blue-400">
              99.9%
            </span>
            <span className="font-mono text-[6px] leading-none tracking-widest text-zinc-900/40 uppercase dark:text-white/40">
              Uptime
            </span>
          </div>
          <div
            className={cn(
              "flex flex-col items-start gap-1 rounded-[4px] border p-2 group-hover:-translate-y-0.5",
              "border-zinc-900/10 bg-zinc-900/[0.04] dark:border-white/10 dark:bg-white/[0.04]",
              "group-hover:border-emerald-500/30 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.12)] dark:group-hover:border-emerald-400/30",
              active &&
                "-translate-y-0.5 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.12)] dark:border-emerald-400/30"
            )}
          >
            <span className="font-mono text-[10px] leading-none font-bold text-emerald-600 dark:text-emerald-400">
              4.2x
            </span>
            <span className="font-mono text-[6px] leading-none tracking-widest text-zinc-900/40 uppercase dark:text-white/40">
              Speed
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
