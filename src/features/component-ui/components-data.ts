import { REGISTRY_COMPONENTS } from "@/registry/registry-components"
import type { SchematicType } from "@/registry/schema"
import {
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
