import {
  client,
  getSanityImageUrl,
  type SanityImage,
} from "@/shared/lib/sanity"

import type { PricingBadge, Resource, ResourceCategory } from "../types"

export const RESOURCES_QUERY = `*[_type == "resource"] | order(publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  url,
  description,
  coverImage,
  logo,
  category->{
    _id,
    _type,
    title,
    slug,
    icon,
    color,
    order
  },
  pricing,
  isFeatured,
  publishedAt
}`

export const RESOURCE_CATEGORIES_QUERY = `*[_type == "resourceCategory"] | order(order asc, title asc) {
  _id,
  _type,
  title,
  slug,
  icon,
  color,
  order
}`

interface RawSanityResource {
  _id: string
  _type?: string
  title?: string
  slug?: { current: string }
  url?: string
  description?: string
  coverImage?: SanityImage | { url?: string; alt?: string }
  logo?: SanityImage | { url?: string }
  category?: ResourceCategory
  pricing?: PricingBadge
  isFeatured?: boolean
  publishedAt?: string
}

interface RawSanityCategory {
  _id: string
  _type?: string
  title?: string
  slug?: { current: string }
  icon?: string
  color?: { hex?: string } | string
  order?: number
}

/**
 * Fetch all resources from Sanity CMS (returns empty array if none found, does not fallback to mock data)
 */
export async function getResources(): Promise<Resource[]> {
  try {
    const rawItems = await client.fetch<RawSanityResource[]>(RESOURCES_QUERY)
    if (Array.isArray(rawItems)) {
      return rawItems.map((item) => {
        const coverImageUrl =
          getSanityImageUrl(item.coverImage as SanityImage, {
            width: 800,
            quality: 85,
            fit: "crop",
          }) ||
          (typeof item.coverImage === "object" &&
          item.coverImage &&
          "url" in item.coverImage
            ? (item.coverImage as { url: string }).url
            : "") ||
          "/images/placeholder.webp"

        const logoUrl = item.logo
          ? getSanityImageUrl(item.logo as SanityImage, {
              width: 64,
              height: 64,
            }) ||
            (typeof item.logo === "object" && item.logo && "url" in item.logo
              ? (item.logo as { url: string }).url
              : "")
          : undefined

        return {
          _id: item._id,
          _type: "resource" as const,
          title: item.title || "Untitled Resource",
          slug: item.slug || {
            current:
              item.title?.toLowerCase().replace(/\s+/g, "-") || "resource",
          },
          url: item.url || "#",
          description: item.description || "",
          coverImage: {
            url: coverImageUrl,
            alt:
              (item.coverImage as { alt?: string })?.alt ||
              item.title ||
              "Resource preview",
          },
          logo: logoUrl ? { url: logoUrl } : undefined,
          category: item.category || {
            _id: "uncategorized",
            title: "General",
            slug: { current: "general" },
            order: 99,
          },
          pricing: (item.pricing as PricingBadge) || "Free",
          isFeatured: Boolean(item.isFeatured),
          publishedAt: item.publishedAt || new Date().toISOString(),
        }
      })
    }
  } catch (error) {
    console.error("Sanity fetch for resources failed:", error)
  }

  return []
}

/**
 * Fetch all resource categories from Sanity CMS (returns empty array if none found, does not fallback to mock data)
 */
export async function getResourceCategories(): Promise<ResourceCategory[]> {
  try {
    const rawCategories = await client.fetch<RawSanityCategory[]>(
      RESOURCE_CATEGORIES_QUERY
    )
    if (Array.isArray(rawCategories)) {
      return rawCategories.map((cat, idx) => ({
        _id: cat._id,
        _type: "resourceCategory" as const,
        title: cat.title || "Category",
        slug: cat.slug || {
          current:
            cat.title?.toLowerCase().replace(/\s+/g, "-") || `category-${idx}`,
        },
        icon: cat.icon,
        color: cat.color,
        order: cat.order ?? idx + 1,
      }))
    }
  } catch (error) {
    console.error("Sanity fetch for resource categories failed:", error)
  }

  return []
}

/**
 * Convenience helper to fetch both resources and categories in parallel
 */
export async function getAllResourcesData(): Promise<{
  resources: Resource[]
  categories: ResourceCategory[]
}> {
  const [resources, categories] = await Promise.all([
    getResources(),
    getResourceCategories(),
  ])
  return { resources, categories }
}

/**
 * TanStack Query options for resources list
 */
export const resourcesQueryOptions = () => ({
  queryKey: ["sanity-resources"] as const,
  queryFn: () => getResources(),
  staleTime: 1000 * 60 * 5, // 5 minutes
})

/**
 * TanStack Query options for resource categories list
 */
export const resourceCategoriesQueryOptions = () => ({
  queryKey: ["sanity-resource-categories"] as const,
  queryFn: () => getResourceCategories(),
  staleTime: 1000 * 60 * 10, // 10 minutes
})
