import type { ComponentVariant } from "@/features/component-ui/types"

import ScrollAreaBordered from "./scroll-area/scroll-area-bordered"
import ScrollAreaFloating from "./scroll-area/scroll-area-floating"
import ScrollAreaHorizontal from "./scroll-area/scroll-area-horizontal"
import ScrollAreaMinimal from "./scroll-area/scroll-area-minimal"
import ScrollAreaScrollFade from "./scroll-area/scroll-area-scroll-fade"

export const SCROLL_AREA_VARIANTS: ComponentVariant[] = [
  {
    id: "scroll-area-horizontal",
    title: "Horizontal Scrolling",
    description:
      "Horizontal scroll area supporting wide content, media carousels, and responsive touch panning.",
    component: ScrollAreaHorizontal,
  },
  {
    id: "scroll-area-minimal",
    title: "Minimal Hairline",
    description:
      "Zero-margin hairline scrollbar variant suited for dense code editors, log viewers, and compact dashboards.",
    component: ScrollAreaMinimal,
  },
  {
    id: "scroll-area-bordered",
    title: "Bordered Track",
    description:
      "Visible track border and background separating the gutter clearly from scrollable content.",
    component: ScrollAreaBordered,
  },
  {
    id: "scroll-area-floating",
    title: "Floating Island",
    description:
      "Floating elevated scrollbar thumb with soft drop shadow and inset margins for card surfaces and modals.",
    component: ScrollAreaFloating,
  },
  {
    id: "scroll-area-scroll-fade",
    title: "Scroll Fade Mask",
    description:
      "Top and bottom content fade masks indicating offscreen overflowing content dynamically.",
    component: ScrollAreaScrollFade,
  },
]

export {
  ScrollAreaBordered,
  ScrollAreaFloating,
  ScrollAreaHorizontal,
  ScrollAreaMinimal,
  ScrollAreaScrollFade,
}
