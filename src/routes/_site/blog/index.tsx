import { createFileRoute } from "@tanstack/react-router"

import { createSeoMeta, siteConfig } from "@/shared/config"
import { UnderConstructionBlock } from "@/shared/ui"

export const Route = createFileRoute("/_site/blog/")({
  head: () => ({
    meta: createSeoMeta({
      title: "Engineering Blog • Phong Phan",
      description: "Writing on engineering, architecture, and UI.",
      url: `${siteConfig.url}/blog`,
    }),
  }),
  component: BlogPage,
})
function BlogPage() {
  return (
    <div className="w-full">
      <UnderConstructionBlock
        moduleName="Engineering Blog"
        moduleBadge="BLOG_202"
      />
    </div>
  )
}
