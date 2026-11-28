import type { AdminCategory, AdminTag } from "@/admin/features/posts"

export type TaxonomyTab = "categories" | "tags"

export interface AdminCategoryWithCount extends AdminCategory {
  postsCount: number
}

export interface AdminTagWithCount extends AdminTag {
  postsCount: number
}

export interface CategoryFormValues {
  title: string
  slug: string
  description: string
  color: string
}

export interface TagFormValues {
  title: string
  slug: string
  description: string
}
