import { cn } from "@/shared/lib/utils"

import { ShowcaseBentoGrid } from "./components/showcase-bento-grid"
import { ShowcaseHeader } from "./components/showcase-header"
import { SHOWCASE_ITEMS } from "./showcase-data"
import type { SectionComponentsProps } from "./types"

/**
 * Section: UI Components Showcase (12-Column Unified Bento Grid)
 *
 * Implements a high-craft architectural UI showcase inspired by Chanh Dai:
 * - 12-Column unified CSS Grid layout with shared horizontal baselines (Zero "thụt thò")
 * - Razor-sharp 1px tile borders, dark glassmorphism surfaces, and micro-dot blueprint grid
 * - Natural asymmetrical spans (8-col wide Terminal runner + 4-col Middle Truncation code block)
 * - Full-width 12-col Ecosystem standards bar
 * - High-craft CAD radar loaders with zero layout shift
 */
export function SectionComponents({
  items = SHOWCASE_ITEMS,
  className,
}: SectionComponentsProps) {
  return (
    <section
      id="components-ui"
      data-section="components-ui"
      className={cn(
        "my-8 w-full border-y border-border bg-card/20 py-16 select-none",
        className
      )}
    >
      {/* ─── Top Showcase Header ─── */}
      <ShowcaseHeader
        romanIndex="III"
        title="UI COMPONENTS SHOWCASE"
        subtitle="INTERACTIVE PRIMITIVES • SHADERS • TACTILE PHYSICS"
        catalogHref="/ui/$collection"
        catalogCount={37}
      />

      {/* ─── 12-Column Unified Bento Grid ─── */}
      <ShowcaseBentoGrid items={items} />
    </section>
  )
}

export default SectionComponents
