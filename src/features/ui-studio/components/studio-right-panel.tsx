import type { StudioItem } from "../model/types"
import { StudioCodeOverlay } from "./studio-code-overlay"
import { StudioDocsView } from "./studio-docs-view"

interface StudioRightPanelProps {
  item: StudioItem
  panel: "docs" | "code"
  /** `null` closes the docked panel entirely. */
  onPanelChange: (panel: "docs" | "code" | null) => void
  activeVariantId?: string
  onSelectVariant: (variantId: string | null) => void
}

/**
 * Docked right column for documentation and source code. Renders the docs
 * view by default; the code overlay replaces it when `panel === "code"`.
 * Closing either view collapses the whole dock (shell decides width).
 */
export function StudioRightPanel({
  item,
  panel,
  onPanelChange,
  activeVariantId,
  onSelectVariant,
}: StudioRightPanelProps) {
  if (panel === "code") {
    // Blocks ship without docs — no back affordance
    const hasDocs = item.collection !== "blocks"
    return (
      <StudioCodeOverlay
        item={item}
        onBack={hasDocs ? () => onPanelChange("docs") : undefined}
        activeVariantId={activeVariantId}
        onSelectVariant={onSelectVariant}
      />
    )
  }

  return (
    <StudioDocsView
      item={item}
      onClose={() => onPanelChange(null)}
      activeVariantId={activeVariantId}
      onSelectVariant={onSelectVariant}
    />
  )
}
