import { Sparkles } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface CategoryGlassSchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderComponentCategorySchematic`. */
  active?: boolean
  className?: string
}

export function CategoryGlassSchematic({
  active,
  className,
}: CategoryGlassSchematicProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <Sparkles className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>WEBGL2 SDF • LIQUID GLASS</span>
      </div>

      {/* Liquid Glass Surface Preview */}
      <div className="relative flex h-20 w-full max-w-[210px] flex-col items-center justify-center gap-1.5 overflow-hidden rounded-md border border-zinc-900/10 bg-background p-2 shadow-xs sm:max-w-[230px] dark:border-white/10 dark:bg-zinc-950">
        {/* Ambient color orbs behind the glass */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -top-3 left-4 size-14 rounded-full bg-sky-500/25 blur-lg transition-transform duration-500",
            "group-hover:translate-x-2 group-hover:scale-110",
            active && "translate-x-2 scale-110"
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-4 -bottom-3 size-14 rounded-full bg-violet-500/25 blur-lg transition-transform duration-500",
            "group-hover:-translate-x-2 group-hover:scale-110",
            active && "-translate-x-2 scale-110"
          )}
        />

        {/* Pill trigger */}
        <div className="relative z-10 flex h-5 w-32 items-center justify-between rounded-full border border-zinc-900/15 bg-white/70 px-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-md dark:border-white/20 dark:bg-white/10 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
          <div className="h-1.5 w-14 rounded-full bg-zinc-900/60 dark:bg-white/80" />
          <div className="size-1.5 rounded-full bg-primary/80" />
        </div>

        {/* Frosted glass card */}
        <div
          className={cn(
            "relative z-10 flex w-32 flex-col gap-1 rounded-xl border border-zinc-900/10 bg-white/65 p-1.5 shadow-sm backdrop-blur-xl transition-transform duration-500 dark:border-white/15 dark:bg-white/[0.08]",
            "group-hover:translate-y-0.5",
            active && "translate-y-0.5"
          )}
        >
          <div className="h-1.5 w-20 rounded-full bg-zinc-900/45 dark:bg-white/65" />
          <div className="h-1.5 w-14 rounded-full bg-zinc-900/25 dark:bg-white/35" />
        </div>
      </div>
    </div>
  )
}
