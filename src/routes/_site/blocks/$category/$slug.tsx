import { createFileRoute, notFound } from "@tanstack/react-router"
import { Suspense } from "react"

import { BLOCKS_DATA } from "@/features/blocks/blocks-data"
import { createSeoMeta, siteConfig } from "@/shared/config"
import { lazyWithRetry } from "@/shared/lib/lazy-with-retry"

const LazyBlockDetail = lazyWithRetry(() =>
  import("@/features/blocks/components/block-detail").then((m) => ({
    default: m.BlockDetail,
  }))
)

export const Route = createFileRoute("/_site/blocks/$category/$slug")({
  loader: ({ params }) => {
    const block = BLOCKS_DATA.find(
      (b) => b.category === params.category && b.slug === params.slug
    )
    if (!block) {
      throw notFound()
    }
    return { block }
  },
  head: ({ loaderData, params }) => {
    const title = loaderData?.block
      ? `${loaderData.block.title} • Phong Phan Blocks`
      : "Block Details • Phong Phan"
    const description =
      loaderData?.block?.description ??
      "Production-ready responsive UI block template."
    const pageUrl = `${siteConfig.url}/blocks/${params.category}/${params.slug}`

    return {
      meta: createSeoMeta({
        title,
        description,
        url: pageUrl,
      }),
      links: [{ rel: "canonical", href: pageUrl }],
    }
  },
  component: BlockDetailPage,
})

function BlockDetailPage() {
  const { block } = Route.useLoaderData()
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] w-full items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="size-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            <span>Loading block...</span>
          </div>
        </div>
      }
    >
      <LazyBlockDetail block={block} />
    </Suspense>
  )
}
