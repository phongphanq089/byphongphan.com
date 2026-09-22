/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"

import { siteConfig } from "@/shared/config/site.config"

import type {
  BlogAuthor,
  BlogCategory,
  BlogGroup,
  BlogPost,
  BlogTag,
} from "../types"

// ============================================================================
// 2. HELPERS & FORMATTERS
// ============================================================================

function resolveSlug(
  slug: string | { current: string } | undefined,
  fallback: string
): { current: string } {
  if (typeof slug === "string") return { current: slug }
  if (slug && typeof slug.current === "string") return slug
  return { current: fallback }
}

function resolveImageUrl(
  image: unknown,
  fallback = "/images/placeholder.webp"
): string {
  if (typeof image === "string" && image.trim() !== "") return image.trim()
  if (
    typeof image === "object" &&
    image !== null &&
    "url" in image &&
    typeof (image as { url: unknown }).url === "string"
  ) {
    return (image as { url: string }).url.trim()
  }
  return fallback
}

function extractHexColor(color: unknown): string | undefined {
  if (!color) return undefined
  if (typeof color === "string") return color
  if (
    typeof color === "object" &&
    "hex" in color &&
    typeof (color as { hex: unknown }).hex === "string"
  ) {
    return (color as { hex: string }).hex
  }
  return undefined
}

const DEFAULT_BLOG_AUTHOR: BlogAuthor = {
  name: siteConfig.author.name,
  role: siteConfig.author.role,
  avatar: siteConfig.author.avatar,
  verified: true,
}

export function formatRawPost(item: any): BlogPost {
  const fallbackSlug = item.title?.toLowerCase().replace(/\s+/g, "-") || "post"
  const coverImageUrl = resolveImageUrl(item.coverImage)

  const categories: BlogCategory[] = Array.isArray(item.categories)
    ? item.categories.map((c: any, idx: number) => ({
        _id: c.id || `cat-${idx}`,
        title: c.title || "Uncategorized",
        slug: resolveSlug(c.slug, `cat-${idx}`),
        description: c.description,
        color: extractHexColor(c.color),
      }))
    : []

  const tags: BlogTag[] = Array.isArray(item.tags)
    ? item.tags.map((t: any, idx: number) => ({
        _id: t.id || `tag-${idx}`,
        title: t.title || "Tag",
        slug: resolveSlug(t.slug, `tag-${idx}`),
        description: t.description,
      }))
    : []

  let group: BlogGroup | undefined = undefined
  if (item.group) {
    group = {
      _id: item.group.id || "group",
      _type: "group",
      title: item.group.title || "Series",
      slug: resolveSlug(item.group.slug, "series"),
      description: item.group.description || "",
      coverImage: {
        url: resolveImageUrl(item.group.coverImage),
        alt: item.group.title || "Series cover",
      },
      isCompleted: Boolean(item.group.isCompleted),
    }
  }

  return {
    _id: item.id || fallbackSlug,
    title: item.title || "Untitled Post",
    slug: resolveSlug(item.slug, fallbackSlug),
    excerpt: item.excerpt || "",
    coverImage: {
      url: coverImageUrl,
      alt:
        typeof item.coverImage === "object" &&
        item.coverImage &&
        "alt" in item.coverImage
          ? item.coverImage.alt || item.title
          : item.title || "Blog post cover",
    },
    categories,
    tags,
    group,
    groupOrder: item.groupOrder,
    publishedAt: item.publishedAt || new Date().toISOString(),
    readTime: item.readTime ?? 5,
    isFeatured: Boolean(item.isFeatured),
    author: item.author || DEFAULT_BLOG_AUTHOR,
    body: item.body || [],
  }
}

// ============================================================================
// 3. SERVER FUNCTIONS
// ============================================================================

/**
 * Server Function
 */
export const getBlogPostsServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogPost[]> => {
    try {
      const rawItems: any[] = []
      return rawItems.map(formatRawPost)
    } catch (error) {
      console.error("[ServerFn] Failed to fetch blog posts:", error)
      return []
    }
  }
)

/**
 * Server Function: Lấy bài viết chi tiết theo slug
 */
