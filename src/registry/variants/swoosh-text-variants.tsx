import type { ComponentVariant } from "@/features/component-ui/types"

import SwooshTextAccent from "./swoosh-text/swoosh-text-accent"
import SwooshTextMechanical from "./swoosh-text/swoosh-text-mechanical"

export const SWOOSH_TEXT_VARIANTS: ComponentVariant[] = [
  {
    id: "swoosh-text-accent",
    title: "Primary Under-Glow",
    description:
      "Extruded 3D typography with customized base layer accent glow.",
    component: SwooshTextAccent,
  },
  {
    id: "swoosh-text-mechanical",
    title: "Mechanical Keycap Physics",
    description:
      "Deep 16-layer extrusion with interactive click-to-sink spring kinematics.",
    component: SwooshTextMechanical,
  },
]

export { SwooshTextAccent, SwooshTextMechanical }
