import { ComponentCategoryCard } from "@/features/component-ui/components/component-category-card"
import { ComponentCategoryViewAllCard } from "@/features/component-ui/components/component-category-view-all-card"
import { RenderComponentCategorySchematic } from "@/features/component-ui/components/schematics"
import {
  COMPONENTS_DATA,
  getFeaturedComponentCategories,
} from "@/features/component-ui/components-data"
import { cn } from "@/shared/lib/utils"
import { SectionHeading } from "@/shared/ui/system/section-heading"

const UiComponentsSection = () => {
  const categories = getFeaturedComponentCategories()
  const totalCount = COMPONENTS_DATA.length

  return (
    <section
      id="components-ui"
      className="relative flex w-full flex-col bg-background text-foreground"
    >
      <div className="-mt-px border-y border-border">
        <SectionHeading
          id="components-ui"
          heading="UI Primitives"
          count={totalCount}
          actionHref="/component-ui"
          actionLabel="All components"
        />
      </div>

      {/* 2-Column Grid (3 rows × 2 cols: 5 categories + View All slot) */}
      <div className="grid w-full grid-cols-1 border-b border-border md:grid-cols-2">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className={cn(
              "flex h-full w-full border-b border-border p-4 sm:p-5 md:p-6",
              // Right vertical border on left column on md+
              idx % 2 === 0 && "md:border-r md:border-border",
              // Remove bottom border on last row on md+
              idx >= 4 && "md:border-b-0"
            )}
          >
            <ComponentCategoryCard
              id={cat.id}
              index={cat.index}
              title={cat.title}
              count={cat.count}
              specsLabel={cat.specsLabel}
              paddingPx={cat.paddingPx}
            >
              <RenderComponentCategorySchematic category={cat.id} />
            </ComponentCategoryCard>
          </div>
        ))}

        {/* Slot 6: View All Components */}
        <div className="flex h-full w-full p-4 sm:p-5 md:p-6">
          <ComponentCategoryViewAllCard totalCount={totalCount} />
        </div>
      </div>
    </section>
  )
}

export default UiComponentsSection
