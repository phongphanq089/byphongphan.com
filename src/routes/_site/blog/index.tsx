import { createFileRoute } from "@tanstack/react-router"

import { createSeoMeta, pagesSeoConfig, siteConfig } from "@/shared/config"
import { UnderConstructionBlock } from "@/shared/ui"

export const Route = createFileRoute("/_site/blog/")({
  head: () => ({
    meta: createSeoMeta({
      title: pagesSeoConfig.blog.title,
      description: pagesSeoConfig.blog.description,
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
