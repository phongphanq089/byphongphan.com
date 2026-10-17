import type React from "react"

import type { BlockSchematicType } from "../../schema"
import {
  DefaultBlockSchematic,
  type DefaultBlockSchematicProps,
} from "./default-block-schematic"
import { NotFound01Schematic } from "./not-found-01-schematic"
import { NotFound02Schematic } from "./not-found-02-schematic"

export * from "./default-block-schematic"
export * from "./not-found-01-schematic"
export * from "./not-found-02-schematic"

export const BLOCK_SCHEMATICS_MAP: Record<
  BlockSchematicType,
  React.ComponentType<DefaultBlockSchematicProps>
> = {
  "not-found-01": NotFound01Schematic,
  "not-found-02": NotFound02Schematic,
}

export function RenderBlockSchematic({
  type,
  title,
}: {
  type?: string
  title?: string
}) {
  if (!type) return <DefaultBlockSchematic title={title} />
  const Component = BLOCK_SCHEMATICS_MAP[type as BlockSchematicType]
  if (!Component) return <DefaultBlockSchematic title={title} />
  return <Component title={title} />
}
