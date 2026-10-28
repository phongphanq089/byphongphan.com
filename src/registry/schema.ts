import type React from "react"

export type ComponentSchematicType =
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
  | "spotlight-card"
  | "border-glow"
  | "scroll-area"
  | "drawer"

export type BlockSchematicType =
  | "not-found-01"
  | "not-found-02"
  | "not-found-03"
  | "login-01"
  | "stats-cards-01"
  | "koi-background"

export type SchematicType = ComponentSchematicType | BlockSchematicType

export type RegistryType =
  | "registry:ui"
  | "registry:component"
  | "registry:hook"
  | "registry:block"
  | "registry:lib"

import type { BlockCategoryId, ComponentCategoryId } from "@/shared/config"

export type { BlockCategoryId, ComponentCategoryId } from "@/shared/config"

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
  /** Whether the component was recently upgraded or enhanced (renders "Updated" badge on card) */
  isUpdated?: boolean
  /** Legacy slug aliases for automatic 301 redirects and backwards compatibility */
  aliases?: string[]
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
