import { createFileRoute, notFound } from "@tanstack/react-router"

import { BlockGrid } from "@/features/blocks"
import type { BlockCategoryId } from "@/features/blocks/types"
import { createSeoMeta } from "@/shared/config"

const VALID_CATEGORIES: BlockCategoryId[] = [
  "marketing",
  "application",
  "ecommerce",
]

export const Route = createFileRoute("/_site/blocks/$category/")({
  loader: ({ params }) => {
    const cat = params.category as BlockCategoryId
    if (!VALID_CATEGORIES.includes(cat)) {
      throw notFound()
    }
    return { category: cat }
  },
  head: ({ loaderData }) => {
    const categoryName = loaderData?.category
      ? loaderData.category.charAt(0).toUpperCase() +
        loaderData.category.slice(1)
      : "Blocks"
    return {
      meta: createSeoMeta({
        title: `${categoryName} Blocks • Phong Phan`,
        description: `Explore ${categoryName} responsive UI blocks and section layouts.`,
      }),
    }
  },
  component: BlockCategoryPage,
})

function BlockCategoryPage() {
  const { category } = Route.useLoaderData()
  return (
    <div className="w-full">
      <BlockGrid category={category} />
    </div>
  )
}
