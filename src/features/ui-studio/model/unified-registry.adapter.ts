import type { ComponentType } from "react"

import { COMPONENT_DEMOS, HOOK_DEMOS } from "@/registry/demos"
import { REGISTRY_BLOCKS } from "@/registry/registry-blocks"
import { REGISTRY_COMPONENTS } from "@/registry/registry-components"
import { REGISTRY_HOOKS } from "@/registry/registry-hooks"
import type { RegistryItem } from "@/registry/schema"
import { COMPONENT_VARIANTS } from "@/registry/variants"
import {
  BLOCK_CATEGORIES,
  COMPONENT_CATEGORIES,
  HOOK_CATEGORIES,
  siteConfig,
} from "@/shared/config"

import { STUDIO_TAXONOMY } from "./taxonomy.config"
import type {
  StudioCollectionId,
  StudioItem,
  StudioRenderMode,
  StudioVariant,
} from "./types"

export interface StudioSourceFile {
  path: string
  name: string
  code: string
}

export interface StudioItemRecord {
  item: StudioItem
  /** Schematic wireframe component from the registry (catalog thumbnail). */
  schematic?: ComponentType
  /** Raw registry item kept for source resolution + CLI target. */
  source: RegistryItem
}

/**
 * Raw sources for every registry file (components / hooks / blocks), keyed by
 * path relative to `src/registry/` (e.g. "animated/line-nav.tsx").
 * Read-only: the studio never mutates registry files or MDX content.
 */
const rawRegistryModules = import.meta.glob<string>(
  "../../../registry/**/*.{ts,tsx,css}",
  { query: "?raw", import: "default", eager: true }
)

const RAW_SOURCES_BY_PATH = new Map<string, string>()
for (const [filePath, code] of Object.entries(rawRegistryModules)) {
  const marker = filePath.indexOf("/registry/")
  if (marker === -1) continue
  const relative = filePath.slice(marker + "/registry/".length)
  RAW_SOURCES_BY_PATH.set(relative, code)
}

function buildVariants(item: RegistryItem): StudioVariant[] | undefined {
  const variants = COMPONENT_VARIANTS[item.name]
  if (!variants?.length) return undefined
  return variants.map((variant) => ({
    id: variant.id,
    title: variant.title,
    description: variant.description,
    component: variant.component,
  }))
}

function resolveRenderMode(
  collection: Exclude<StudioCollectionId, "all">,
  item: RegistryItem
): StudioRenderMode {
  if (collection === "hooks") {
    return HOOK_DEMOS[item.name] ? "live" : "hook-code"
  }
  if (collection === "blocks") return "live"
  if (COMPONENT_DEMOS[item.name]) return "live"
  if (item.schematic) return "schematic"
  return "schematic"
}

function mapItem(
  item: RegistryItem,
  collection: Exclude<StudioCollectionId, "all">
): StudioItemRecord {
  const id = `${collection === "base" ? "comp" : collection === "blocks" ? "block" : "hook"}-${item.name}`
  return {
    item: {
      id,
      slug: item.name,
      title: item.title,
      description: item.description,
      collection,
      renderMode: resolveRenderMode(collection, item),
      categoryName: item.category,
      isNew: item.isNew,
      isUpdated: item.isUpdated,
      variants: buildVariants(item),
      dependencies: item.dependencies,
    },
    schematic: item.schematic,
    source: item,
  }
}

const RECORDS: StudioItemRecord[] = [
  ...REGISTRY_COMPONENTS.filter((item) => item.type !== "registry:hook").map(
    (item) => mapItem(item, "base")
  ),
  ...REGISTRY_BLOCKS.map((item) => mapItem(item, "blocks")),
  ...REGISTRY_HOOKS.filter((item) => item.type === "registry:hook").map(
    (item) => mapItem(item, "hooks")
  ),
]

const RECORDS_BY_ID = new Map(RECORDS.map((record) => [record.item.id, record]))
const RECORDS_BY_SLUG = new Map(
  RECORDS.map((record) => [record.item.slug, record])
)

export const STUDIO_RECORDS = RECORDS

export function getRecordByItem(itemId: string | undefined | null) {
  if (!itemId) return undefined
  return RECORDS_BY_ID.get(itemId) ?? RECORDS_BY_SLUG.get(itemId)
}

