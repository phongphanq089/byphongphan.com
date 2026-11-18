import type { ComponentVariant } from "@/features/component-ui/types"

import PluckedTextAccent from "./plucked-text/plucked-text-accent"
import PluckedTextTension from "./plucked-text/plucked-text-tension"

export const PLUCKED_TEXT_VARIANTS: ComponentVariant[] = [
  {
    id: "plucked-text-tension",
    title: "Tension Spectrum",
    description:
      "Comparison of loose vs high string tension with distinct acoustic oscillation rates.",
    component: PluckedTextTension,
  },
  {
    id: "plucked-text-accent",
    title: "Vibrant Accent",
    description:
      "Acoustic plucked typography themed with primary brand styling and sweep strumming.",
    component: PluckedTextAccent,
  },
]

export { PluckedTextAccent, PluckedTextTension }
