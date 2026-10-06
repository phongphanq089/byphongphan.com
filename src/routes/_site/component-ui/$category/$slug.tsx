import { createFileRoute, notFound } from "@tanstack/react-router"
import { Suspense } from "react"

import {
  ComponentDetailSkeleton,
  COMPONENTS_DATA,
} from "@/features/component-ui"
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
  pendingComponent: ComponentDetailPendingComponent,
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

function ComponentDetailPendingComponent() {
  const { category, slug } = Route.useParams()
  const component = COMPONENTS_DATA.find(
    (c) => c.category === category && c.slug === slug
  )
  return (
    <ComponentDetailSkeleton
      name={component?.name}
      category={category}
      description={component?.description}
      slug={slug}
    />
  )
}

function ComponentDetailPage() {
  const { component } = Route.useLoaderData()
  return (
    <Suspense
      fallback={
        <ComponentDetailSkeleton
          name={component.name}
          category={component.category}
          description={component.description}
          slug={component.slug}
        />
      }
    >
      <LazyComponentDetail component={component} />
    </Suspense>
  )
}
