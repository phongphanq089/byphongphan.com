export type PostStatus = "draft" | "published" | "archived"

export interface AdminCategory {
  id: string
  title: string
  slug: string
  description?: string | null
  color?: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminTag {
  id: string
  title: string
  slug: string
  description?: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminPostGroup {
  id: string
  title: string
  slug: string
  description?: string | null
  coverImage?: string | null
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

/**
 * Mirrors the `posts` table + relational joins (`group`, `categories`, `tags`)
 * from the Drizzle schema.
 */
export interface AdminPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  coverImageAlt: string | null
  groupId: string | null
  groupOrder: number | null
  group: AdminPostGroup | null
  status: PostStatus
  publishedAt: string
  readTime: number
  isFeatured: boolean
  content: Record<string, unknown>
  categories: AdminCategory[]
  tags: AdminTag[]
  createdAt: string
  updatedAt: string
}

export type PostsViewMode = "table" | "grid"

export type PostsSortOption =
  "publishedAt_desc" | "updatedAt_desc" | "title_asc" | "readTime_desc"

export interface PostsFilterState {
  search: string
  status: "all" | PostStatus
  categoryId: string
  groupId: string
  featuredOnly: boolean
}
