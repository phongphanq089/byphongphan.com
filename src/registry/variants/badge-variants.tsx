import type { ComponentVariant } from "@/features/component-ui/types"

import BadgeShapes from "./badge/badge-shapes"
import BadgeSizes from "./badge/badge-sizes"
import BadgeStatus from "./badge/badge-status"

export const BADGE_VARIANTS: ComponentVariant[] = [
  {
    id: "badge-status",
    title: "Status Indicators",
    description:
      "Translucent health and lifecycle status badges featuring reactive color-matched micro dots.",
    component: BadgeStatus,
  },
  {
    id: "badge-shapes",
    title: "Contour Geometries",
    description:
      "Comparison of pill, rounded (Linear-style), and square geometric contour profiles.",
    component: BadgeShapes,
  },
  {
    id: "badge-sizes",
    title: "Size Hierarchy",
    description:
      "Calibrated vertical height variants from ultra-compact 18px (xs) to prominent 28px (lg).",
    component: BadgeSizes,
  },
]

export { BadgeShapes, BadgeSizes, BadgeStatus }
