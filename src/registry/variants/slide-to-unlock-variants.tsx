import type { ComponentVariant } from "@/features/component-ui/types"

import SlideToUnlockPresets from "./slide-to-unlock/slide-to-unlock-presets"
import SlideToUnlockSizes from "./slide-to-unlock/slide-to-unlock-sizes"

export const SLIDE_TO_UNLOCK_VARIANTS: ComponentVariant[] = [
  {
    id: "slide-to-unlock-presets",
    title: "iOS Presets",
    description:
      "Classic iOS Slide to Unlock, Slide to Power Off, and Slide to Pay / Confirm action presets.",
    component: SlideToUnlockPresets,
  },
  {
    id: "slide-to-unlock-sizes",
    title: "Size Scaling",
    description:
      "Comparison of vertical heights from 48px compact inline sliders to 64px hero confirmation bars.",
    component: SlideToUnlockSizes,
  },
]

export { SlideToUnlockPresets, SlideToUnlockSizes }
