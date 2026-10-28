import { REGISTRY_BLOCKS } from "@/registry/registry-blocks"
import type { BlockSchematicType } from "@/registry/schema"
import { BLOCK_FILTER_TABS, type BlockCategoryId } from "@/shared/config"

import type { BlockItem } from "./types"

export const BLOCK_CATEGORIES = BLOCK_FILTER_TABS

export const BLOCKS_DATA: BlockItem[] = REGISTRY_BLOCKS.map((item) => ({
  id: `block-${item.name}`,
  title: item.title,
  slug: item.name,
  category: item.category as BlockCategoryId,
  description: item.description,
  schematicType: item.schematicType as BlockSchematicType,
  isNew: item.isNew,
  isUpdated: item.isUpdated,
  aliases: item.aliases,
}))
