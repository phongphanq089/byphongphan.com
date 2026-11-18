import type { ComponentVariant } from "@/features/component-ui/types"

import { BACKGROUND_GRADIENT_CURSOR_VARIANTS } from "./background-gradient-cursor-variants"
import { CARD_VARIANTS } from "./card-variants"
import { CODE_BLOCK_VARIANTS } from "./code-block-variants"
import { DRAWER_VARIANTS } from "./drawer-variants"
import { LINE_NAV_VARIANTS } from "./line-nav-variants"
import { MAP_VARIANTS } from "./map-variants"
import { MIDDLE_TRUNCATION_VARIANTS } from "./middle-truncation-variants"
import { SCROLL_AREA_VARIANTS } from "./scroll-area-variants"
import { SELECT_VARIANTS } from "./select-variants"
import { TEXT_HOVER_EFFECT_VARIANTS } from "./text-hover-effect-variants"
import { UNDERLINE_TO_BACKGROUND_VARIANTS } from "./underline-to-background-variants"

export * from "./background-gradient-cursor-variants"
export * from "./card-variants"
export * from "./code-block-variants"
export * from "./drawer-variants"
export * from "./line-nav-variants"
export * from "./map-variants"
export * from "./middle-truncation-variants"
export * from "./scroll-area-variants"
export * from "./select-variants"
export * from "./text-hover-effect-variants"
export * from "./underline-to-background-variants"

export const ALL_VARIANTS: ComponentVariant[] = [
  ...SELECT_VARIANTS,
  ...CARD_VARIANTS,
  ...CODE_BLOCK_VARIANTS,
  ...MAP_VARIANTS,
  ...TEXT_HOVER_EFFECT_VARIANTS,
  ...UNDERLINE_TO_BACKGROUND_VARIANTS,
  ...BACKGROUND_GRADIENT_CURSOR_VARIANTS,
  ...MIDDLE_TRUNCATION_VARIANTS,
  ...LINE_NAV_VARIANTS,
  ...SCROLL_AREA_VARIANTS,
  ...DRAWER_VARIANTS,
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
  "underline-to-background": UNDERLINE_TO_BACKGROUND_VARIANTS,
  "background-gradient-cursor": BACKGROUND_GRADIENT_CURSOR_VARIANTS,
  "middle-truncation": MIDDLE_TRUNCATION_VARIANTS,
  "line-nav": LINE_NAV_VARIANTS,
  "scroll-area": SCROLL_AREA_VARIANTS,
  drawer: DRAWER_VARIANTS,
}
