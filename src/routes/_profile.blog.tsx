import { createFileRoute } from "@tanstack/react-router"

import {
  blogCategoriesQueryOptions,
  BlogGrid,
  blogGroupsQueryOptions,
  blogPostsQueryOptions,
  blogTagsQueryOptions,
} from "@/features/blog"
import { createSeoMeta } from "@/shared/config"
import { IS_PUBLIC_UI } from "@/shared/constants"
import { UnderConstructionBlock } from "@/shared/ui"

export const Route = createFileRoute("/_profile/blog")({
  loader: async ({ context }) => {
    try {
      const [posts, categories, tags, groups] = await Promise.all([
        context.queryClient.ensureQueryData(blogPostsQueryOptions()),
        context.queryClient.ensureQueryData(blogCategoriesQueryOptions()),
        context.queryClient.ensureQueryData(blogTagsQueryOptions()),
        context.queryClient.ensureQueryData(blogGroupsQueryOptions()),
      ])
      return { posts, categories, tags, groups }
    } catch {
      return {
        posts: undefined,
        categories: undefined,
        tags: undefined,
        groups: undefined,
      }
    }
  },
  head: () => ({
    meta: createSeoMeta("blog"),
  }),
  component: BlogPage,
})
function BlogPage() {
  const loaderData = Route.useLoaderData()

  return (
    <div className="w-full">
      {IS_PUBLIC_UI ? (
        <BlogGrid
          initialPosts={loaderData?.posts}
          initialCategories={loaderData?.categories}
          initialTags={loaderData?.tags}
          initialGroups={loaderData?.groups}
        />
      ) : (
        <UnderConstructionBlock
          moduleName="Engineering Blog"
          moduleBadge="BLOG_202"
        />
      )}
    </div>
  )
}
