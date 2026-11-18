import type { ComponentType } from "react"

import { lazyWithRetry } from "@/shared/lib/lazy-with-retry"

export const BackgroundGradientCursorDemo = lazyWithRetry(() =>
  import("./background-gradient-cursor-demo").then((m) => ({
    default: m.BackgroundGradientCursorDemo,
  }))
)
export const BadgeDemo = lazyWithRetry(() =>
  import("./badge-demo").then((m) => ({ default: m.BadgeDemo }))
)
export const BorderGlowDemo = lazyWithRetry(() =>
  import("./border-glow-demo").then((m) => ({
    default: m.BorderGlowDemo,
  }))
)
export const CardDemo = lazyWithRetry(() =>
  import("./card-demo").then((m) => ({ default: m.CardDemo }))
)
export const CodeBlockDemo = lazyWithRetry(() =>
  import("./code-block-demo").then((m) => ({ default: m.CodeBlockDemo }))
)
export const CradleTextDemo = lazyWithRetry(() =>
  import("./cradle-text-demo").then((m) => ({ default: m.CradleTextDemo }))
)
export const ElasticSliderDemo = lazyWithRetry(() =>
  import("./elastic-slider-demo").then((m) => ({
    default: m.ElasticSliderDemo,
  }))
)
export const FlipClockDemo = lazyWithRetry(() =>
  import("./time-scrubber-demo").then((m) => ({ default: m.TimeScrubberDemo }))
)
export const TimeScrubberDemo = lazyWithRetry(() =>
  import("./time-scrubber-demo").then((m) => ({ default: m.TimeScrubberDemo }))
)
export const LineNavDemo = lazyWithRetry(() =>
  import("./line-nav-demo").then((m) => ({ default: m.LineNavDemo }))
)
export const Letter3DSwapDemo = lazyWithRetry(() =>
  import("./letter-3d-swap-demo").then((m) => ({
    default: m.Letter3DSwapDemo,
  }))
)
export const MapDemo = lazyWithRetry(() =>
  import("./map-demo").then((m) => ({ default: m.MapDemo }))
)
export const MiddleTruncationDemo = lazyWithRetry(() =>
  import("./middle-truncation-demo").then((m) => ({
    default: m.MiddleTruncationDemo,
  }))
)
export const PluckedTextDemo = lazyWithRetry(() =>
  import("./plucked-text-demo").then((m) => ({
    default: m.PluckedTextDemo,
  }))
)
export const SelectDemo = lazyWithRetry(() =>
  import("./select-demo").then((m) => ({ default: m.SelectDemo }))
)
export const ScrollAreaDemo = lazyWithRetry(() =>
  import("./scroll-area-demo").then((m) => ({
    default: m.ScrollAreaDemo,
  }))
)
export const ScrollIndicatorDemo = lazyWithRetry(() =>
  import("./scroll-indicator-demo").then((m) => ({
    default: m.ScrollIndicatorDemo,
  }))
)
export const SpotlightCardDemo = lazyWithRetry(() =>
  import("./spotlight-card-demo").then((m) => ({
    default: m.SpotlightCardDemo,
  }))
)
export const SwooshTextDemo = lazyWithRetry(() =>
  import("./swoosh-text-demo").then((m) => ({
    default: m.SwooshTextDemo,
  }))
)
export const TextHoverEffectDemo = lazyWithRetry(() =>
  import("./text-hover-effect-demo").then((m) => ({
    default: m.TextHoverEffectDemo,
  }))
)
export const TypingTextDemo = lazyWithRetry(() =>
  import("./typing-text-demo").then((m) => ({
    default: m.TypingTextDemo,
  }))
)
export const UnboxingBucketDemo = lazyWithRetry(() =>
  import("./unboxing-bucket-demo").then((m) => ({
    default: m.UnboxingBucketDemo,
  }))
)
export const UnderlineAnimationDemo = lazyWithRetry(() =>
  import("./underline-animation-demo").then((m) => ({
    default: m.UnderlineAnimationDemo,
  }))
)
export const UnderlineToBackgroundDemo = lazyWithRetry(() =>
  import("./underline-to-background-demo").then((m) => ({
    default: m.UnderlineToBackgroundDemo,
  }))
)

export const COMPONENT_DEMOS: Record<string, ComponentType> = {
  select: SelectDemo,
  badge: BadgeDemo,
  "badge-demo": BadgeDemo,
  card: CardDemo,
  "code-block": CodeBlockDemo,
  "unboxing-bucket": UnboxingBucketDemo,
  "underline-animation": UnderlineAnimationDemo,
  "underline-animation-demo": UnderlineAnimationDemo,
  "underline-to-background": UnderlineToBackgroundDemo,
  "underline-to-background-demo": UnderlineToBackgroundDemo,
  "flip-clock": TimeScrubberDemo,
  "time-scrubber": TimeScrubberDemo,
  "time-scrubber-demo": TimeScrubberDemo,
  "scroll-indicator": ScrollIndicatorDemo,
  "scroll-indicator-demo": ScrollIndicatorDemo,
  map: MapDemo,
  "text-hover-effect": TextHoverEffectDemo,
  "background-gradient-cursor": BackgroundGradientCursorDemo,
  "middle-truncation": MiddleTruncationDemo,
  "middle-truncation-demo": MiddleTruncationDemo,
  "line-nav": LineNavDemo,
  "line-nav-demo": LineNavDemo,
  "letter-3d-swap": Letter3DSwapDemo,
  "letter-3d-swap-demo": Letter3DSwapDemo,
  "typing-text": TypingTextDemo,
  "typing-text-demo": TypingTextDemo,
  "swoosh-text": SwooshTextDemo,
  "swoosh-text-demo": SwooshTextDemo,
  "plucked-text": PluckedTextDemo,
  "plucked-text-demo": PluckedTextDemo,
  "cradle-text": CradleTextDemo,
  "cradle-text-demo": CradleTextDemo,
  "elastic-slider": ElasticSliderDemo,
  "elastic-slider-demo": ElasticSliderDemo,
  "spotlight-card": SpotlightCardDemo,
  "spotlight-card-demo": SpotlightCardDemo,
  "border-glow": BorderGlowDemo,
  "border-glow-demo": BorderGlowDemo,
  "scroll-area": ScrollAreaDemo,
  "scroll-area-demo": ScrollAreaDemo,
}
