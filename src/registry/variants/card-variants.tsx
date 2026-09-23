import type { ComponentVariant } from "@/features/component-ui/types"

import CardExpandableBillingUsageCard from "./card/card-expandable-billing-usage-card"
import CardGradientGlassFeature from "./card/card-gradient-glass-feature"
import CardGradientGlassPost from "./card/card-gradient-glass-post"
import CardShowcaseCode from "./card/card-showcase-code"
import CardShowcaseStage from "./card/card-showcase-stage"
import { CardStackedDeptEffect } from "./card/card-stacked-depth-effect"
import { CardWithFullImage } from "./card/card-with-full-image"
import CardWithImage from "./card/card-with-image"
import { CardWithImageScale } from "./card/card-with-image-scale"
import FullCardFadeEffect from "./card/full-card-fade-effect"

export const CARD_VARIANTS: ComponentVariant[] = [
  {
    id: "card-showcase-stage",
    title: "Design System Showcase Stage Card",
    description:
      "Showcase container featuring a segregated header with category tag, live preview badge, and recessed canvas stage.",
    component: CardShowcaseStage,
  },
  {
    id: "card-showcase-code",
    title: "Showcase Card with Code Toggle",
    description:
      "Interactive component stage paired with an expandable syntax block and quick-copy action.",
    component: CardShowcaseCode,
  },
  {
    id: "card-gradient-glass-post",
    title: "Gradient Glass Social Post Card",
    description:
      "Double-shell frosted glassmorphism card with ambient hover sheen, avatar, and nested reply thread.",
    component: CardGradientGlassPost,
  },
  {
    id: "card-gradient-glass-feature",
    title: "Gradient Glass Feature Metric Card",
    description:
      "Frosted glass feature container with glowing indicator, prominent metric, and call-to-action.",
    component: CardGradientGlassFeature,
  },
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

export {
  CardExpandableBillingUsageCard,
  CardGradientGlassFeature,
  CardGradientGlassPost,
  CardShowcaseCode,
  CardShowcaseStage,
  CardStackedDeptEffect,
  CardWithFullImage,
  CardWithImage,
  CardWithImageScale,
  FullCardFadeEffect,
}
