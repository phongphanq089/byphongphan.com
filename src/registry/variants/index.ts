import type { ComponentVariant } from "@/features/component-ui/types"

import { BACKGROUND_GRADIENT_CURSOR_VARIANTS } from "./background-gradient-cursor-variants"
import { CARD_VARIANTS } from "./card-variants"
import { CODE_BLOCK_VARIANTS } from "./code-block-variants"
import { MAP_VARIANTS } from "./map-variants"
import { PHONG_PHAN_ISOMETRIC_VARIANTS } from "./phong-phan-isometric-variants"
import { PP_MARK_ISOMETRIC_VARIANTS } from "./pp-mark-isometric-variants"
import { SELECT_VARIANTS } from "./select-variants"
import { TEXT_HOVER_EFFECT_VARIANTS } from "./text-hover-effect-variants"

export * from "./background-gradient-cursor-variants"
export * from "./card-variants"
export * from "./code-block-variants"
export * from "./map-variants"
export * from "./phong-phan-isometric-variants"
export * from "./pp-mark-isometric-variants"
export * from "./select-variants"
export * from "./text-hover-effect-variants"

export const ALL_VARIANTS: ComponentVariant[] = [
  ...SELECT_VARIANTS,
  ...CARD_VARIANTS,
  ...CODE_BLOCK_VARIANTS,
  ...MAP_VARIANTS,
  ...TEXT_HOVER_EFFECT_VARIANTS,
  ...BACKGROUND_GRADIENT_CURSOR_VARIANTS,
  ...PP_MARK_ISOMETRIC_VARIANTS,
  ...PHONG_PHAN_ISOMETRIC_VARIANTS,
]

export const VARIANTS_MAP = new Map<string, ComponentVariant>(
  ALL_VARIANTS.map((v) => [v.id, v])
)

/**
 * Grouped variants by component name (e.g. "select", "card", "code-block", "map", "text-hover-effect")
 */
export const COMPONENT_VARIANTS: Record<string, ComponentVariant[]> = {
  select: SELECT_VARIANTS,
  card: CARD_VARIANTS,
  "code-block": CODE_BLOCK_VARIANTS,
  map: MAP_VARIANTS,
  "text-hover-effect": TEXT_HOVER_EFFECT_VARIANTS,
  "background-gradient-cursor": BACKGROUND_GRADIENT_CURSOR_VARIANTS,
  "pp-mark-isometric": PP_MARK_ISOMETRIC_VARIANTS,
  "phong-phan-isometric": PHONG_PHAN_ISOMETRIC_VARIANTS,
}
