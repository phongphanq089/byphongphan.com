import {
  BLOCKS_DATA,
  type FeaturedBlockCategoryId,
  getFeaturedBlockCategories,
} from "@/features/blocks/blocks-data"
import { BlockCategoryCard } from "@/features/blocks/components/block-category-card"
import { BlockCategoryViewAllCard } from "@/features/blocks/components/block-category-view-all-card"
import { RenderBlockCategorySchematic } from "@/features/blocks/components/schematics"
import { SectionHeading } from "@/shared/ui/system/section-heading"

const CATEGORY_SPECS: Record<
  FeaturedBlockCategoryId,
  { specsLabel: string; paddingPx: number }
> = {
  marketing: { specsLabel: "p16 - r8 - hero & metrics", paddingPx: 16 },
  "404-page": { specsLabel: "p14 - r6 - 2d physics game", paddingPx: 14 },
  auth: { specsLabel: "p16 - r8 - form & input", paddingPx: 16 },
}

export const SectionBlocks = () => {
  const categories = getFeaturedBlockCategories()
  const totalCount = BLOCKS_DATA.length

  const [marketing, notFound, auth] = categories

  return (
    <section
      id="blocks"
      className="relative flex w-full flex-col bg-background text-foreground"
    >
      <div className="-mt-px border-y border-border">
        <SectionHeading
          id="blocks"
          heading="Production Blocks"
          count={totalCount}
          actionHref="/blocks"
          actionLabel="All blocks"
        />
      </div>

      {/* 2x2 Grid: 3 Category Cards + View All Slot */}
      <div className="grid w-full grid-cols-1 border-b border-border md:grid-cols-2">
        {/* Slot 1: Marketing */}
        <div className="flex h-full w-full border-b border-border p-4 sm:p-5 md:border-r md:p-6">
          <BlockCategoryCard
            id={marketing.id}
            index={marketing.index}
            title={marketing.title}
            count={marketing.count}
            specsLabel={CATEGORY_SPECS[marketing.id].specsLabel}
            paddingPx={CATEGORY_SPECS[marketing.id].paddingPx}
          >
            <RenderBlockCategorySchematic category={marketing.id} />
          </BlockCategoryCard>
        </div>

        {/* Slot 2: 404 Page */}
        <div className="flex h-full w-full border-b border-border p-4 sm:p-5 md:p-6">
          <BlockCategoryCard
            id={notFound.id}
            index={notFound.index}
            title={notFound.title}
            count={notFound.count}
            specsLabel={CATEGORY_SPECS[notFound.id].specsLabel}
            paddingPx={CATEGORY_SPECS[notFound.id].paddingPx}
          >
            <RenderBlockCategorySchematic category={notFound.id} />
          </BlockCategoryCard>
        </div>

        {/* Slot 3: Auth */}
        <div className="flex h-full w-full border-b border-border p-4 sm:p-5 md:border-r md:border-b-0 md:p-6">
          <BlockCategoryCard
            id={auth.id}
            index={auth.index}
            title={auth.title}
            count={auth.count}
            specsLabel={CATEGORY_SPECS[auth.id].specsLabel}
            paddingPx={CATEGORY_SPECS[auth.id].paddingPx}
          >
            <RenderBlockCategorySchematic category={auth.id} />
          </BlockCategoryCard>
        </div>

        {/* Slot 4: View All Blocks */}
        <div className="flex h-full w-full p-4 sm:p-5 md:p-6">
          <BlockCategoryViewAllCard totalCount={totalCount} />
        </div>
      </div>
    </section>
  )
}
