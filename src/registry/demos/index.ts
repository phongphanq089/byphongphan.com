import type React from "react"

import { CardDemo } from "./card-demo"
import { CodeBlockDemo } from "./code-block-demo"
import { FlipClockDemo } from "./flip-clock-demo"
import { SelectDemo } from "./select-demo"
import { UnboxingBucketDemo } from "./unboxing-bucket-demo"

export {
  CardDemo,
  CodeBlockDemo,
  FlipClockDemo,
  SelectDemo,
  UnboxingBucketDemo,
}

export const REGISTRY_DEMOS: Record<string, React.ComponentType> = {
  select: SelectDemo,
  card: CardDemo,
  "code-block": CodeBlockDemo,
  "unboxing-bucket": UnboxingBucketDemo,
  "flip-clock": FlipClockDemo,
}
