import type React from "react"

import type { SchematicType } from "@/registry/schema"
import type {
  ComponentCategoryId,
  ComponentCategoryIdWithAll,
} from "@/shared/config"

export type { SchematicType } from "@/registry/schema"
export type {
  ComponentCategoryFilterId,
  ComponentCategoryId,
  ComponentCategoryIdWithAll,
} from "@/shared/config"

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
