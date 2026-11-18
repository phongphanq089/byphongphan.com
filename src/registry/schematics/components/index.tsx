import type React from "react"
import { BackgroundGradientCursorSchematic } from "./background-gradient-cursor-schematic"
import { BorderGlowSchematic } from "./border-glow-schematic"
import { CardSchematic } from "./card-schematic"
import { CodeBlockSchematic } from "./code-block-schematic"
import { Letter3DSwapSchematic } from "./letter-3d-swap-schematic"
import { LineNavSchematic } from "./line-nav-schematic"
import { MapSchematic } from "./map-schematic"
import { MiddleTruncationSchematic } from "./middle-truncation-schematic"
import { ScrollAreaSchematic } from "./scroll-area-schematic"
import { DrawerSchematic } from "./drawer-schematic"
import { SelectSchematic } from "./select-schematic"
import { SpotlightCardSchematic } from "./spotlight-card-schematic"
import { TextHoverEffectSchematic } from "./text-hover-effect-schematic"
import { TimeScrubberSchematic } from "./time-scrubber-schematic"
import { ScrollIndicatorSchematic } from "./scroll-indicator-schematic"
import { UnderlineAnimationSchematic } from "./underline-animation-schematic"
import { UnderlineToBackgroundSchematic } from "./underline-to-background-schematic"
import { UnboxingBucketSchematic } from "./unboxing-bucket-schematic"

export * from "./background-gradient-cursor-schematic"
export * from "./border-glow-schematic"
export * from "./card-schematic"
export * from "./code-block-schematic"
export * from "./time-scrubber-schematic"
export { TimeScrubberSchematic as FlipClockSchematic } from "./time-scrubber-schematic"
export * from "./line-nav-schematic"
export * from "./map-schematic"
export * from "./middle-truncation-schematic"
export * from "./scroll-area-schematic"
export * from "./drawer-schematic"
export * from "./letter-3d-swap-schematic"
export * from "./select-schematic"
export * from "./spotlight-card-schematic"
export * from "./text-hover-effect-schematic"
export * from "./time-scrubber-schematic"
export * from "./scroll-indicator-schematic"
export * from "./underline-animation-schematic"
export * from "./underline-to-background-schematic"
export * from "./unboxing-bucket-schematic"

export function DefaultComponentSchematic() {
  return (
    <div className="flex h-34 w-54 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3 text-center select-none">
      <div className="size-5 rounded-full border border-white/20 bg-white/5" />
      <div className="h-1.5 w-16 rounded-full bg-white/20" />
    </div>
  )
}

export const COMPONENT_SCHEMATICS_MAP: Record<string, React.ComponentType> = {
  select: SelectSchematic,
  card: CardSchematic,
  "unboxing-bucket": UnboxingBucketSchematic,
  "code-block": CodeBlockSchematic,
  "flip-clock": TimeScrubberSchematic,
  "time-scrubber": TimeScrubberSchematic,
  "scroll-indicator": ScrollIndicatorSchematic,
  map: MapSchematic,
  "text-hover-effect": TextHoverEffectSchematic,
  "background-gradient-cursor": BackgroundGradientCursorSchematic,
  "middle-truncation": MiddleTruncationSchematic,
  "line-nav": LineNavSchematic,
  "spotlight-card": SpotlightCardSchematic,
  "border-glow": BorderGlowSchematic,
  "scroll-area": ScrollAreaSchematic,
  drawer: DrawerSchematic,
  "underline-to-background": UnderlineToBackgroundSchematic,
  "underline-animation": UnderlineAnimationSchematic,
  "letter-3d-swap": Letter3DSwapSchematic,
}

export function RenderComponentSchematic({ type }: { type?: string }) {
  if (!type) return <DefaultComponentSchematic />
  const Component = COMPONENT_SCHEMATICS_MAP[type]
  if (!Component) return <DefaultComponentSchematic />
  return <Component />
}
