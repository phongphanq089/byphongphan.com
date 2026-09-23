import type React from "react"

import { BackgroundGradientCursorDemo } from "./background-gradient-cursor-demo"
import { CardDemo } from "./card-demo"
import { CodeBlockDemo } from "./code-block-demo"
import { FlipClockDemo } from "./flip-clock-demo"
import { MapDemo } from "./map-demo"
import { PhongPhanIsometricDemo } from "./phong-phan-isometric-demo"
import { PPMarkIsometricDemo } from "./pp-mark-isometric-demo"
import { SelectDemo } from "./select-demo"
import { TextHoverEffectDemo } from "./text-hover-effect-demo"
import { UnboxingBucketDemo } from "./unboxing-bucket-demo"

export {
  BackgroundGradientCursorDemo,
  CardDemo,
  CodeBlockDemo,
  FlipClockDemo,
  MapDemo,
  PhongPhanIsometricDemo,
  PPMarkIsometricDemo,
  SelectDemo,
  TextHoverEffectDemo,
  UnboxingBucketDemo,
}

export const REGISTRY_DEMOS: Record<string, React.ComponentType> = {
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
}
