import type { ComponentType } from "react"

import { lazyWithRetry } from "@/shared/lib/lazy-with-retry"

export const BackgroundGradientCursorDemo = lazyWithRetry(() =>
  import("./background-gradient-cursor-demo").then((m) => ({
    default: m.BackgroundGradientCursorDemo,
  }))
)
export const CardDemo = lazyWithRetry(() =>
  import("./card-demo").then((m) => ({ default: m.CardDemo }))
)
export const CodeBlockDemo = lazyWithRetry(() =>
  import("./code-block-demo").then((m) => ({ default: m.CodeBlockDemo }))
)
export const FlipClockDemo = lazyWithRetry(() =>
  import("./flip-clock-demo").then((m) => ({ default: m.FlipClockDemo }))
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

export const REGISTRY_DEMOS: Record<string, ComponentType> = {
  select: SelectDemo,
  card: CardDemo,
  "code-block": CodeBlockDemo,
  "unboxing-bucket": UnboxingBucketDemo,
  "flip-clock": FlipClockDemo,
  map: MapDemo,
  "text-hover-effect": TextHoverEffectDemo,
  "background-gradient-cursor": BackgroundGradientCursorDemo,
  "pp-mark-isometric": PPMarkIsometricDemo,
  "phong-phan-isometric": PhongPhanIsometricDemo,
  "middle-truncation": MiddleTruncationDemo,
  "middle-truncation-demo": MiddleTruncationDemo,
}
