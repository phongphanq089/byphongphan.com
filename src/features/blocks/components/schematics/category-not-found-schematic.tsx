import { Gamepad2 } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const BRICK_MATRIX = [
  1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0,
]

export interface CategoryNotFoundSchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderBlockCategorySchematic`. */
  active?: boolean
  className?: string
}

export function CategoryNotFoundSchematic({
  active,
  className,
}: CategoryNotFoundSchematicProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Gamepad2 className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>DAIKANOID • 404 PAGES</span>
      </div>

      <div className="flex w-52 flex-col items-center gap-1.5 rounded-md border border-zinc-900/10 bg-background px-3 py-2 shadow-xs sm:w-56 dark:border-white/10 dark:bg-zinc-950">
        {/* Technical outline "404" stencil */}
        <span
          aria-hidden="true"
          className={cn(
            "font-mono text-3xl leading-none font-extrabold tracking-widest text-transparent select-none",
            "[-webkit-text-stroke:1.1px_rgba(113,113,122,0.9)] dark:[-webkit-text-stroke:1.1px_rgba(161,161,170,0.9)]",
            "transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.45)]",
            active && "drop-shadow-[0_0_8px_rgba(96,165,250,0.45)]"
          )}
        >
          404
        </span>

        {/* Brick breaker rows */}
        <div className="grid grid-cols-12 gap-0.5">
          {BRICK_MATRIX.map((val, idx) => (
            <div
              key={idx}
              className={cn(
                "size-2 rounded-xs border transition-colors duration-300",
                val === 1
                  ? "border-blue-500/40 bg-blue-500/10 group-hover:border-blue-400/70 group-hover:bg-blue-500/25 dark:border-blue-400/40 dark:bg-blue-400/15 dark:group-hover:border-blue-400/70 dark:group-hover:bg-blue-400/30"
                  : "border-transparent bg-zinc-900/[0.05] dark:bg-white/[0.04]",
                val === 1 &&
                  active &&
                  "border-blue-400/70 bg-blue-500/25 dark:border-blue-400/70 dark:bg-blue-400/30"
              )}
            />
          ))}
        </div>

        {/* Ball */}
        <div className="my-0.5 size-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.6)] dark:bg-blue-400" />

        {/* Paddle */}
        <div
          className={cn(
            "h-1.5 w-12 rounded-full bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.4)] transition-all duration-300 group-hover:w-16 group-hover:bg-blue-400 group-hover:shadow-[0_0_12px_rgba(96,165,250,0.7)] dark:bg-blue-400/80",
            active && "w-16 bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.7)]"
          )}
        />
      </div>
    </div>
  )
}
