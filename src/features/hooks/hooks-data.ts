import { REGISTRY_HOOKS } from "@/registry/registry-hooks"
import type { SchematicType } from "@/registry/schema"
import { HOOK_FILTER_TABS, type HookCategoryId } from "@/shared/config"

import type { HookItem } from "./types"

export const HOOK_CATEGORIES = HOOK_FILTER_TABS

export const HOOKS_DATA: HookItem[] = REGISTRY_HOOKS.filter(
  (item) => item.type === "registry:hook"
).map((item) => ({
  id: `hook-${item.name}`,
  name: item.title,
  slug: item.name,
  category: item.category as HookCategoryId,
  description: item.description,
  schematicType: item.schematicType as SchematicType,
  isNew: item.isNew,
  isUpdated: item.isUpdated,
  aliases: item.aliases,
}))
