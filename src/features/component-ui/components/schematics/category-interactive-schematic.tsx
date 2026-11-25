import { Timer } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface CategoryInteractiveSchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderComponentCategorySchematic`. */
  active?: boolean
  className?: string
}

const DIAL_TICKS = Array.from({ length: 17 }, (_, i) => i)

export function CategoryInteractiveSchematic({
  active,
  className,
}: CategoryInteractiveSchematicProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Timer className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>TACTILE PHYSICS • INTERACTIVE</span>
      </div>

      <div className="flex w-full max-w-[210px] flex-col items-center gap-1.5 rounded-md border border-zinc-900/10 bg-background px-3 py-2.5 shadow-xs sm:max-w-[230px] dark:border-white/10 dark:bg-zinc-950">
        {/* Time dial scrubber display */}
        <div className="font-mono text-[13px] leading-none font-bold tracking-widest text-zinc-900/85 tabular-nums dark:text-white/85">
          <span className="text-zinc-900/35 dark:text-white/35">|</span>{" "}
          12:45:00{" "}
          <span className="text-zinc-900/35 dark:text-white/35">|</span>
        </div>

        {/* Dial tick marks */}
        <div className="flex w-full items-center justify-between px-1">
          {DIAL_TICKS.map((i) => (
            <span
              key={i}
              className={cn(
                "w-px bg-zinc-900/30 dark:bg-white/25",
                i === 8
                  ? "h-2.5 bg-blue-500 dark:bg-blue-400"
                  : i % 4 === 0
                    ? "h-2"
                    : "h-1"
              )}
            />
          ))}
        </div>

        {/* Tactile spring chip — hatched default, solid on hover/active */}
        <div
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex h-5 w-24 items-center justify-center rounded border font-mono text-[7px] font-medium tracking-widest uppercase select-none",
            "border-[#5b8bf7]/50 bg-[repeating-linear-gradient(45deg,rgba(91,139,247,0.18)_0,rgba(91,139,247,0.18)_2px,transparent_2px,transparent_6px)] text-zinc-500 transition-all duration-200",
            "group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground dark:text-zinc-300",
            active && "border-primary bg-primary text-primary-foreground"
          )}
        >
          Spring
        </div>
      </div>
    </div>
  )
}
