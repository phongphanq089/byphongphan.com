import type { ComponentVariant } from "@/features/component-ui/types"

import CardExpandableBillingUsageCard from "./card/card-expandable-billing-usage-card"
import { CardStackedDeptEffect } from "./card/card-stacked-depth-effect"
import { CardWithFullImage } from "./card/card-with-full-image"
import CardWithImage from "./card/card-with-image"
import { CardWithImageScale } from "./card/card-with-image-scale"
import FullCardFadeEffect from "./card/full-card-fade-effect"

export const CARD_VARIANTS: ComponentVariant[] = [
  {
    id: "card-with-image",
    title: "Card with Image",
    component: CardWithImage,
  },
  {
    id: "card-with-image-scale",
    title: "Card with image scale hover effect",
    component: CardWithImageScale,
  },
  {
    id: "card-with-full-image",
    title: "Card with full image",
    component: CardWithFullImage,
  },
  {
    id: "full-card-fade-effect",
    title: " Full card with image and shadow fade effect",
    component: FullCardFadeEffect,
  },
  {
    id: "card-stacked-depth-effect",
    title: " Full card with image and shadow fade effect",
    component: CardStackedDeptEffect,
  },
  {
    id: "card-expandable-billing-usage-card",
    title: "Expandable billing usage card",
    component: CardExpandableBillingUsageCard,
  },
]

export { CardWithImage }
