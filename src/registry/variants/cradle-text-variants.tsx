import type { ComponentVariant } from "@/features/component-ui/types"

import CradleTextAccent from "./cradle-text/cradle-text-accent"
import CradleTextBounce from "./cradle-text/cradle-text-bounce"

export const CRADLE_TEXT_VARIANTS: ComponentVariant[] = [
  {
    id: "cradle-text-bounce",
    title: "Restitution Comparison",
    description:
      "Comparison of high elasticity steel collisions vs soft energy dissipation in Newton's cradle pendulum.",
    component: CradleTextBounce,
  },
  {
    id: "cradle-text-accent",
    title: "Vibrant Pendulum Accent",
    description:
      "Suspended kinetic pendulum typography rendered with vibrant brand primary styling.",
    component: CradleTextAccent,
  },
]

export { CradleTextAccent, CradleTextBounce }
