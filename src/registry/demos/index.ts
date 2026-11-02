import type { ComponentType } from "react"

import { lazyWithRetry } from "@/shared/lib/lazy-with-retry"

export const BackgroundGradientCursorDemo = lazyWithRetry(() =>
  import("./background-gradient-cursor-demo").then((m) => ({
    default: m.BackgroundGradientCursorDemo,
  }))
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
export const FlipClockDemo = lazyWithRetry(() =>
  import("./time-scrubber-demo").then((m) => ({ default: m.TimeScrubberDemo }))
)
export const TimeScrubberDemo = lazyWithRetry(() =>
  import("./time-scrubber-demo").then((m) => ({ default: m.TimeScrubberDemo }))
)
export const LineNavDemo = lazyWithRetry(() =>
  import("./line-nav-demo").then((m) => ({ default: m.LineNavDemo }))
)
export const MapDemo = lazyWithRetry(() =>
  import("./map-demo").then((m) => ({ default: m.MapDemo }))
)
export const MiddleTruncationDemo = lazyWithRetry(() =>
  import("./middle-truncation-demo").then((m) => ({
    default: m.MiddleTruncationDemo,
  }))
)
export const PhongPhanIsometricDemo = lazyWithRetry(() =>
  import("./phong-phan-isometric-demo").then((m) => ({
    default: m.PhongPhanIsometricDemo,
  }))
)
export const PPMarkIsometricDemo = lazyWithRetry(() =>
  import("./pp-mark-isometric-demo").then((m) => ({
    default: m.PPMarkIsometricDemo,
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
export const RailScrollScrubberDemo = lazyWithRetry(() =>
  import("./rail-scroll-scrubber-demo").then((m) => ({
    default: m.RailScrollScrubberDemo,
  }))
)
export const SpotlightCardDemo = lazyWithRetry(() =>
  import("./spotlight-card-demo").then((m) => ({
    default: m.SpotlightCardDemo,
  }))
)
export const TextHoverEffectDemo = lazyWithRetry(() =>
  import("./text-hover-effect-demo").then((m) => ({
    default: m.TextHoverEffectDemo,
  }))
)
export const UnboxingBucketDemo = lazyWithRetry(() =>
  import("./unboxing-bucket-demo").then((m) => ({
    default: m.UnboxingBucketDemo,
  }))
)

export const UseClickOutsideDemo = lazyWithRetry(() =>
  import("./use-click-outside-demo").then((m) => ({
    default: m.UseClickOutsideDemo,
  }))
)
export const UseMediaQueryDemo = lazyWithRetry(() =>
  import("./use-media-query-demo").then((m) => ({
    default: m.UseMediaQueryDemo,
  }))
)
export const UseCopyToClipboardDemo = lazyWithRetry(() =>
  import("./use-copy-to-clipboard-demo").then((m) => ({
    default: m.UseCopyToClipboardDemo,
  }))
)
export const UseIntersectionObserverDemo = lazyWithRetry(() =>
  import("./use-intersection-observer-demo").then((m) => ({
    default: m.UseIntersectionObserverDemo,
  }))
)
export const UseDebounceDemo = lazyWithRetry(() =>
  import("./use-debounce-demo").then((m) => ({
    default: m.UseDebounceDemo,
  }))
)
export const UseLocalStorageDemo = lazyWithRetry(() =>
  import("./use-local-storage-demo").then((m) => ({
    default: m.UseLocalStorageDemo,
  }))
)
export const UseToggleDemo = lazyWithRetry(() =>
  import("./use-toggle-demo").then((m) => ({
    default: m.UseToggleDemo,
  }))
)
export const UsePreviousDemo = lazyWithRetry(() =>
  import("./use-previous-demo").then((m) => ({
    default: m.UsePreviousDemo,
  }))
)
export const UseHoverDemo = lazyWithRetry(() =>
  import("./use-hover-demo").then((m) => ({
    default: m.UseHoverDemo,
  }))
)

export const REGISTRY_DEMOS: Record<string, ComponentType> = {
  select: SelectDemo,
  card: CardDemo,
  "code-block": CodeBlockDemo,
  "unboxing-bucket": UnboxingBucketDemo,
  "flip-clock": TimeScrubberDemo,
  "time-scrubber": TimeScrubberDemo,
  "time-scrubber-demo": TimeScrubberDemo,
  "rail-scroll-scrubber": RailScrollScrubberDemo,
  "rail-scroll-scrubber-demo": RailScrollScrubberDemo,
  map: MapDemo,
  "text-hover-effect": TextHoverEffectDemo,
  "background-gradient-cursor": BackgroundGradientCursorDemo,
  "pp-mark-isometric": PPMarkIsometricDemo,
  "phong-phan-isometric": PhongPhanIsometricDemo,
  "middle-truncation": MiddleTruncationDemo,
  "middle-truncation-demo": MiddleTruncationDemo,
  "line-nav": LineNavDemo,
  "line-nav-demo": LineNavDemo,
  "spotlight-card": SpotlightCardDemo,
  "spotlight-card-demo": SpotlightCardDemo,
  "border-glow": BorderGlowDemo,
  "border-glow-demo": BorderGlowDemo,
  "scroll-area": ScrollAreaDemo,
  "scroll-area-demo": ScrollAreaDemo,
  "use-click-outside": UseClickOutsideDemo,
  "use-click-outside-demo": UseClickOutsideDemo,
  "use-media-query": UseMediaQueryDemo,
  "use-media-query-demo": UseMediaQueryDemo,
  "use-copy-to-clipboard": UseCopyToClipboardDemo,
  "use-copy-to-clipboard-demo": UseCopyToClipboardDemo,
  "use-intersection-observer": UseIntersectionObserverDemo,
  "use-intersection-observer-demo": UseIntersectionObserverDemo,
  "use-debounce": UseDebounceDemo,
  "use-debounce-demo": UseDebounceDemo,
  "use-local-storage": UseLocalStorageDemo,
  "use-local-storage-demo": UseLocalStorageDemo,
  "use-toggle": UseToggleDemo,
  "use-toggle-demo": UseToggleDemo,
  "use-previous": UsePreviousDemo,
  "use-previous-demo": UsePreviousDemo,
  "use-hover": UseHoverDemo,
  "use-hover-demo": UseHoverDemo,
}
