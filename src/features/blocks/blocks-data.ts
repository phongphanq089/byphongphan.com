import type { BlockCategory, BlockItem } from "./types"

export const BLOCK_CATEGORIES: BlockCategory[] = [
  { id: "all", label: "ALL" },
  { id: "application", label: "APPLICATION" },
  { id: "marketing", label: "MARKETING" },
  { id: "ecommerce", label: "ECOMMERCE" },
]

export const BLOCKS_DATA: BlockItem[] = [
  {
    id: "block-not-found-01",
    title: "Not Found 01",
    slug: "not-found-01",
    category: "application",
    description: "A 404 page with a playable brick breaker game.",
  },
]
