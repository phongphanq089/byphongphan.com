import type { ComponentVariant } from "@/features/component-ui/types"

import BackgroundGradientCursorBlueprint from "./background-gradient-cursor/background-gradient-cursor-blueprint"
import BackgroundGradientCursorCardSpotlight from "./background-gradient-cursor/background-gradient-cursor-card-spotlight"
import BackgroundGradientCursorCyberpunk from "./background-gradient-cursor/background-gradient-cursor-cyberpunk"

export const BACKGROUND_GRADIENT_CURSOR_VARIANTS: ComponentVariant[] = [
  {
    id: "background-gradient-cursor-cyberpunk",
    title: "Cyberpunk Neon Grid",
    description:
      "Dual-tone cyan and fuchsia radial gradient mask with high-frequency neon grid lines.",
    component: BackgroundGradientCursorCyberpunk,
  },
  {
    id: "background-gradient-cursor-blueprint",
    title: "Technical Blueprint Matrix",
    description:
      "Precision azure grid with high-density dot matrix and spotlight illumination.",
    component: BackgroundGradientCursorBlueprint,
  },
  {
    id: "background-gradient-cursor-card-spotlight",
    title: "Warm Amber Spotlight",
    description:
      "Soft golden ambient spotlight with subtle dots designed for interactive card surfaces.",
    component: BackgroundGradientCursorCardSpotlight,
  },
]

export {
  BackgroundGradientCursorBlueprint,
  BackgroundGradientCursorCardSpotlight,
  BackgroundGradientCursorCyberpunk,
}
