export type ResourcePricing = "Free" | "MIT" | "Freemium" | "Paid"

export type ResourcesTab = "resources" | "categories"

export type ResourcesViewMode = "table" | "grid"

export interface AdminResourceCategory {
  id: string
  title: string
  slug: string
  icon: string | null
  color: string | null
  order: number
  createdAt: string
  updatedAt: string
}

export interface AdminResourceCategoryWithCount extends AdminResourceCategory {
  resourcesCount: number
}

export interface AdminResource {
  id: string
  title: string
  slug: string
  url: string
  description: string | null
  coverImage: string
  coverImageAlt: string | null
  logo: string | null
  categoryId: string
  category: AdminResourceCategory
  pricing: ResourcePricing
  isFeatured: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export interface ResourcesFilterState {
  search: string
  categoryId: string
  pricing: "all" | ResourcePricing
  featuredOnly: boolean
}

export interface ResourceFormValues {
  title: string
  slug: string
  url: string
  description: string
  coverImage: string
  coverImageAlt: string
  logo: string
  categoryId: string
  pricing: ResourcePricing
  isFeatured: boolean
  publishedAt: string
}

export interface ResourceCategoryFormValues {
  title: string
  slug: string
  icon: string
  color: string
  order: number
}
