import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { SpotlightCard } from "@/shared/ui/core"
import { StripedPattern } from "@/shared/ui/system"

export interface ComponentCategoryViewAllCardProps {
  /** Total number of components published in the registry */
  totalCount: number
}

/**
 * Slot 6 of the homepage UI primitives grid — an architectural blueprint
 * "View All Components" card leading to the full component directory.
 */
export function ComponentCategoryViewAllCard({
  totalCount,
}: ComponentCategoryViewAllCardProps) {
  return (
    <SpotlightCard
      enableTilt
      spotlightSize={320}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-xl p-0 transition-all duration-300",
        "border border-black/10 bg-muted/80 backdrop-blur-xl dark:border-white/10 dark:bg-muted/40",
        "hover:shadow-xl",
        "focus-within:ring-2 focus-within:ring-primary/50"
      )}
      contentClassName="h-full flex-col justify-between"
    >
      <Link
        to="/component-ui"
        className="flex h-full w-full flex-col justify-between gap-3 p-4 focus:outline-none sm:p-5"
      >
        {/* Top row: index + title · count + arrow */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-mono text-[11px] font-medium text-muted-foreground/60 select-none">
              [06]
            </span>
            <h3 className="truncate font-mono text-xs font-bold tracking-widest text-foreground uppercase transition-colors group-hover:text-primary sm:text-sm">
              View All Components
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-medium text-muted-foreground transition-colors duration-200 group-hover:text-primary">
            <span>({totalCount}+)</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Center: diagonal hatch blueprint panel */}
        <div className="relative flex min-h-[228px] w-full flex-1 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-border/80 bg-muted/30 p-6 text-center transition-colors group-hover:border-primary/40 sm:min-h-[236px]">
          <StripedPattern
            variant="absolute"
            className="opacity-70 dark:opacity-40"
          />
          <span className="relative z-10 rounded border border-border bg-background/80 px-2 py-1 font-mono text-[8px] font-medium tracking-widest text-muted-foreground uppercase backdrop-blur-xs">
            {totalCount}+ UI Primitives across 6 Categories
          </span>
          <span className="relative z-10 text-sm font-semibold tracking-tight text-foreground sm:text-base">
            Explore All Component Categories
          </span>
          <p className="relative z-10 max-w-[230px] text-[10px] leading-relaxed text-muted-foreground">
            Browse primitives, blueprints, and interactive demos.
          </p>
          <span className="relative z-10 mt-1 inline-flex items-center gap-1.5 rounded border border-black/10 bg-background px-3 py-1.5 font-mono text-[10px] font-medium text-foreground shadow-xs backdrop-blur-xs transition-all duration-200 group-hover:border-primary/40 group-hover:text-primary dark:border-white/10">
            Browse Full Directory
            <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </SpotlightCard>
  )
}
