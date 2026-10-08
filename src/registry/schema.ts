import type React from "react"

export type SchematicType =
  | "select"
  | "card"
  | "unboxing-bucket"
  | "code-block"
  | "flip-clock"
  | "map"
  | "text-hover-effect"
  | "background-gradient-cursor"
  | "pp-mark-isometric"
  | "phong-phan-isometric"
  | "middle-truncation"
  | "line-nav"

export type RegistryType =
  | "registry:ui"
  | "registry:component"
  | "registry:hook"
  | "registry:block"
  | "registry:lib"

export type ComponentCategoryId = "primitives" | "animations" | "foundations"
export type BlockCategoryId = "application" | "marketing" | "ecommerce"

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
  /** UI category for the component grid or block section */
  category: ComponentCategoryId | BlockCategoryId
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
