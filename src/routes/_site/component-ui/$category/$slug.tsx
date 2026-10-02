import { createFileRoute, notFound } from "@tanstack/react-router"
import { Suspense } from "react"

import { COMPONENTS_DATA } from "@/features/component-ui/components-data"
import { createSeoMeta, siteConfig } from "@/shared/config"
import { lazyWithRetry } from "@/shared/lib/lazy-with-retry"

const LazyComponentDetail = lazyWithRetry(() =>
  import("@/features/component-ui/components/component-detail").then((m) => ({
    default: m.ComponentDetail,
  }))
)

export const Route = createFileRoute("/_site/component-ui/$category/$slug")({
  loader: ({ params }) => {
    const component = COMPONENTS_DATA.find(
      (c) => c.category === params.category && c.slug === params.slug
    )
    if (!component) {
      throw notFound()
    }
    return { component }
  },
  head: ({ loaderData, params }) => {
    const title = loaderData?.component
      ? `${loaderData.component.name} Component • Phong Phan`
      : "Component Details • Phong Phan"
    const description =
      loaderData?.component?.description ??
      "Pixel-perfect UI component documentation and preview."
    const pageUrl = `${siteConfig.url}/component-ui/${params.category}/${params.slug}`

    return {
      meta: createSeoMeta({
        title,
        description,
        url: pageUrl,
      }),
      links: [{ rel: "canonical", href: pageUrl }],
    }
  },
  component: ComponentDetailPage,
})

function ComponentDetailPage() {
  const { component } = Route.useLoaderData()
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] w-full items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            <span>Loading component...</span>
          </div>
        </div>
      }
    >
      <LazyComponentDetail component={component} />
    </Suspense>
  )
}
