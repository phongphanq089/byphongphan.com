/**
 * Single Source of Truth for all Component UI and Block categories across the application.
 */

// 1. Definition as const
export const COMPONENT_CATEGORIES = [
  {
    id: "card",
    label: "Card",
    description: "Card surfaces, spotlight effects, and glowing containers.",
  },
  {
    id: "background",
    label: "Background",
    description: "Ambient canvas backdrops and cursor gradient patterns.",
  },
  {
    id: "navigation",
    label: "Navigation",
    description:
      "Animated navigation lines, rail scrubbers, and spring indicators.",
  },
  {
    id: "text",
    label: "Text",
    description:
      "Interactive typographic effects, 3D text, and truncation utilities.",
  },
  {
    id: "interactive",
    label: "Interactive",
    description:
      "Physics-based containers, time scrubbers, and isometric marks.",
  },
  {
    id: "data-display",
    label: "Data Display",
    description:
      "Syntax-highlighted code blocks, vector maps, and data visualizers.",
  },
] as const

export const BLOCK_CATEGORIES = [
  {
    id: "404-page",
    label: "404 Page",
    description: "Playable games and 2D physics gravity error pages.",
  },
  {
    id: "auth",
    label: "Auth",
    description: "Authentication screens, login, registration, and forms.",
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Landing page and hero marketing sections.",
  },
  {
    id: "ecommerce",
    label: "E-Commerce",
    description: "Product cards, cart sheets, and checkout layouts.",
  },
  {
    id: "application",
    label: "Application",
    description: "Application layout and functional dashboard blocks.",
  },
] as const

export const HOOK_CATEGORIES = [
  {
    id: "state",
    label: "State",
    description:
      "State primitives, reactive stores, and value synchronization.",
  },
  {
    id: "ui-interaction",
    label: "UI & Interaction",
    description: "DOM interactions, outside clicks, gestures, and UI events.",
  },
  {
    id: "browser",
    label: "Browser",
    description:
      "Browser APIs, media queries, local storage, and screen observers.",
  },
  {
    id: "performance",
    label: "Performance",
    description: "Intersection observers, viewport listeners, and memoization.",
  },
  {
    id: "utilities",
    label: "Utilities",
    description: "Debounce, copy to clipboard, timers, and developer helpers.",
  },
] as const

// 2. Types derived directly from const arrays
export type ComponentCategoryId = (typeof COMPONENT_CATEGORIES)[number]["id"]
export type BlockCategoryId = (typeof BLOCK_CATEGORIES)[number]["id"]
export type HookCategoryId = (typeof HOOK_CATEGORIES)[number]["id"]

// Filter types with "all" sentinel
export type ComponentCategoryFilterId = "all" | ComponentCategoryId
export type BlockCategoryFilterId = "all" | BlockCategoryId
export type HookCategoryFilterId = "all" | HookCategoryId

// Legacy compatibility aliases
export type ComponentCategoryIdWithAll = ComponentCategoryFilterId
export type BlockCategoryIdWithAll = BlockCategoryFilterId
export type HookCategoryIdWithAll = HookCategoryFilterId

// 3. Validation ID arrays
export const VALID_COMPONENT_CATEGORY_IDS = COMPONENT_CATEGORIES.map(
  (c) => c.id
) as readonly ComponentCategoryId[]

export const VALID_BLOCK_CATEGORY_IDS = BLOCK_CATEGORIES.map(
  (c) => c.id
) as readonly BlockCategoryId[]

export const VALID_HOOK_CATEGORY_IDS = HOOK_CATEGORIES.map(
  (c) => c.id
) as readonly HookCategoryId[]

// 4. Type guards for runtime checking & route loaders
export function isComponentCategoryId(
  value: string
): value is ComponentCategoryId {
  return VALID_COMPONENT_CATEGORY_IDS.includes(value as ComponentCategoryId)
}

export function isBlockCategoryId(value: string): value is BlockCategoryId {
  return VALID_BLOCK_CATEGORY_IDS.includes(value as BlockCategoryId)
}

export function isHookCategoryId(value: string): value is HookCategoryId {
  return VALID_HOOK_CATEGORY_IDS.includes(value as HookCategoryId)
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

export const HOOK_FILTER_TABS: CategoryFilterTab<HookCategoryId>[] = [
  { id: "all", label: "ALL" },
  ...HOOK_CATEGORIES.map((c) => ({
    id: c.id,
    label: c.label.toUpperCase(),
  })),
]
