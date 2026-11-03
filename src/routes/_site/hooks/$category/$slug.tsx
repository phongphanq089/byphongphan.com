import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

import { HookDetail, HOOKS_DATA } from "@/features/hooks"
import { createSeoMeta, siteConfig } from "@/shared/config"

export const Route = createFileRoute("/_site/hooks/$category/$slug")({
  loader: ({ params }) => {
    // 1. Direct match on current category & slug
    const hook = HOOKS_DATA.find(
      (h) => h.category === params.category && h.slug === params.slug
    )
    if (hook) {
      return { hook }
    }

    // 2. Check if slug matches across categories for 301 redirection
    const aliasHook = HOOKS_DATA.find((h) => h.slug === params.slug)
    if (aliasHook) {
      throw redirect({
        to: "/hooks/$category/$slug",
        params: {
          category: aliasHook.category,
          slug: aliasHook.slug,
        },
        statusCode: 301,
      })
    }

    throw notFound()
  },
  head: ({ loaderData, params }) => {
    const title = loaderData?.hook
      ? `${loaderData.hook.name} Hook • Phong Phan`
      : "Hook Details • Phong Phan"
    const description =
      loaderData?.hook?.description ??
      "Production-ready React hook with TypeScript safety and interactive playground."
    const pageUrl = `${siteConfig.url}/hooks/${params.category}/${params.slug}`

    return {
      meta: createSeoMeta({
        title,
        description,
        url: pageUrl,
      }),
      links: [{ rel: "canonical", href: pageUrl }],
    }
  },
  component: HookDetailPage,
})

function HookDetailPage() {
  const { hook } = Route.useLoaderData()
  return <HookDetail hook={hook} />
}
