import type { ComponentVariant } from "@/features/component-ui/types"

import DrawerDemo from "./drawer/drawer-demo"
import DrawerInset from "./drawer/drawer-inset"
import DrawerMaxWidth from "./drawer/drawer-max-width"
import DrawerNested from "./drawer/drawer-nested"
import DrawerScrollable from "./drawer/drawer-scrollable"
import DrawerSnapPoints from "./drawer/drawer-snap-points"
import DrawerStraight from "./drawer/drawer-straight"

export const DRAWER_VARIANTS: ComponentVariant[] = [
  {
    id: "drawer-demo",
    title: "Default Sheet",
    description:
      "Interactive bottom sheet drawer with swipe-to-dismiss gesture, activity goal counter, and footer actions.",
    component: DrawerDemo,
  },
  {
    id: "drawer-inset",
    title: "Inset Floating",
    description:
      "Floating inset drawer with detached margins across all 4 screen edges: right, left, top, and bottom.",
    component: DrawerInset,
  },
  {
    id: "drawer-straight",
    title: "Straight Corners",
    description:
      "Minimalist architectural variant with sharp rectangular corners and clean non-scaling borders.",
    component: DrawerStraight,
  },
  {
    id: "drawer-scrollable",
    title: "Scrollable Content",
    description:
      "Automatic overflow scrolling with embedded scroll area and content fade mask for long list views.",
    component: DrawerScrollable,
  },
  {
    id: "drawer-nested",
    title: "Nested Drawers",
    description:
      "Multi-step nested drawer stack with dynamic depth scaling and smooth breadcrumb progression.",
    component: DrawerNested,
  },
  {
    id: "drawer-snap-points",
    title: "Snap Points",
    description:
      "Preset intermediate snap positions (35%, 70%, 100%) with velocity-aware drag thresholds.",
    component: DrawerSnapPoints,
  },
  {
    id: "drawer-max-width",
    title: "Max Width Popup",
    description:
      "Constrained DrawerPopup sheet width (max-w-lg mx-auto) with elegant side borders on desktop screens.",
    component: DrawerMaxWidth,
  },
]

export {
  DrawerDemo,
  DrawerInset,
  DrawerMaxWidth,
  DrawerNested,
  DrawerScrollable,
  DrawerSnapPoints,
  DrawerStraight,
}
