import type { ComponentVariant } from "@/features/component-ui/types"

import ElasticSliderSizes from "./elastic-slider/elastic-slider-sizes"
import ElasticSliderThemes from "./elastic-slider/elastic-slider-themes"

export const ELASTIC_SLIDER_VARIANTS: ComponentVariant[] = [
  {
    id: "elastic-slider-sizes",
    title: "Size Proportions",
    description:
      "Comparison of vertical heights from 32px (sm) for dense inspector sidebars to 48px (lg) for hero dials.",
    component: ElasticSliderSizes,
  },
  {
    id: "elastic-slider-themes",
    title: "Color Themes",
    description:
      "Semantic color palettes including Primary, Success, and Destructive fill variants.",
    component: ElasticSliderThemes,
  },
]

export { ElasticSliderSizes, ElasticSliderThemes }
