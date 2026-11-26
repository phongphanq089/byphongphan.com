import type { StudioCollectionId } from "./types"

/**
 * Static taxonomy: the collection families the studio groups registry items
 * into. Ids match what the URL segment resolver understands.
 */
export const STUDIO_TAXONOMY: {
  id: Exclude<StudioCollectionId, "all">
  label: string
}[] = [
  { id: "base", label: "Base" },
  { id: "blocks", label: "Blocks" },
  { id: "hooks", label: "Hooks" },
  { id: "charts", label: "Charts" },
  { id: "og-images", label: "OG Images" },
  { id: "emails", label: "Emails" },
]
