import { REGISTRY_COMPONENTS } from "@/registry/registry-components"
import type { SchematicType } from "@/registry/schema"
import {
  COMPONENT_CATEGORIES as COMPONENT_CATEGORY_CONFIG,
  COMPONENT_FILTER_TABS,
  type ComponentCategoryId,
} from "@/shared/config"

import type { ComponentItem } from "./types"

export const COMPONENT_CATEGORIES = COMPONENT_FILTER_TABS

export const COMPONENTS_DATA: ComponentItem[] = REGISTRY_COMPONENTS.filter(
  (item) => item.type !== "registry:hook"
).map((item) => ({
  id: `comp-${item.name}`,
  name: item.title,
  slug: item.name,
  category: item.category as ComponentCategoryId,
  description: item.description,
  schematicType: item.schematicType as SchematicType,
  isNew: item.isNew,
  isUpdated: item.isUpdated,
  aliases: item.aliases,
}))

const FEATURED_COMPONENT_CATEGORY_SPECS = [
  {
    id: "navigation",
    specsLabel: "p12 - r4 - spring indicator",
    paddingPx: 12,
  },
  { id: "card", specsLabel: "p16 - r8 - spotlight & glow", paddingPx: 16 },
  {
    id: "interactive",
    specsLabel: "p14 - r6 - tactile physics",
    paddingPx: 14,
  },
  {
    id: "data-display",
    specsLabel: "p14 - r4 - code & scroll area",
    paddingPx: 14,
  },
  { id: "text", specsLabel: "p12 - r4 - canvas typography", paddingPx: 12 },
] as const satisfies readonly {
  id: ComponentCategoryId
  specsLabel: string
  paddingPx: number
}[]

export type FeaturedComponentCategoryId =
  (typeof FEATURED_COMPONENT_CATEGORY_SPECS)[number]["id"]

export interface ComponentCategoryCount {
  id: FeaturedComponentCategoryId
  index: string
  title: string
  count: number
  specsLabel: string
  paddingPx: number
}

/**
 * Returns the featured component categories for the homepage grid,
 * with live counts derived from COMPONENTS_DATA.
 */
export function getFeaturedComponentCategories(): ComponentCategoryCount[] {
  return FEATURED_COMPONENT_CATEGORY_SPECS.map((spec, idx) => {
    const config = COMPONENT_CATEGORY_CONFIG.find((c) => c.id === spec.id)
    return {
      id: spec.id,
      index: String(idx + 1).padStart(2, "0"),
      title: config?.label ?? spec.id,
      count: COMPONENTS_DATA.filter((c) => c.category === spec.id).length,
      specsLabel: spec.specsLabel,
      paddingPx: spec.paddingPx,
    }
  })
}
