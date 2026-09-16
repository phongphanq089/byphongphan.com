import type React from "react"

import type { SchematicType } from "./schematics"

export type { SchematicType } from "./schematics"

export type RegistryType =
  | "registry:ui"
  | "registry:component"
  | "registry:hook"
  | "registry:block"
  | "registry:lib"

export type ComponentCategoryId = "primitives" | "animations" | "foundations"

export interface RegistryFile {
  path: string
  content?: string
  type: RegistryType
  target?: string
}

export interface RegistryItem {
  name: string
  title: string
  description: string
  type: RegistryType
  /** UI category for the component grid */
  category: ComponentCategoryId
  /** Schematic component representing the wireframe thumbnail for this item */
  schematic?: React.ComponentType
  /** Schematic thumbnail type used on component cards */
  schematicType?: SchematicType | string
  /** Whether the component is newly added (renders "New" badge on card) */
  isNew?: boolean
  author?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
  tailwind?: {
    config?: Record<string, unknown>
  }
  cssVars?: {
    light?: Record<string, string>
    dark?: Record<string, string>
  }
  meta?: Record<string, unknown>
}
