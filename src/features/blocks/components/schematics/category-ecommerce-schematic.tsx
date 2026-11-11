import { ShoppingBag } from "lucide-react"

import { cn } from "@/shared/lib/utils"

export interface CategoryEcommerceSchematicProps {
  /** Force the emphasized (hover-like) state — used by `RenderBlockCategorySchematic`. */
  active?: boolean
  className?: string
}

export function CategoryEcommerceSchematic({
  active,
  className,
}: CategoryEcommerceSchematicProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      {/* Top Header Badge */}
      <div className="flex items-center gap-2 font-mono text-[8px] text-zinc-900/50 dark:text-white/40">
        <ShoppingBag className="size-3 text-zinc-900/70 dark:text-white/70" />
        <span>PRODUCT CARD • E-COMMERCE</span>
      </div>

      {/* Miniature product card wireframe */}
      <div className="flex w-52 items-stretch gap-2 rounded-md border border-zinc-900/10 bg-background p-2 shadow-xs sm:w-56 dark:border-white/10 dark:bg-zinc-950">
        {/* Left slot: product thumbnail with diagonal hatch + corner crop */}
        <div className="relative size-16 shrink-0 overflow-hidden rounded border border-zinc-900/10 bg-zinc-900/[0.05] sm:size-[72px] dark:border-white/10 dark:bg-white/[0.05]">
          {/* Diagonal corner crop */}
          <div className="absolute top-0 right-0 size-4 bg-background [clip-path:polygon(100%_0,0_0,100%_100%)] dark:bg-zinc-950" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag
              className="size-5 text-zinc-900/30 dark:text-white/30"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Right slot: meta + price + action */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
          {/* Title wireframe bars */}
          <div className="h-1 w-16 rounded-full bg-zinc-900/70 dark:bg-white/70" />
          <div className="h-1 w-9 rounded-full bg-zinc-900/25 dark:bg-white/25" />

          {/* Category tag */}
          <span className="w-fit rounded border border-zinc-900/15 bg-zinc-900/[0.04] px-1 py-0.5 font-mono text-[5px] tracking-widest text-zinc-900/50 uppercase dark:border-white/15 dark:bg-white/[0.04] dark:text-white/50">
            Apparel
          </span>

          {/* Price tag */}
          <span
            className={cn(
              "font-mono text-[11px] leading-none font-bold text-emerald-600 transition-transform duration-300 group-hover:scale-110 dark:text-emerald-400",
              active && "scale-110"
            )}
          >
            $129.00
          </span>

          {/* Add to Bag action */}
          <div
            aria-hidden="true"
            className={cn(
              "flex h-3.5 w-20 items-center justify-center gap-1 rounded border font-mono text-[6px] font-medium tracking-widest uppercase select-none",
              "border-zinc-900/20 bg-zinc-900/[0.06] text-zinc-600 transition-all duration-200",
              "group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground dark:border-white/20 dark:bg-white/[0.06] dark:text-zinc-300",
              active && "border-primary bg-primary text-primary-foreground"
            )}
          >
            <ShoppingBag className="size-2" strokeWidth={2} />
            Add to Bag
          </div>
        </div>
      </div>
    </div>
  )
}
