import { createFileRoute, notFound } from "@tanstack/react-router"

import { resolveStudioSegment, StudioCatalogGrid } from "@/features/ui-studio"

export const Route = createFileRoute("/ui/$collection/")({
  loader: ({ params }) => {
    const resolved = resolveStudioSegment(params.collection)
    if (!resolved) {
      throw notFound()
    }
    return { segment: params.collection, kind: resolved.kind }
  },
  head: ({ params }) => {
    const resolved = resolveStudioSegment(params.collection)
    const label = resolved?.label ?? "UI Studio"
    return {
      meta: [
        { title: `${label} • UI Studio` },
        {
          name: "description",
          content: `Browse the ${label.toLowerCase()} collection of the byphongphan registry — interactive previews and one-command installs.`,
        },
      ],
    }
  },
  component: UiCollectionPage,
})

function UiCollectionPage() {
  const { segment } = Route.useLoaderData()
  return <StudioCatalogGrid segment={segment} />
}
