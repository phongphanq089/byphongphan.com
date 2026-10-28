import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

import {
  ComponentDetailSkeleton,
  COMPONENTS_DATA,
} from "@/features/component-ui"
import { ComponentDetail } from "@/features/component-ui/components/component-detail"
import { createSeoMeta, siteConfig } from "@/shared/config"

export const Route = createFileRoute("/_site/component-ui/$category/$slug")({
  loader: ({ params }) => {
    // 1. Direct match on current category & slug
    const component = COMPONENTS_DATA.find(
      (c) => c.category === params.category && c.slug === params.slug
    )
    if (component) {
      return { component }
    }

    // 2. Check aliases or cross-category renames for 301 redirection
    const aliasComponent = COMPONENTS_DATA.find(
      (c) =>
        c.aliases?.includes(params.slug) ||
        (c.slug === params.slug && c.category !== params.category)
    )
    if (aliasComponent) {
      throw redirect({
        to: "/component-ui/$category/$slug",
        params: {
          category: aliasComponent.category,
          slug: aliasComponent.slug,
        },
        statusCode: 301,
      })
    }

    throw notFound()
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
  return <ComponentDetail component={component} />
}
