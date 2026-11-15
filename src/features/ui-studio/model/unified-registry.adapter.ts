import type { ComponentType } from "react"

import { COMPONENT_DEMOS,HOOK_DEMOS } from "@/registry/demos"
import { REGISTRY_BLOCKS } from "@/registry/registry-blocks"
import { REGISTRY_COMPONENTS } from "@/registry/registry-components"
import { REGISTRY_HOOKS } from "@/registry/registry-hooks"
import type { RegistryItem } from "@/registry/schema"
import { COMPONENT_VARIANTS } from "@/registry/variants"
import { siteConfig } from "@/shared/config"

import { STUDIO_ALL_COLLECTION, STUDIO_TAXONOMY } from "./taxonomy.config"
import type {
  StudioCollectionId,
  StudioCollectionMeta,
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

export function getItemsByCollection(
  collection: StudioCollectionId
): StudioItem[] {
  if (collection === "all") {
    return RECORDS.map((record) => record.item)
  }
  return RECORDS.filter((record) => record.item.collection === collection).map(
    (record) => record.item
  )
}

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

export function getStudioCliCommand(item: StudioItem): string {
  return `npx shadcn@latest add ${siteConfig.registry.namespace}/${item.slug}`
}

export function getCollectionCount(collection: StudioCollectionId): number {
  if (collection === "all") return RECORDS.length
  return RECORDS.filter((record) => record.item.collection === collection)
    .length
}

export function getStudioCollections(): StudioCollectionMeta[] {
  const counts = new Map<StudioCollectionId, number>()
  for (const record of RECORDS) {
    counts.set(
      record.item.collection,
      (counts.get(record.item.collection) ?? 0) + 1
    )
  }
  const all: StudioCollectionMeta = {
    ...STUDIO_ALL_COLLECTION,
    count: RECORDS.length,
  }
  const rest = STUDIO_TAXONOMY.filter(
    (entry) => (counts.get(entry.id) ?? 0) > 0
  ).map((entry) => ({
    id: entry.id,
    label: entry.label,
    count: counts.get(entry.id) ?? 0,
  }))
  return [all, ...rest]
}
