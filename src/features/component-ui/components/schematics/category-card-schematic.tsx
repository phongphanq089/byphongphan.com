import { RectangleHorizontal } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface CategoryCardSchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderComponentCategorySchematic`. */
  active?: boolean
  className?: string
}

export function CategoryCardSchematic({
  active,
  className,
}: CategoryCardSchematicProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <RectangleHorizontal className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>SPOTLIGHT &amp; GLOW • CARD</span>
      </div>

      {/* Card surface frame with spotlight ring + perimeter trace */}
      <div className="flex w-full max-w-[210px] items-center justify-center rounded-md border border-zinc-900/10 bg-background p-2 shadow-xs sm:max-w-[230px] dark:border-white/10 dark:bg-zinc-950">
        <div
          className={cn(
            "relative flex h-20 w-40 flex-col items-center justify-center overflow-hidden rounded-lg border p-2 transition-all duration-300",
            "border-zinc-900/10 bg-zinc-900/[0.04] dark:border-white/10 dark:bg-white/[0.03]",
            "group-hover:border-blue-500/40 dark:group-hover:border-blue-400/40",
            active && "border-blue-500/40 dark:border-blue-400/40"
          )}
        >
          {/* Perimeter edge trace (border-glow simulation) */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 rounded-lg border border-blue-400/50 opacity-0 shadow-[inset_0_0_12px_rgba(96,165,250,0.25)] transition-opacity duration-300 group-hover:opacity-100",
              active && "opacity-100"
            )}
          />

          {/* Concentric radial cursor glow ring */}
          <div
            className={cn(
              "relative z-10 flex size-10 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-400/50 dark:border-blue-400/30 dark:bg-blue-400/10",
              active && "scale-110 border-blue-400/50"
            )}
          >
            <div className="size-4 rounded-full bg-blue-500/20 dark:bg-blue-400/20" />
          </div>

          {/* Content wireframe bars under the glow */}
          <div className="relative z-10 mt-1.5 flex w-full flex-col items-center gap-1">
            <div className="h-1 w-16 rounded-full bg-zinc-900/40 dark:bg-white/40" />
            <div className="h-0.5 w-10 rounded-full bg-zinc-900/20 dark:bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  )
}
