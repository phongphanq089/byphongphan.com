/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"

import type { PricingBadge, Resource, ResourceCategory } from "../types"

// ============================================================================
// 1. HELPERS & FORMATTERS
// ============================================================================
function resolveSlug(
  slug: string | { current: string } | undefined,
  fallback: string
) {
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

// ============================================================================
// 2. SERVER FUNCTIONS
// ============================================================================

/**
 * Server Function: Lấy danh sách Resources
 */
export const getResourcesServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<Resource[]> => {
    try {
      const rawItems: any[] = []

      return rawItems.map((item, idx) => ({
        _id: item.id || `resource-${idx}`,
        _type: "resource" as const,
        title: item.title || "Untitled Resource",
        slug: resolveSlug(item.slug, `resource-${idx}`),
        url: item.url || "#",
        description: item.description || "",
        coverImage: {
          url: resolveImageUrl(item.coverImage),
          alt: item.title || "Resource preview",
        },
        logo: item.logo ? { url: resolveImageUrl(item.logo, "") } : undefined,
        category: item.category
          ? {
              _id: item.category.id,
              _type: "resourceCategory" as const,
              title: item.category.title,
              slug: resolveSlug(item.category.slug, "general"),
              icon: item.category.icon,
              color: item.category.color,
              order: item.category.order ?? 99,
            }
          : {
              _id: "uncategorized",
              _type: "resourceCategory" as const,
              title: "General",
              slug: { current: "general" },
              order: 99,
            },
        pricing: (item.pricing as PricingBadge) || "Free",
        isFeatured: Boolean(item.isFeatured),
        publishedAt: item.publishedAt || new Date().toISOString(),
      }))
    } catch (error) {
      console.error("[ServerFn] Failed to fetch resources:", error)
      return []
    }
  }
)

/**
 * Server Function: Lấy danh mục Resources
 */
export const getResourceCategoriesServerFn = createServerFn({
  method: "GET",
}).handler(async (): Promise<ResourceCategory[]> => {
  try {
    // TODO: Query trực tiếp từ DB
    const rawCategories: any[] = []

    return rawCategories.map((cat, idx) => ({
      _id: cat.id || `category-${idx}`,
      _type: "resourceCategory" as const,
      title: cat.title || "Category",
      slug: resolveSlug(cat.slug, `category-${idx}`),
      icon: cat.icon,
      color: cat.color,
      order: cat.order ?? idx + 1,
    }))
  } catch (error) {
    console.error("[ServerFn] Failed to fetch resource categories:", error)
    return []
  }
})

export const getResources = () => getResourcesServerFn()
export const getResourceCategories = () => getResourceCategoriesServerFn()

// ============================================================================
// 3. TANSTACK QUERY OPTIONS
// ============================================================================

export const resourcesQueryOptions = () =>
  queryOptions({
    queryKey: ["resources"] as const,
    queryFn: () => getResourcesServerFn(),
    staleTime: 1000 * 60 * 5,
  })

export const resourceCategoriesQueryOptions = () =>
  queryOptions({
    queryKey: ["resource-categories"] as const,
    queryFn: () => getResourceCategoriesServerFn(),
    staleTime: 1000 * 60 * 10,
  })
