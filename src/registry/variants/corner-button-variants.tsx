import type { ComponentVariant } from "@/features/component-ui/types"

import CornerButtonAccents from "./corner-button/corner-button-accents"
import CornerButtonActions from "./corner-button/corner-button-actions"

export const CORNER_BUTTON_VARIANTS: ComponentVariant[] = [
  {
    id: "corner-button-accents",
    title: "Accent Themes",
    description:
      "Aesthetic chromatic themes using CSS variables and vibrant hex accent backdrops with synchronized glow.",
    component: CornerButtonAccents,
  },
  {
    id: "corner-button-actions",
    title: "Action Icons",
    description:
      "Integrating custom SVG and Lucide action icons inside the animated corner button.",
    component: CornerButtonActions,
  },
]

export { CornerButtonAccents, CornerButtonActions }
