import { siteConfig } from "@/shared/config/site.config"
import {
  client,
  getSanityImageUrl,
  type SanityImage,
} from "@/shared/lib/sanity"

import type {
  BlogAuthor,
  BlogCategory,
  BlogGroup,
  BlogPost,
  BlogTag,
} from "../types"

export const BLOG_POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  excerpt,
  coverImage,
  categories[]->{
    _id,
    _type,
    title,
    slug,
    description,
    color
  },
  tags[]->{
    _id,
    _type,
    title,
    slug,
    description
  },
  group->{
    _id,
    _type,
    title,
    slug
  },
  groupOrder,
  publishedAt,
  readTime,
  isFeatured
}`

export const BLOG_POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  excerpt,
  coverImage,
  categories[]->{
    _id,
    _type,
    title,
    slug,
    description,
    color
  },
  tags[]->{
    _id,
    _type,
    title,
    slug,
    description
  },
  group->{
    _id,
    _type,
    title,
    slug,
    description,
    coverImage,
    isCompleted
  },
  groupOrder,
  publishedAt,
  readTime,
  isFeatured,
  body
}`

export const BLOG_CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id,
  _type,
  title,
  slug,
  description,
  color
}`

export const BLOG_TAGS_QUERY = `*[_type == "tag"] | order(title asc) {
  _id,
  _type,
  title,
  slug,
  description
}`

export const BLOG_GROUPS_QUERY = `*[_type == "group"] | order(title asc) {
  _id,
  _type,
  title,
  slug,
  description,
  coverImage,
  isCompleted
}`

interface RawSanityGroup {
  _id: string
  _type?: string
  title?: string
  slug?: { current: string }
  description?: string
  coverImage?: SanityImage | { url?: string; alt?: string }
  isCompleted?: boolean
}

interface RawSanityCategory {
  _id: string
  _type?: string
  title?: string
  slug?: { current: string }
  description?: string
  color?: { hex?: string } | string
}

interface RawSanityTag {
  _id: string
  _type?: string
  title?: string
  slug?: { current: string }
  description?: string
}

interface RawSanityPost {
  _id: string
  _type?: string
  title?: string
  slug?: { current: string }
  excerpt?: string
  coverImage?: SanityImage | { url?: string; alt?: string }
  categories?: RawSanityCategory[]
  tags?: RawSanityTag[]
  group?: BlogGroup
  groupOrder?: number
  publishedAt?: string
  readTime?: number
  isFeatured?: boolean
  author?: BlogAuthor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[]
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

function formatRawPost(item: RawSanityPost): BlogPost {
  const coverImageUrl =
    getSanityImageUrl(item.coverImage as SanityImage, {
      width: 1200,
      quality: 85,
      fit: "crop",
    }) ||
    (typeof item.coverImage === "object" &&
    item.coverImage &&
    "url" in item.coverImage
      ? (item.coverImage as { url: string }).url
      : "") ||
    "/images/placeholder.webp"

  const categories: BlogCategory[] = Array.isArray(item.categories)
    ? item.categories.map((c, idx) => ({
        _id: c._id || `cat-${idx}`,
        title: c.title || "Uncategorized",
        slug: c.slug || {
          current: c.title?.toLowerCase().replace(/\s+/g, "-") || `cat-${idx}`,
        },
        description: c.description,
        color: extractHexColor(c.color),
      }))
    : []

  const tags: BlogTag[] = Array.isArray(item.tags)
    ? item.tags.map((t, idx) => ({
        _id: t._id || `tag-${idx}`,
        title: t.title || "tag",
        slug: t.slug || {
          current: t.title?.toLowerCase().replace(/\s+/g, "-") || `tag-${idx}`,
        },
        description: t.description,
      }))
    : []

  return {
    _id: item._id,
    title: item.title || "Untitled Post",
    slug: item.slug || {
      current: item.title?.toLowerCase().replace(/\s+/g, "-") || "post",
    },
    excerpt: item.excerpt || "",
    coverImage: {
      url: coverImageUrl,
      alt:
        (item.coverImage as { alt?: string })?.alt ||
        item.title ||
        "Blog post cover",
    },
    categories,
    tags,
    group: item.group,
    groupOrder: item.groupOrder,
    publishedAt: item.publishedAt || new Date().toISOString(),
    readTime: item.readTime ?? 5,
    isFeatured: Boolean(item.isFeatured),
    author: item.author || DEFAULT_BLOG_AUTHOR,
    body: item.body || [],
  }
}

/**
 * Fetch all blog posts from Sanity CMS (zero mock data fallback)
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const rawItems = await client.fetch<RawSanityPost[]>(BLOG_POSTS_QUERY)
    if (Array.isArray(rawItems)) {
      return rawItems.map(formatRawPost)
    }
  } catch (error) {
    console.error("Sanity fetch for blog posts failed:", error)
  }

  return []
}

/**
 * Fetch a single blog post by its slug from Sanity CMS
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const rawItem = await client.fetch<RawSanityPost | null>(
      BLOG_POST_BY_SLUG_QUERY,
      { slug }
    )
    if (rawItem) {
      return formatRawPost(rawItem)
    }
  } catch (error) {
    console.error(`Sanity fetch for blog post slug "${slug}" failed:`, error)
  }

  return null
}

/**
 * Fetch all blog categories from Sanity CMS (zero mock data fallback)
 */
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const rawCategories = await client.fetch<RawSanityCategory[]>(
      BLOG_CATEGORIES_QUERY
    )
    if (Array.isArray(rawCategories)) {
      return rawCategories.map((cat, idx) => ({
        _id: cat._id || `cat-${idx}`,
        title: cat.title || "Category",
        slug: cat.slug || {
          current:
            cat.title?.toLowerCase().replace(/\s+/g, "-") || `category-${idx}`,
        },
        description: cat.description,
        color: extractHexColor(cat.color),
      }))
    }
  } catch (error) {
    console.error("Sanity fetch for blog categories failed:", error)
  }

  return []
}

/**
 * Fetch all blog tags from Sanity CMS (zero mock data fallback)
 */
export async function getBlogTags(): Promise<BlogTag[]> {
  try {
    const rawTags = await client.fetch<RawSanityTag[]>(BLOG_TAGS_QUERY)
    if (Array.isArray(rawTags)) {
      return rawTags.map((tag, idx) => ({
        _id: tag._id || `tag-${idx}`,
        title: tag.title || "Tag",
        slug: tag.slug || {
          current:
            tag.title?.toLowerCase().replace(/\s+/g, "-") || `tag-${idx}`,
        },
        description: tag.description,
      }))
    }
  } catch (error) {
    console.error("Sanity fetch for blog tags failed:", error)
  }

  return []
}

/**
 * Fetch all blog groups / series from Sanity CMS (zero mock data fallback)
 */
export async function getBlogGroups(): Promise<BlogGroup[]> {
  try {
    const rawGroups = await client.fetch<RawSanityGroup[]>(BLOG_GROUPS_QUERY)
    if (Array.isArray(rawGroups)) {
      return rawGroups.map((g, idx) => {
        const coverImageUrl =
          getSanityImageUrl(g.coverImage as SanityImage, {
            width: 800,
            quality: 85,
            fit: "crop",
          }) ||
          (typeof g.coverImage === "object" &&
          g.coverImage &&
          "url" in g.coverImage
            ? (g.coverImage as { url: string }).url
            : "") ||
          "/images/placeholder.webp"

        return {
          _id: g._id || `group-${idx}`,
          _type: "group" as const,
          title: g.title || "Untitled Series",
          slug: g.slug || {
            current:
              g.title?.toLowerCase().replace(/\s+/g, "-") || `group-${idx}`,
          },
          description: g.description || "",
          coverImage: {
            url: coverImageUrl,
            alt:
              (g.coverImage as { alt?: string })?.alt ||
              g.title ||
              "Series preview",
          },
          isCompleted: Boolean(g.isCompleted),
        }
      })
    }
  } catch (error) {
    console.error("Sanity fetch for blog groups/series failed:", error)
  }

  return []
}

/**
 * Convenience helper to fetch posts, categories, tags, and groups in parallel
 */
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

/**
 * TanStack Query options for blog posts
 */
export const blogPostsQueryOptions = () => ({
  queryKey: ["sanity-blog-posts"] as const,
  queryFn: () => getBlogPosts(),
  staleTime: 1000 * 60 * 5, // 5 minutes
})

/**
 * TanStack Query options for blog categories
 */
export const blogCategoriesQueryOptions = () => ({
  queryKey: ["sanity-blog-categories"] as const,
  queryFn: () => getBlogCategories(),
  staleTime: 1000 * 60 * 10, // 10 minutes
})

/**
 * TanStack Query options for blog tags
 */
export const blogTagsQueryOptions = () => ({
  queryKey: ["sanity-blog-tags"] as const,
  queryFn: () => getBlogTags(),
  staleTime: 1000 * 60 * 10, // 10 minutes
})

/**
 * TanStack Query options for blog groups / series
 */
export const blogGroupsQueryOptions = () => ({
  queryKey: ["sanity-blog-groups"] as const,
  queryFn: () => getBlogGroups(),
  staleTime: 1000 * 60 * 10, // 10 minutes
})

/**
 * TanStack Query options for a single blog post by slug
 */
export const blogPostBySlugQueryOptions = (slug: string) => ({
  queryKey: ["sanity-blog-post", slug] as const,
  queryFn: () => getBlogPostBySlug(slug),
  staleTime: 1000 * 60 * 5, // 5 minutes
})
