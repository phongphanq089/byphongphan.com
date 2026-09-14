export type ComponentCategoryId =
  "all" | "primitives" | "animations" | "foundations"

export interface ComponentCategory {
  id: ComponentCategoryId
  label: string
  count?: number
}

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
