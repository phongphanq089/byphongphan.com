import { cn } from "@/shared/lib/utils"

import { SHOWCASE_ITEMS } from "../showcase-data"
import type { ShowcaseBentoGridProps } from "../types"
import { LazyShowcaseCard } from "./lazy-showcase-card"

/**
 * 15-Component Repeating Bento Grid Matrix (5 Columns × 12 Rows)
 *
 * Implements a strict repeating tessellation formula based on the user's asymmetric 5-column grid:
 * - Block 1 (Rows 1–5):   6 components (2x2, 1x3 vertical LineNav, 2x3 hero, 2x2, 2x3 hero, 1x2 compact button)
 * - Block 2 (Rows 6–10):  6 components (repeating pattern with ScrollIndicator vertical caliper)
 * - Block 3 (Rows 11–12): 3 components (full-width 5-column balanced finale: 2x2, 1x2, 2x2)
 *
 * 100% flush baselines across all columns with zero protrusion ("không bao giờ bị thụt thò").
 */
export function ShowcaseBentoGrid({
  items = SHOWCASE_ITEMS,
  className,
}: ShowcaseBentoGridProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4 px-4 sm:px-6 md:grid-cols-2 md:px-8 lg:grid-cols-4 xl:px-10 2xl:auto-rows-[minmax(160px,auto)] 2xl:grid-cols-5 2xl:px-12",
        className
      )}
    >
      {items.map((item) => (
        <LazyShowcaseCard key={item.slug} item={item} />
      ))}
    </div>
  )
}

export default ShowcaseBentoGrid
