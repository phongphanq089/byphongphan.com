import { createFileRoute } from "@tanstack/react-router"

import { createSeoMeta } from "@/shared/config"
import { UnderConstructionBlock } from "@/shared/ui"

export const Route = createFileRoute("/_site/blog/")({
  head: () => ({
    meta: createSeoMeta("blog"),
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
