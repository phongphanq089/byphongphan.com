import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

import { ComponentGrid, COMPONENTS_DATA } from "@/features/component-ui"
import type { ComponentCategoryId } from "@/features/component-ui/types"
import { createSeoMeta } from "@/shared/config"

const VALID_CATEGORIES: ComponentCategoryId[] = [
  "primitives",
  "animations",
  "foundations",
]

export const Route = createFileRoute("/_profile/component-ui/$category/")({
  loader: ({ params }) => {
    const cat = params.category as ComponentCategoryId
    if (VALID_CATEGORIES.includes(cat)) {
      return { category: cat }
    }

    // Backward compatibility: If the parameter matches a component slug directly, redirect!
    const matchedComponent = COMPONENTS_DATA.find(
      (c) => c.slug === params.category
    )
    if (matchedComponent) {
      throw redirect({
        to: "/component-ui/$category/$slug",
        params: {
          category: matchedComponent.category,
          slug: matchedComponent.slug,
        },
      })
    }

    throw notFound()
  },
  head: ({ loaderData }) => {
    const categoryName = loaderData?.category
      ? loaderData.category.charAt(0).toUpperCase() +
        loaderData.category.slice(1)
      : "UI Components"
    return {
      meta: createSeoMeta({
        title: `${categoryName} Components • Phong Phan`,
        description: `Explore ${categoryName} production-grade UI components and interactive documentation.`,
      }),
    }
  },
  component: ComponentCategoryPage,
})

function ComponentCategoryPage() {
  const { category } = Route.useLoaderData()
  return (
    <div className="w-full">
      <ComponentGrid category={category} />
    </div>
  )
}