export const getBlogPostBySlugServerFn = createServerFn({
  method: "GET",
})
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }): Promise<BlogPost | null> => {
    if (!slug) return null

    try {
      // TODO: Query trực tiếp bài viết theo slug từ DB
      const post: any = null
      if (!post) return null
      return formatRawPost(post)
    } catch (error) {
      console.error(`[ServerFn] Failed to fetch blog post (${slug}):`, error)
      return null
    }
  })
/**
 * Server Function: Lấy danh mục bài viết
 */
export const getBlogCategoriesServerFn = createServerFn({
  method: "GET",
}).handler(async (): Promise<BlogCategory[]> => {
  try {
    // TODO: Query categories từ DB
    const rawCategories: any[] = []
    return rawCategories.map((cat: any, idx: number) => ({
      _id: cat.id || `cat-${idx}`,
      title: cat.title || "Category",
      slug: resolveSlug(cat.slug, `cat-${idx}`),
      description: cat.description,
      color: extractHexColor(cat.color),
    }))
  } catch (error) {
    console.error("[ServerFn] Failed to fetch blog categories:", error)
    return []
  }
})

/**
 * Server Function
 */
export const getBlogTagsServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogTag[]> => {
    try {
      const rawTags: any[] = []
      return rawTags.map((tag: any, idx: number) => ({
        _id: tag.id || `tag-${idx}`,
        title: tag.title || "Tag",
        slug: resolveSlug(tag.slug, `tag-${idx}`),
        description: tag.description,
      }))
    } catch (error) {
      console.error("[ServerFn] Failed to fetch blog tags:", error)
      return []
    }
  }
)

/**
 * Server Function: Lấy danh sách Series/Groups
 */
export const getBlogGroupsServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogGroup[]> => {
    try {
      // TODO: Query groups từ DB
      const rawGroups: any[] = []
      return rawGroups.map((g: any, idx: number) => ({
        _id: g.id || `group-${idx}`,
        _type: "group" as const,
        title: g.title || "Untitled Series",
        slug: resolveSlug(g.slug, `group-${idx}`),
        description: g.description || "",
        coverImage: {
          url: resolveImageUrl(g.coverImage),
          alt: g.title || "Series preview",
        },
        isCompleted: Boolean(g.isCompleted),
      }))
    } catch (error) {
      console.error("[ServerFn] Failed to fetch blog groups:", error)
      return []
    }
  }
)

// ============================================================================
// 4. CLIENT CALLERS
// ============================================================================

export const getBlogPosts = () => getBlogPostsServerFn()
export const getBlogPostBySlug = (slug: string) =>
  getBlogPostBySlugServerFn({ data: slug })
export const getBlogCategories = () => getBlogCategoriesServerFn()
export const getBlogTags = () => getBlogTagsServerFn()
export const getBlogGroups = () => getBlogGroupsServerFn()

export async function getAllBlogData(): Promise<{
  posts: BlogPost[]
  categories: BlogCategory[]
  tags: BlogTag[]
  groups: BlogGroup[]
}> {
  const [posts, categories, tags, groups] = await Promise.all([
    getBlogPosts(),
    getBlogCategories(),
    getBlogTags(),
    getBlogGroups(),
  ])
  return { posts, categories, tags, groups }
}

// ============================================================================
// 5. TANSTACK QUERY OPTIONS
// ============================================================================

export const blogPostsQueryOptions = () =>
  queryOptions({
    queryKey: ["blog-posts"] as const,
    queryFn: () => getBlogPostsServerFn(),
    staleTime: 1000 * 60 * 5,
  })

export const blogCategoriesQueryOptions = () =>
  queryOptions({
    queryKey: ["blog-categories"] as const,
    queryFn: () => getBlogCategoriesServerFn(),
    staleTime: 1000 * 60 * 10,
  })

export const blogTagsQueryOptions = () =>
  queryOptions({
    queryKey: ["blog-tags"] as const,
    queryFn: () => getBlogTagsServerFn(),
    staleTime: 1000 * 60 * 10,
  })

export const blogGroupsQueryOptions = () =>
  queryOptions({
    queryKey: ["blog-groups"] as const,
    queryFn: () => getBlogGroupsServerFn(),
    staleTime: 1000 * 60 * 10,
  })

export const blogPostBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["blog-post", slug] as const,
    queryFn: () => getBlogPostBySlugServerFn({ data: slug }),
    staleTime: 1000 * 60 * 5,
  })
