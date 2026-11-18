import { MousePointerClick } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface CategoryButtonSchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderComponentCategorySchematic`. */
  active?: boolean
  className?: string
}

export function CategoryButtonSchematic({
  active,
  className,
}: CategoryButtonSchematicProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <MousePointerClick className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>TACTILE ACTIONS • BUTTON</span>
      </div>

      {/* Button blueprint container */}
      <div className="flex w-full max-w-[210px] flex-col items-center justify-center rounded-md border border-zinc-900/10 bg-background p-3 shadow-xs sm:max-w-[230px] dark:border-white/10 dark:bg-zinc-950">
        <div
          className={cn(
            "relative flex h-16 w-44 items-center justify-center overflow-hidden rounded-xl border p-2 transition-all duration-300",
            "border-zinc-900/10 bg-zinc-900/[0.04] dark:border-white/10 dark:bg-white/[0.03]",
            "group-hover:border-blue-500/40 dark:group-hover:border-blue-400/40",
            active && "border-blue-500/40 dark:border-blue-400/40"
          )}
        >
          {/* Subtle ambient back-glow on hover/active */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300",
              "bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18),transparent_70%)]",
              "group-hover:opacity-100",
              active && "opacity-100"
            )}
          />

          {/* Corner CAD guide marks */}
          <div className="absolute top-1.5 left-1.5 size-1 rounded-full bg-blue-500/50" />
          <div className="absolute top-1.5 right-1.5 size-1 rounded-full bg-blue-500/50" />
          <div className="absolute bottom-1.5 left-1.5 size-1 rounded-full bg-blue-500/50" />
          <div className="absolute right-1.5 bottom-1.5 size-1 rounded-full bg-blue-500/50" />

          {/* Blueprint button with slider thumb mockup */}
          <div
            className={cn(
              "relative z-10 flex h-8 w-36 items-center justify-between rounded-full border border-blue-500/30 bg-background/80 px-1 shadow-xs transition-all duration-300 dark:bg-zinc-900/80",
              "group-hover:border-blue-400/60 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.2)]",
              active &&
                "border-blue-400/60 shadow-[0_0_12px_rgba(59,130,246,0.2)]"
            )}
          >
            {/* Sliding squircle thumb */}
            <div
              className={cn(
                "flex h-6 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-xs transition-transform duration-300 ease-out",
                "group-hover:translate-x-12",
                active && "translate-x-12"
              )}
            >
              <div className="flex items-center">
                <div className="h-1 w-2 rounded-xs bg-white" />
                <div className="size-0 border-y-[2.5px] border-l-[3px] border-y-transparent border-l-white" />
              </div>
            </div>

            {/* Shimmering label line */}
            <div className="flex flex-1 items-center justify-center pr-2">
              <div className="h-1 w-12 rounded-full bg-zinc-900/30 dark:bg-white/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
