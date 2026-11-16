import type { ComponentType } from "react"

/** Top-level collections exposed by the studio (existing registries only). */
export type StudioCollectionId =
  "all" | "base" | "blocks" | "charts" | "og-images" | "emails" | "hooks"

export type StudioRenderMode = "live" | "schematic" | "hook-code"

export type StudioControlValue = string | number | boolean

export interface StudioControlSchema {
  key: string
  label: string
  type: "slider" | "boolean" | "select" | "color" | "color-palette" | "text"
  default: StudioControlValue
  min?: number
  max?: number
  step?: number
  unit?: string
  options?: string[]
}

export interface StudioVariantSourceFile {
  path: string
  name: string
}

export interface StudioVariant {
  id: string
  title: string
  description?: string
  component?: ComponentType
  sourceFiles?: StudioVariantSourceFile[]
}

export interface StudioItem {
  /** e.g. "comp-drawer", "block-login-01", "hook-use-debounce" */
  id: string
  /** e.g. "drawer" */
  slug: string
  title: string
  description: string
  collection: Exclude<StudioCollectionId, "all">
  renderMode: StudioRenderMode
  categoryName?: string
  isNew?: boolean
  isUpdated?: boolean
  variants?: StudioVariant[]
  controls?: StudioControlSchema[]
  dependencies?: string[]
}
