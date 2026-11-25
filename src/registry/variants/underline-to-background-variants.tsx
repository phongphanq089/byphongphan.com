import type { ComponentVariant } from "@/features/component-ui/types"

import UnderlineToBackgroundHeadline from "./underline-to-background/underline-to-background-headline"
import UnderlineToBackgroundNav from "./underline-to-background/underline-to-background-nav"

export const UNDERLINE_TO_BACKGROUND_VARIANTS: ComponentVariant[] = [
  {
    id: "underline-to-background-headline",
    title: "Editorial Headline",
    description:
      "Bold typographic title with spring-expanding underline highlights on focus words.",
    component: UnderlineToBackgroundHeadline,
  },
  {
    id: "underline-to-background-nav",
    title: "Navigation Links",
    description:
      "Clean horizontal navigation bar with smooth underline-to-fill hover transitions.",
    component: UnderlineToBackgroundNav,
  },
]

export { UnderlineToBackgroundHeadline, UnderlineToBackgroundNav }
