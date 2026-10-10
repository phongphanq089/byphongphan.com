import type { ComponentVariant } from "@/features/component-ui/types"

import LineNavBasic from "./line-nav/line-nav-basic"
import LineNavGrouped from "./line-nav/line-nav-grouped"

export const LINE_NAV_VARIANTS: ComponentVariant[] = [
  {
    id: "line-nav-basic",
    title: "Basic Line Nav",
    description:
      "Minimalist vertical navigation with uniform ruler ticks and spring-physics active indicators.",
    component: LineNavBasic,
  },
  {
    id: "line-nav-grouped",
    title: "Grouped Line Nav",
    description:
      "Categorized navigation with prominent section headers and nested sub-items seamlessly linked by tick marks.",
    component: LineNavGrouped,
  },
]

export { LineNavBasic, LineNavGrouped }
