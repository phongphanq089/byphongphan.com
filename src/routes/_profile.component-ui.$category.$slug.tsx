import { createFileRoute, notFound } from "@tanstack/react-router"

import { ComponentDetail, COMPONENTS_DATA } from "@/features/component-ui"
import { createSeoMeta, siteConfig } from "@/shared/config"

export const Route = createFileRoute("/_profile/component-ui/$category/$slug")({
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
  return <ComponentDetail component={component} />
}
