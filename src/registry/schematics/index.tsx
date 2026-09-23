import type React from "react"

import { BackgroundGradientCursorSchematic } from "./background-gradient-cursor-schematic"
import { CardSchematic } from "./card-schematic"
import { CodeBlockSchematic } from "./code-block-schematic"
import { FlipClockSchematic } from "./flip-clock-schematic"
import { MapSchematic } from "./map-schematic"
import { SelectSchematic } from "./select-schematic"
import { TextHoverEffectSchematic } from "./text-hover-effect-schematic"
import { UnboxingBucketSchematic } from "./unboxing-bucket-schematic"

export * from "./background-gradient-cursor-schematic"
export * from "./card-schematic"
export * from "./code-block-schematic"
export * from "./flip-clock-schematic"
export * from "./map-schematic"
export * from "./select-schematic"
export * from "./text-hover-effect-schematic"
export * from "./unboxing-bucket-schematic"

export type SchematicType =
  | "select"
  | "card"
  | "unboxing-bucket"
  | "code-block"
  | "flip-clock"
  | "map"
  | "text-hover-effect"
  | "background-gradient-cursor"

export function DefaultSchematic() {
  return (
    <div className="flex h-20 w-32 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-2 text-center font-sans select-none">
      <div className="size-4 rounded-full border border-white/20 bg-white/5" />
      <div className="h-1.5 w-12 rounded-full bg-white/20" />
    </div>
  )
}

export const SCHEMATICS_MAP: Record<SchematicType, React.ComponentType> = {
  select: SelectSchematic,
  card: CardSchematic,
  "unboxing-bucket": UnboxingBucketSchematic,
  "code-block": CodeBlockSchematic,
  "flip-clock": FlipClockSchematic,
  map: MapSchematic,
  "text-hover-effect": TextHoverEffectSchematic,
  "background-gradient-cursor": BackgroundGradientCursorSchematic,
}

export function RenderSchematic({ type }: { type?: string }) {
  if (!type) return <DefaultSchematic />
  const Component = SCHEMATICS_MAP[type as SchematicType]
  if (!Component) return <DefaultSchematic />
  return <Component />
}
