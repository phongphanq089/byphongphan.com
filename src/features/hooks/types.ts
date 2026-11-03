import type { SchematicType } from "@/registry/schema"
import type { HookCategoryId, HookCategoryIdWithAll } from "@/shared/config"

export type { HookSchematicType, SchematicType } from "@/registry/schema"
export type {
  HookCategoryFilterId,
  HookCategoryId,
  HookCategoryIdWithAll,
} from "@/shared/config"

export interface HookCategory {
  id: HookCategoryIdWithAll
  label: string
  count?: number
}

export interface HookItem {
  id: string
  name: string
  slug: string
  category: HookCategoryId
  description: string
  count?: number
  schematicType?: SchematicType
  badge?: string
  isNew?: boolean
  isUpdated?: boolean
  aliases?: string[]
}
