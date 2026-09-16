import { REGISTRY_ITEMS } from "@/registry"

import type { ComponentCategoryId, ComponentItem } from "./types"

export const COMPONENT_CATEGORIES: {
  id: "all" | ComponentCategoryId
  label: string
}[] = [
  { id: "all", label: "ALL" },
  { id: "primitives", label: "PRIMITIVES" },
  { id: "animations", label: "ANIMATIONS" },
  { id: "foundations", label: "FOUNDATIONS" },
]

/**
 * Derived from REGISTRY_ITEMS — single source of truth.
 * Do not add component display metadata here; update registry.ts instead.
 */
export const COMPONENTS_DATA: ComponentItem[] = REGISTRY_ITEMS.map(
  (item): ComponentItem => ({
    id: `comp-${item.name}`,
    name: item.title,
    slug: item.name,
    category: item.category,
    description: item.description,
    schematicType: item.schematicType as ComponentItem["schematicType"],
    isNew: item.isNew,
  })
)
