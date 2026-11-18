import type { ComponentVariant } from "@/features/component-ui/types"

import { BACKGROUND_GRADIENT_CURSOR_VARIANTS } from "./background-gradient-cursor-variants"
import { BADGE_VARIANTS } from "./badge-variants"
import { CARD_VARIANTS } from "./card-variants"
import { CODE_BLOCK_VARIANTS } from "./code-block-variants"
import { CRADLE_TEXT_VARIANTS } from "./cradle-text-variants"
import { DRAWER_VARIANTS } from "./drawer-variants"
import { LETTER_3D_SWAP_VARIANTS } from "./letter-3d-swap-variants"
import { LINE_NAV_VARIANTS } from "./line-nav-variants"
import { MAP_VARIANTS } from "./map-variants"
import { MIDDLE_TRUNCATION_VARIANTS } from "./middle-truncation-variants"
import { PLUCKED_TEXT_VARIANTS } from "./plucked-text-variants"
import { SCROLL_AREA_VARIANTS } from "./scroll-area-variants"
import { SELECT_VARIANTS } from "./select-variants"
import { SWOOSH_TEXT_VARIANTS } from "./swoosh-text-variants"
import { TEXT_HOVER_EFFECT_VARIANTS } from "./text-hover-effect-variants"
import { TYPING_TEXT_VARIANTS } from "./typing-text-variants"
import { UNDERLINE_ANIMATION_VARIANTS } from "./underline-animation-variants"
import { UNDERLINE_TO_BACKGROUND_VARIANTS } from "./underline-to-background-variants"

export * from "./background-gradient-cursor-variants"
export * from "./badge-variants"
export * from "./card-variants"
export * from "./code-block-variants"
export * from "./cradle-text-variants"
export * from "./drawer-variants"
export * from "./letter-3d-swap-variants"
export * from "./line-nav-variants"
export * from "./map-variants"
export * from "./middle-truncation-variants"
export * from "./plucked-text-variants"
export * from "./scroll-area-variants"
export * from "./select-variants"
export * from "./swoosh-text-variants"
export * from "./text-hover-effect-variants"
export * from "./typing-text-variants"
export * from "./underline-animation-variants"
export * from "./underline-to-background-variants"

export const ALL_VARIANTS: ComponentVariant[] = [
  ...SELECT_VARIANTS,
  ...SWOOSH_TEXT_VARIANTS,
  ...PLUCKED_TEXT_VARIANTS,
  ...CRADLE_TEXT_VARIANTS,
  ...BADGE_VARIANTS,
  ...CARD_VARIANTS,
  ...CODE_BLOCK_VARIANTS,
  ...MAP_VARIANTS,
  ...TEXT_HOVER_EFFECT_VARIANTS,
  ...LETTER_3D_SWAP_VARIANTS,
  ...TYPING_TEXT_VARIANTS,
  ...UNDERLINE_ANIMATION_VARIANTS,
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
  badge: BADGE_VARIANTS,
  "swoosh-text": SWOOSH_TEXT_VARIANTS,
  "plucked-text": PLUCKED_TEXT_VARIANTS,
  "cradle-text": CRADLE_TEXT_VARIANTS,
  card: CARD_VARIANTS,
  "code-block": CODE_BLOCK_VARIANTS,
  map: MAP_VARIANTS,
  "text-hover-effect": TEXT_HOVER_EFFECT_VARIANTS,
  "letter-3d-swap": LETTER_3D_SWAP_VARIANTS,
  "typing-text": TYPING_TEXT_VARIANTS,
  "underline-animation": UNDERLINE_ANIMATION_VARIANTS,
  "underline-to-background": UNDERLINE_TO_BACKGROUND_VARIANTS,
  "background-gradient-cursor": BACKGROUND_GRADIENT_CURSOR_VARIANTS,
  "middle-truncation": MIDDLE_TRUNCATION_VARIANTS,
  "line-nav": LINE_NAV_VARIANTS,
  "scroll-area": SCROLL_AREA_VARIANTS,
  drawer: DRAWER_VARIANTS,
}
