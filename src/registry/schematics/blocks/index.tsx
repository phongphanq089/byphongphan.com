import type React from "react"

import type { BlockSchematicType } from "../../schema"
import {
  DefaultBlockSchematic,
  type DefaultBlockSchematicProps,
} from "./default-block-schematic"
import { Login01Schematic } from "./login-01-schematic"
import { NotFound01Schematic } from "./not-found-01-schematic"
import { NotFound02Schematic } from "./not-found-02-schematic"
import { NotFound03Schematic } from "./not-found-03-schematic"
import { StatsCards01Schematic } from "./stats-cards-01-schematic"
import { KoiBackgroundSchematic } from "./koi-background-schematic"
import { ArtcraftScroll01Schematic } from "./artcraft-scroll-01-schematic"

export * from "./default-block-schematic"
export * from "./login-01-schematic"
export * from "./not-found-01-schematic"
export * from "./not-found-02-schematic"
export * from "./not-found-03-schematic"
export * from "./stats-cards-01-schematic"
export * from "./koi-background-schematic"
export * from "./artcraft-scroll-01-schematic"

export const BLOCK_SCHEMATICS_MAP: Record<
  BlockSchematicType,
  React.ComponentType<DefaultBlockSchematicProps>
> = {
  "login-01": Login01Schematic,
  "not-found-01": NotFound01Schematic,
  "not-found-02": NotFound02Schematic,
  "not-found-03": NotFound03Schematic,
  "stats-cards-01": StatsCards01Schematic,
  "koi-background": KoiBackgroundSchematic,
  "artcraft-scroll-01": ArtcraftScroll01Schematic,
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
