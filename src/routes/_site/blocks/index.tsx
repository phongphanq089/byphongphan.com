import { createFileRoute } from "@tanstack/react-router"

import { BlockGrid } from "@/features/blocks"
import { createSeoMeta, siteConfig } from "@/shared/config"

export const Route = createFileRoute("/_site/blocks/")({
  head: () => ({
    meta: createSeoMeta({
      title: "Engineering Blog • Phong Phan",
      description: "Writing on engineering, architecture, and UI.",
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
