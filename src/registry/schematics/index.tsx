export * from "./components"
export * from "./blocks"

// Aliases for full backwards compatibility with existing consumers
export {
  DefaultComponentSchematic as DefaultSchematic,
  COMPONENT_SCHEMATICS_MAP as SCHEMATICS_MAP,
  RenderComponentSchematic as RenderSchematic,
} from "./components"

import type { SchematicType } from "../schema"

export type { SchematicType }
