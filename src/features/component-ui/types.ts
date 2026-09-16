import type { ComponentCategoryId } from "@/registry/schema"

export type { ComponentCategoryId } from "@/registry/schema"

/** Extends ComponentCategoryId with the "all" sentinel used by filter/grid UI */
export type ComponentCategoryIdWithAll = "all" | ComponentCategoryId

export interface ComponentCategory {
  id: ComponentCategoryIdWithAll
  label: string
  count?: number
}

/** Schematic types that are currently implemented in schematics/index.tsx */
export type SchematicType =
  | "accordion"
  | "alert"
  | "alert-dialog"
  | "autocomplete"
  | "avatar"
  | "badge"
  | "breadcrumb"
  | "button"
  | "calendar"
  | "not-found"
  | "activity-feed"
  | "banner"
  | "benefits"
  | "blog-listings"
  | "careers"
  | "chat"
  | "command"
  | "checkbox"
  | "dialog"
  | "dropdown"
  | "hover-card"
  | "input"
  | "tabs"
  | "toast"
  | "tooltip"
  | "skeleton"
  | "select"
  | "card"
  | "animated-glow-card"
  | "unboxing-bucket"
  | "separator"
  | "code-block"

export interface ComponentItem {
  id: string
  name: string
  slug: string
  category: ComponentCategoryId
  description: string
  count?: number
  schematicType: SchematicType
  badge?: string
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
  code: string
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
