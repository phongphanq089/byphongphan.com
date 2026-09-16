import type React from "react"

import type { ComponentCategoryId } from "@/registry/schema"
import type { SchematicType } from "@/registry/schematics"

export type { ComponentCategoryId } from "@/registry/schema"
export type { SchematicType } from "@/registry/schematics"

/** Extends ComponentCategoryId with the "all" sentinel used by filter/grid UI */
export type ComponentCategoryIdWithAll = "all" | ComponentCategoryId

export interface ComponentCategory {
  id: ComponentCategoryIdWithAll
  label: string
  count?: number
}

export interface ComponentItem {
  id: string
  name: string
  slug: string
  category: ComponentCategoryId
  description: string
  count?: number
  schematicType: SchematicType
  badge?: string
  isNew?: boolean
}

export interface PropItem {
  name: string
  type: string
  default?: string
  description: string
  typeDetails?: string
}

export interface ComponentApiDoc {
  componentName: string
  description?: string
  props: PropItem[]
}

export interface ComponentVariant {
  id: string
  title: string
  description?: string
  component: React.ComponentType
  code?: string
  dependencies?: string[]
}

export interface ManualInstallStep {
  step: number
  title: string
  type: "dependencies" | "code" | "note"
  fileName?: string
  code?: string
  dependencies?: string[]
}