/** Live demo component for a base item, if one exists. */
export function getLiveDemo(item: StudioItem): ComponentType | undefined {
  if (item.collection === "hooks") return HOOK_DEMOS[item.slug]
  return COMPONENT_DEMOS[item.slug]
}

export function getStudioSourceFiles(item: StudioItem): StudioSourceFile[] {
  const record = RECORDS_BY_ID.get(item.id)
  if (!record) return []

  return record.source.files.map((file) => ({
    path: file.path,
    name: file.path.split("/").pop() ?? file.path,
    code:
      RAW_SOURCES_BY_PATH.get(file.path) ??
      `// Source for "${file.path}" is not available in the registry.\n`,
  }))
}

/** Look up a raw source file from the workspace glob, keyed relative to `src/registry/`. */
export function getRawRegistrySource(path: string): string | undefined {
  return RAW_SOURCES_BY_PATH.get(path)
}

export function getStudioCliCommand(item: StudioItem): string {
  return `npx shadcn@latest add ${siteConfig.url}/r/${item.slug}.json`
}

/** Canonical href for a studio item's detail page. */
export function getStudioItemHref(item: StudioItem): string {
  return `/ui/${item.categoryName ?? item.collection}/${item.slug}`
}

/** Previous/next items in the canonical studio listing order. */
export function getStudioAdjacentItems(item: StudioItem): {
  prev?: StudioItem
  next?: StudioItem
} {
  const index = RECORDS.findIndex((record) => record.item.id === item.id)
  if (index === -1) return {}
  return {
    prev: index > 0 ? RECORDS[index - 1].item : undefined,
    next: index < RECORDS.length - 1 ? RECORDS[index + 1].item : undefined,
  }
}

export type StudioResolvedSegment =
  | {
      kind: "collection"
      id: Exclude<StudioCollectionId, "all">
      label: string
    }
  | { kind: "category"; id: string; label: string }

const COLLECTION_IDS = new Set(
  STUDIO_TAXONOMY.map((entry) => entry.id)
) as Set<string>

const CATEGORY_LABELS = new Map<string, string>()
for (const category of [
  ...COMPONENT_CATEGORIES,
  ...BLOCK_CATEGORIES,
  ...HOOK_CATEGORIES,
]) {
  CATEGORY_LABELS.set(category.id, category.label)
}

const RECORDS_BY_CATEGORY = new Map<string, StudioItemRecord[]>()
for (const record of RECORDS) {
  const key = record.item.categoryName
  if (!key) continue
  const list = RECORDS_BY_CATEGORY.get(key) ?? []
  list.push(record)
  RECORDS_BY_CATEGORY.set(key, list)
}

/**
 * Pure-path segment resolution for /ui/$segment:
 * collection ids (base, blocks, hooks, ...) win, then any category id from the
 * three registries (interactive, marketing, browser, ...). Returns null for
 * unknown segments so routes can throw notFound().
 */
export function resolveStudioSegment(
  segment: string
): StudioResolvedSegment | null {
  const collection = STUDIO_TAXONOMY.find((entry) => entry.id === segment)
  if (collection) {
    return { kind: "collection", id: collection.id, label: collection.label }
  }
  const categoryLabel = CATEGORY_LABELS.get(segment)
  if (categoryLabel) {
    return { kind: "category", id: segment, label: categoryLabel }
  }
  return null
}

/**
 * Detail resolution: collection match first, then category match.
 * Returns undefined for unknown (segment, slug) pairs.
 */
export function resolveStudioItem(
  segment: string,
  slug: string
): StudioItemRecord | undefined {
  if (COLLECTION_IDS.has(segment)) {
    const byCollection = RECORDS.find(
      (record) =>
        record.item.collection === segment && record.item.slug === slug
    )
    if (byCollection) return byCollection
  }
  return RECORDS_BY_CATEGORY.get(segment)?.find(
    (record) => record.item.slug === slug
  )
}

export function getStudioSegmentLabel(
  segment: string,
  fallback: string
): string {
  return (
    STUDIO_TAXONOMY.find((entry) => entry.id === segment)?.label ??
    CATEGORY_LABELS.get(segment) ??
    fallback
  )
}
