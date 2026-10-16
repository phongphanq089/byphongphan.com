import { createFileRoute, notFound } from "@tanstack/react-router"

import { BlockDetailSkeleton, BLOCKS_DATA } from "@/features/blocks"
import { BlockDetail } from "@/features/blocks/components/block-detail"
import { createSeoMeta, siteConfig } from "@/shared/config"

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
  pendingComponent: BlockDetailPendingComponent,
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

function BlockDetailPendingComponent() {
  const { category, slug } = Route.useParams()
  const block = BLOCKS_DATA.find(
    (b) => b.category === category && b.slug === slug
  )
  return (
    <BlockDetailSkeleton
      title={block?.title}
      category={category}
      description={block?.description}
      slug={slug}
    />
  )
}

function BlockDetailPage() {
  const { block } = Route.useLoaderData()
  return <BlockDetail block={block} />
}
