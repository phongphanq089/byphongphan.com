import { LayoutDashboard } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const SPARKLINE = [4, 8, 6, 10, 12, 7]

export interface CategoryApplicationSchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderBlockCategorySchematic`. */
  active?: boolean
  className?: string
}

export function CategoryApplicationSchematic({
  active,
  className,
}: CategoryApplicationSchematicProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <LayoutDashboard className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>DASHBOARD SHELL • APPLICATION</span>
      </div>

      {/* Miniature desktop application frame */}
      <div className="flex h-24 w-52 overflow-hidden rounded-md border border-zinc-900/10 bg-background shadow-xs sm:w-56 dark:border-white/10 dark:bg-zinc-950">
        {/* Left navigation rail */}
        <div className="flex w-8 shrink-0 flex-col items-center gap-1.5 border-r border-zinc-900/10 pt-2 dark:border-white/10">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={cn(
                "h-1 w-4 rounded-full transition-colors duration-300",
                idx === 0
                  ? "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)] dark:bg-blue-400"
                  : "bg-zinc-900/20 dark:bg-white/15",
                idx === 0 && active && "bg-blue-400"
              )}
            />
          ))}
        </div>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar: breadcrumb + window dots */}
          <div className="flex h-4 shrink-0 items-center justify-between border-b border-zinc-900/10 px-2 dark:border-white/10">
            <div className="h-1 w-14 rounded-full bg-zinc-900/30 dark:bg-white/30" />
            <div className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-zinc-900/20 dark:bg-white/20" />
              <span className="size-1.5 rounded-full bg-zinc-900/20 dark:bg-white/20" />
              <span className="size-1.5 rounded-full bg-zinc-900/20 dark:bg-white/20" />
            </div>
          </div>

          {/* Content: 2 stat panels + sparkline */}
          <div className="flex flex-1 gap-1 p-1.5">
            <div className="flex flex-1 flex-col gap-1">
              {/* Mini stat cards */}
              {[0, 1].map((idx) => (
                <div
                  key={idx}
                  className="flex flex-1 flex-col justify-center gap-0.5 rounded-[3px] border border-zinc-900/10 bg-zinc-900/[0.04] px-1.5 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="h-1 w-6 rounded-full bg-zinc-900/50 dark:bg-white/50" />
                  <div className="h-0.5 w-8 rounded-full bg-zinc-900/20 dark:bg-white/20" />
                </div>
              ))}
            </div>

            {/* Sparkline panel */}
            <div className="flex w-16 shrink-0 flex-col justify-end gap-1 rounded-[3px] border border-zinc-900/10 bg-zinc-900/[0.04] p-1.5 dark:border-white/10 dark:bg-white/[0.04]">
              <div className="flex h-6 items-end gap-0.5">
                {SPARKLINE.map((h, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${h * 2}px` }}
                    className={cn(
                      "w-1.5 rounded-[1px] bg-zinc-900/30 transition-colors duration-300 group-hover:bg-blue-500 dark:bg-white/25 dark:group-hover:bg-blue-400",
                      active && "bg-blue-500 dark:bg-blue-400"
                    )}
                  />
                ))}
              </div>
              <div className="h-0.5 w-9 rounded-full bg-zinc-900/20 dark:bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
