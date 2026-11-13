import { REGISTRY_BLOCKS } from "@/registry/registry-blocks"
import type { BlockSchematicType } from "@/registry/schema"
import {
  BLOCK_CATEGORIES as BLOCK_CATEGORY_CONFIG,
  BLOCK_FILTER_TABS,
  type BlockCategoryId,
} from "@/shared/config"

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

const FEATURED_BLOCK_CATEGORY_IDS = [
  "marketing",
  "404-page",
  "auth",
] as const satisfies readonly BlockCategoryId[]

export type FeaturedBlockCategoryId =
  (typeof FEATURED_BLOCK_CATEGORY_IDS)[number]

export interface BlockCategoryCount {
  id: FeaturedBlockCategoryId
  index: string
  title: string
  count: number
}

/**
 * Returns the featured block categories for the homepage grid,
 * with live counts derived from BLOCKS_DATA.
 */
export function getFeaturedBlockCategories(): BlockCategoryCount[] {
  return FEATURED_BLOCK_CATEGORY_IDS.map((id, idx) => {
    const config = BLOCK_CATEGORY_CONFIG.find((c) => c.id === id)
    return {
      id,
      index: String(idx + 1).padStart(2, "0"),
      title: config?.label ?? id,
      count: BLOCKS_DATA.filter((b) => b.category === id).length,
    }
  })
}
