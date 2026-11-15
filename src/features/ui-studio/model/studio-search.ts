/**
 * URL search-param contract for `/ui`.
 *
 *   /ui                                      → catalog, all collections
 *   /ui?collection=blocks                    → catalog filtered to blocks
 *   /ui?item=comp-drawer&variant=drawer-inset
 *   /ui?item=comp-banner-filled&panel=code   → detail + code tab open
 *
 * `use-studio-url-sync.ts` re-exports this validator for the route file so the
 * raw search record is always validated instead of trusted.
 */
export type StudioPanel = "docs" | "code"
export type StudioCollectionParam =
  "all" | "base" | "blocks" | "charts" | "og-images" | "emails" | "hooks"

export interface StudioSearch {
  collection: StudioCollectionParam
  item?: string
  variant?: string
  panel?: StudioPanel
}

const COLLECTIONS = new Set<StudioCollectionParam>([
  "all",
  "base",
  "blocks",
  "charts",
  "og-images",
  "emails",
  "hooks",
])

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined
}

export const DEFAULT_STUDIO_COLLECTION: StudioCollectionParam = "all"

/**
 * Defensive parser for the raw search record coming from the router.
 * Anything unrecognized falls back to safe defaults instead of crashing.
 */
export function parseStudioSearch(
  raw: Record<string, unknown> | undefined | null
): StudioSearch {
  const source = raw ?? {}
  const collectionParam = asString(source.collection)
  const collection = COLLECTIONS.has(collectionParam as StudioCollectionParam)
    ? (collectionParam as StudioCollectionParam)
    : DEFAULT_STUDIO_COLLECTION

  const panelParam = asString(source.panel)
  const panel: StudioPanel | undefined =
    panelParam === "docs" || panelParam === "code" ? panelParam : undefined

  return {
    collection,
    item: asString(source.item),
    variant: asString(source.variant),
    panel,
  }
}

export function studioSearchToRaw(
  search: StudioSearch
): Record<string, string> {
  const raw: Record<string, string> = {}
  if (search.collection !== DEFAULT_STUDIO_COLLECTION) {
    raw.collection = search.collection
  }
  if (search.item) raw.item = search.item
  if (search.variant) raw.variant = search.variant
  if (search.panel) raw.panel = search.panel
  return raw
}
