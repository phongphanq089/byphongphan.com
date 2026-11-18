import { createFileRoute, notFound } from "@tanstack/react-router"

import { StudioCanvas } from "@/features/ui-studio/components/studio-canvas"
import { resolveStudioItem } from "@/features/ui-studio/model/unified-registry.adapter"
import { siteConfig } from "@/shared/config"

export const Route = createFileRoute("/ui/$collection/$slug")({
  loader: ({ params }) => {
    const record = resolveStudioItem(params.collection, params.slug)
    if (!record) {
      throw notFound()
    }
    return { segment: params.collection, slug: params.slug }
  },
  head: ({ params }) => {
    const record = resolveStudioItem(params.collection, params.slug)
    const title = record?.item.title ?? "UI Studio"
    const description =
      record?.item.description ??
      "Interactive registry item in the byphongphan UI Studio."
    const url = `${siteConfig.url}/ui/${params.collection}/${params.slug}`

    return {
      meta: [
        { title: `${title} • UI Studio` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} • UI Studio` },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    }
  },
  component: UiItemDetailPage,
})

function UiItemDetailPage() {
  const { segment, slug } = Route.useLoaderData()
  const record = resolveStudioItem(segment, slug)

  if (!record) {
    // Loader guarantees presence; defensive branch for client-side navigations
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
          Item not found
        </p>
        <p className="max-w-60 text-sm text-muted-foreground">
          This registry entry is missing locally. Run the registry build and try
          again.
        </p>
      </div>
    )
  }

  return <StudioCanvas item={record.item} />
}
