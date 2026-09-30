import { createFileRoute } from "@tanstack/react-router"

import { BlockGrid } from "@/features/blocks"
import { createSeoMeta, pagesSeoConfig, siteConfig } from "@/shared/config"

export const Route = createFileRoute("/_site/blocks/")({
  head: () => ({
    meta: createSeoMeta({
      title: pagesSeoConfig.block.title,
      description: pagesSeoConfig.block.description,
      url: `${siteConfig.url}/blog`,
    }),
  }),
  component: BlocksAllPage,
})

function BlocksAllPage() {
  return (
    <div className="w-full">
      <BlockGrid category="all" />
    </div>
  )
}
