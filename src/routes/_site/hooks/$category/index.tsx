import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

import { HookGrid, HOOKS_DATA } from "@/features/hooks"
import {
  createSeoMeta,
  HOOK_CATEGORIES,
  isHookCategoryId,
} from "@/shared/config"

export const Route = createFileRoute("/_site/hooks/$category/")({
  loader: ({ params }) => {
    if (isHookCategoryId(params.category)) {
      return { category: params.category }
    }

    // Backward compatibility: If the parameter matches a hook slug directly, redirect!
    const matchedHook = HOOKS_DATA.find((h) => h.slug === params.category)
    if (matchedHook) {
      throw redirect({
        to: "/hooks/$category/$slug",
        params: {
          category: matchedHook.category,
          slug: matchedHook.slug,
        },
      })
    }

    throw notFound()
  },
  head: ({ loaderData }) => {
    const categoryConfig = HOOK_CATEGORIES.find(
      (c) => c.id === loaderData?.category
    )
    const categoryName = categoryConfig?.label ?? "React Hooks"
    return {
      meta: createSeoMeta({
        title: `${categoryName} Hooks • Phong Phan`,
        description: `Explore ${categoryName} custom React hooks and reactive primitives.`,
      }),
    }
  },
  component: HookCategoryPage,
})

function HookCategoryPage() {
  const { category } = Route.useLoaderData()
  return (
    <div className="w-full">
      <HookGrid category={category} />
    </div>
  )
}
