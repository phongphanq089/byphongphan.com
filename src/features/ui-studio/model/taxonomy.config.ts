import type { LucideIcon } from "lucide-react"
import {
  Blocks,
  Box,
  Image as ImageIcon,
  Layers3,
  LineChart,
  Mail,
  Webhook,
} from "lucide-react"

import type { StudioCollectionId } from "./types"

/**
 * Static taxonomy: display order + labels. Counts are injected at runtime by
 * the adapter (never hardcoded here) — items with 0 entries stay hidden.
 */
export const STUDIO_TAXONOMY: {
  id: Exclude<StudioCollectionId, "all">
  label: string
  icon: LucideIcon
}[] = [
  { id: "base", label: "Base", icon: Box },
  { id: "blocks", label: "Blocks", icon: Blocks },
  { id: "hooks", label: "Hooks", icon: Webhook },
  { id: "charts", label: "Charts", icon: LineChart },
  { id: "og-images", label: "OG Images", icon: ImageIcon },
  { id: "emails", label: "Emails", icon: Mail },
]

export const STUDIO_ALL_COLLECTION = {
  id: "all" as const,
  label: "All Items",
  icon: Layers3,
}
