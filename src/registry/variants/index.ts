import type { ComponentVariant } from "@/features/component-ui/types"

import { CARD_VARIANTS } from "./card-variants"
import { CODE_BLOCK_VARIANTS } from "./code-block-variants"
import { SELECT_VARIANTS } from "./select-variants"

export * from "./card-variants"
export * from "./code-block-variants"
export * from "./select-variants"

export const ALL_VARIANTS: ComponentVariant[] = [
  ...SELECT_VARIANTS,
  ...CARD_VARIANTS,
  ...CODE_BLOCK_VARIANTS,
]

export const VARIANTS_MAP = new Map<string, ComponentVariant>(
  ALL_VARIANTS.map((v) => [v.id, v])
)

/**
 * Grouped variants by component name (e.g. "select", "card", "code-block")
 */
export const COMPONENT_VARIANTS: Record<string, ComponentVariant[]> = {
  select: SELECT_VARIANTS,
  card: CARD_VARIANTS,
  "code-block": CODE_BLOCK_VARIANTS,
}
