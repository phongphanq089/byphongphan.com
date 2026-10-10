import { createFileRoute, notFound } from "@tanstack/react-router"

import { BlockGrid } from "@/features/blocks"
import { createSeoMeta, isBlockCategoryId } from "@/shared/config"

export const Route = createFileRoute("/_site/blocks/$category/")({
  loader: ({ params }) => {
    if (!isBlockCategoryId(params.category)) {
      throw notFound()
    }
    return { category: params.category }
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
