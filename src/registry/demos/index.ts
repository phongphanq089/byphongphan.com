import type React from "react"

import { AnimatedGlowCardDemo } from "./animated-glow-card-demo"
import { BadgeDemo } from "./badge-demo"
import { ButtonDemo } from "./button-demo"
import { CardDemo } from "./card-demo"
import { CodeBlockDemo } from "./code-block-demo"
import { SelectDemo } from "./select-demo"
import { SeparatorDemo } from "./separator-demo"
import { UnboxingBucketDemo } from "./unboxing-bucket-demo"

export {
  AnimatedGlowCardDemo,
  BadgeDemo,
  ButtonDemo,
  CardDemo,
  CodeBlockDemo,
  SelectDemo,
  SeparatorDemo,
  UnboxingBucketDemo,
}

export const REGISTRY_DEMOS: Record<string, React.ComponentType> = {
  select: SelectDemo,
  button: ButtonDemo,
  badge: BadgeDemo,
  card: CardDemo,
  "code-block": CodeBlockDemo,
  "animated-glow-card": AnimatedGlowCardDemo,
  "unboxing-bucket": UnboxingBucketDemo,
  separator: SeparatorDemo,
}
