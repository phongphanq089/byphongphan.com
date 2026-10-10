/**
 * Single Source of Truth for all Component UI and Block categories across the application.
 */

// 1. Definition as const
export const COMPONENT_CATEGORIES = [
  {
    id: "primitives",
    label: "Primitives",
    description: "Foundational UI primitives and essential controls.",
  },
  {
    id: "animations",
    label: "Animations",
    description: "Interactive animated components and micro-interactions.",
  },
] as const

export const BLOCK_CATEGORIES = [
  {
    id: "application",
    label: "Application",
    description: "Application layout and functional blocks.",
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Landing page and hero marketing sections.",
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    description: "Product cards and checkout components.",
  },
] as const

// 2. Types derived directly from const arrays
export type ComponentCategoryId = (typeof COMPONENT_CATEGORIES)[number]["id"]
export type BlockCategoryId = (typeof BLOCK_CATEGORIES)[number]["id"]

// Filter types with "all" sentinel
export type ComponentCategoryFilterId = "all" | ComponentCategoryId
export type BlockCategoryFilterId = "all" | BlockCategoryId

// Legacy compatibility aliases
export type ComponentCategoryIdWithAll = ComponentCategoryFilterId
export type BlockCategoryIdWithAll = BlockCategoryFilterId

// 3. Validation ID arrays
export const VALID_COMPONENT_CATEGORY_IDS = COMPONENT_CATEGORIES.map(
  (c) => c.id
) as readonly ComponentCategoryId[]

export const VALID_BLOCK_CATEGORY_IDS = BLOCK_CATEGORIES.map(
  (c) => c.id
) as readonly BlockCategoryId[]

// 4. Type guards for runtime checking & route loaders
export function isComponentCategoryId(
  value: string
): value is ComponentCategoryId {
  return VALID_COMPONENT_CATEGORY_IDS.includes(value as ComponentCategoryId)
}

export function isBlockCategoryId(value: string): value is BlockCategoryId {
  return VALID_BLOCK_CATEGORY_IDS.includes(value as BlockCategoryId)
}

// 5. Filter tabs for UI filter bars
export interface CategoryFilterTab<T extends string = string> {
  id: "all" | T
  label: string
}

export const COMPONENT_FILTER_TABS: CategoryFilterTab<ComponentCategoryId>[] = [
  { id: "all", label: "ALL" },
  ...COMPONENT_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label.toUpperCase(),
  })),
]

export const BLOCK_FILTER_TABS: CategoryFilterTab<BlockCategoryId>[] = [
  { id: "all", label: "ALL" },
  ...BLOCK_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label.toUpperCase(),
  })),
]
