import type { ComponentVariant } from "@/features/component-ui/types"

import TextHoverEffectAutomatic from "./text-hover-effect/text-hover-effect-automatic"
import TextHoverEffectNeon from "./text-hover-effect/text-hover-effect-neon"
import TextHoverEffectSunset from "./text-hover-effect/text-hover-effect-sunset"

export const TEXT_HOVER_EFFECT_VARIANTS: ComponentVariant[] = [
  {
    id: "text-hover-effect-automatic",
    title: "Automatic Ambient Sweep",
    description:
      "Autonomously sweeps the radial gradient mask across the text when idle.",
    component: TextHoverEffectAutomatic,
  },
  {
    id: "text-hover-effect-neon",
    title: "Cyberpunk Neon Palette",
    description:
      "Custom neon palette with cyan, azure, violet, and electric pink stops.",
    component: TextHoverEffectNeon,
  },
  {
    id: "text-hover-effect-sunset",
    title: "Sunset Palette",
    description:
      "Warm gradient palette featuring yellow, amber, rose, and purple tones.",
    component: TextHoverEffectSunset,
  },
]

export { TextHoverEffectAutomatic, TextHoverEffectNeon, TextHoverEffectSunset }
