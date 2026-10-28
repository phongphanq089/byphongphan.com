import { createFileRoute, notFound, redirect } from "@tanstack/react-router"

import { BlockDetailSkeleton, BLOCKS_DATA } from "@/features/blocks"
import { BlockDetail } from "@/features/blocks/components/block-detail"
import { createSeoMeta, siteConfig } from "@/shared/config"

export const Route = createFileRoute("/_site/blocks/$category/$slug")({
  loader: ({ params }) => {
    // 1. Direct match on current category & slug
    const block = BLOCKS_DATA.find(
      (b) => b.category === params.category && b.slug === params.slug
    )
    if (block) {
      return { block }
    }

    // 2. Check aliases or cross-category renames for 301 redirection
    const aliasBlock = BLOCKS_DATA.find(
      (b) =>
        b.aliases?.includes(params.slug) ||
        (b.slug === params.slug && b.category !== params.category)
    )
    if (aliasBlock) {
      throw redirect({
        to: "/blocks/$category/$slug",
        params: {
          category: aliasBlock.category,
          slug: aliasBlock.slug,
        },
        statusCode: 301,
      })
    }

    throw notFound()
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
