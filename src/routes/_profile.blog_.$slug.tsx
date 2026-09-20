import { createFileRoute, notFound } from "@tanstack/react-router"

import {
  blogPostBySlugQueryOptions,
  BlogPostDetail,
  blogPostsQueryOptions,
} from "@/features/blog"
import {
  createBlogArticleJsonLd,
  createSeoMeta,
  siteConfig,
} from "@/shared/config"

export const Route = createFileRoute("/_profile/blog_/$slug")({
  loader: async ({ context, params }) => {
    try {
      const [post, allPosts] = await Promise.all([
        context.queryClient.ensureQueryData(
          blogPostBySlugQueryOptions(params.slug)
        ),
        context.queryClient.ensureQueryData(blogPostsQueryOptions()),
      ])

      if (!post) {
        throw notFound()
      }

      return { post, allPosts }
    } catch (error) {
      if (
        (error as { status?: number })?.status === 404 ||
        (error as { isNotFound?: boolean })?.isNotFound
      ) {
        throw error
      }
      throw notFound()
    }
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post
    const title = post
      ? `${post.title} • Writing • Phong Phan`
      : "Blog Post • Phong Phan"
    const description =
      post?.excerpt ??
      "Articles, guides, and engineering notes on modern web development."
    const pageUrl = `${siteConfig.url}/blog/${params.slug}`
    const imageUrl = post?.coverImage?.url

    const articleJsonLd = post
      ? createBlogArticleJsonLd({
          title: post.title,
          description: post.excerpt,
          url: pageUrl,
          image: imageUrl,
          datePublished: post.publishedAt,
          authorName: post.author?.name,
        })
      : null

    return {
      meta: [
        ...createSeoMeta({
          title,
          description,
          ogImage: imageUrl,
          url: pageUrl,
        }),
        { property: "og:type", content: "article" },
        ...(post?.publishedAt
          ? [{ property: "article:published_time", content: post.publishedAt }]
          : []),
        ...(post?.author?.name
          ? [{ property: "article:author", content: post.author.name }]
          : []),
        ...(post?.tags?.map((t) => ({
          property: "article:tag",
          content: t.title,
        })) ?? []),
      ],
      links: [{ rel: "canonical", href: pageUrl }],
      scripts: articleJsonLd
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify(articleJsonLd),
            },
          ]
        : [],
    }
  },
  component: BlogPostDetailPage,
})

function BlogPostDetailPage() {
  const { post, allPosts } = Route.useLoaderData()
  return <BlogPostDetail post={post} allPosts={allPosts} />
}
