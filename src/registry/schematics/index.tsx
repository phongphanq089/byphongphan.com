import type React from "react"

import { CardSchematic } from "./card-schematic"
import { CodeBlockSchematic } from "./code-block-schematic"
import { SelectSchematic } from "./select-schematic"
import { UnboxingBucketSchematic } from "./unboxing-bucket-schematic"

export * from "./card-schematic"
export * from "./code-block-schematic"
export * from "./select-schematic"
export * from "./unboxing-bucket-schematic"

export type SchematicType = "select" | "card" | "unboxing-bucket" | "code-block"

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
}

export function RenderSchematic({ type }: { type?: string }) {
  if (!type) return <DefaultSchematic />
  const Component = SCHEMATICS_MAP[type as SchematicType]
  if (!Component) return <DefaultSchematic />
  return <Component />
}
