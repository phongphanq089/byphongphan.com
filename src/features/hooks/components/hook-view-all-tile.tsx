import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { StripedPattern } from "@/shared/ui/system"

export interface HookViewAllTileProps {
  /** Total number of hooks published in the registry */
  totalCount: number
  className?: string
}

/**
 * Final slot of the homepage hooks grid — a dashed "blueprint hatch" panel
 * leading to the full hooks directory. Cell borders are owned by the grid.
 */
export function HookViewAllTile({
  totalCount,
  className,
}: HookViewAllTileProps) {
  return (
    <Link
      to="/hooks"
      className={cn(
        "group relative flex h-full min-h-[96px] w-full flex-col items-center justify-center gap-1.5 overflow-hidden bg-muted/20 p-4 text-center transition-colors duration-200 outline-none sm:min-h-[104px] sm:p-5",
        "hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-inset dark:bg-muted/10 dark:hover:bg-zinc-900/50",
        className
      )}
    >
      <StripedPattern
        variant="absolute"
        className="opacity-60 dark:opacity-30"
      />

      {/* Dashed blueprint hatch frame inside the cell */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-2 rounded-md border border-dashed border-border/70 transition-colors duration-200 group-hover:border-primary/40"
      />

      <span className="relative z-10 font-mono text-[9px] font-medium tracking-[0.2em] text-muted-foreground/60 select-none">
        [15]
      </span>
      <span className="relative z-10 flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.18em] text-foreground uppercase transition-colors duration-200 group-hover:text-primary sm:text-[11px]">
        View All Hooks
        <ArrowRight
          aria-hidden="true"
          className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
      <span className="relative z-10 rounded border border-border bg-background/80 px-2 py-0.5 font-mono text-[8px] font-medium tracking-[0.14em] text-muted-foreground uppercase backdrop-blur-xs">
        {totalCount}+ Hooks · 5 Categories
      </span>
    </Link>
  )
}
