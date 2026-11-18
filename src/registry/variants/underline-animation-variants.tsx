import type { ComponentVariant } from "@/features/component-ui/types"

import UnderlineAnimationCenter from "./underline-animation/underline-animation-center"
import UnderlineAnimationDirectional from "./underline-animation/underline-animation-directional"

export const UNDERLINE_ANIMATION_VARIANTS: ComponentVariant[] = [
  {
    id: "underline-animation-center",
    title: "Center Expansion",
    description:
      "Classic underline animation expanding symmetrically from the center outwards on hover.",
    component: UnderlineAnimationCenter,
  },
  {
    id: "underline-animation-directional",
    title: "Directional Expansion",
    description:
      "Asymmetric underline expanding linearly from the left or right edge.",
    component: UnderlineAnimationDirectional,
  },
]

export { UnderlineAnimationCenter, UnderlineAnimationDirectional }
