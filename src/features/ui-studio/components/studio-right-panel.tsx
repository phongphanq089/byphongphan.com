import { AnimatePresence } from "motion/react"

import type { StudioItem } from "../model/types"
import { StudioCodeOverlay } from "./studio-code-overlay"
import { StudioDocsView } from "./studio-docs-view"

interface StudioRightPanelProps {
  item: StudioItem
  panel: "docs" | "code" | "closed"
  /** `null` closes the panel entirely. */
  onPanelChange: (panel: "docs" | "code" | null) => void
  activeVariantId?: string
  onSelectVariant: (variantId: string | null) => void
}

/**
 * Desktop right-hand docked column.
 *
 * Components/Hooks (MDX available): `StudioDocsView` fills the column as the
 * base layer; when `panel === "code"` `StudioCodeOverlay` slides in on top.
 *
 * Blocks (no MDX): the docs layer is never mounted — the code overlay is the
 * only content, and closing it collapses the panel completely.
 */
export function StudioRightPanel({
  item,
  panel,
  onPanelChange,
  activeVariantId,
  onSelectVariant,
}: StudioRightPanelProps) {
  const hasDocs = item.collection !== "blocks"

  if (!hasDocs) {
    if (panel !== "code") return null
    return (
      <div className="relative h-full w-full overflow-hidden">
        <StudioCodeOverlay
          item={item}
          onClose={() => onPanelChange(null)}
          activeVariantId={activeVariantId}
          onSelectVariant={onSelectVariant}
        />
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Base layer — docs for components & hooks */}
      <StudioDocsView
        item={item}
        onClose={() => onPanelChange(null)}
        activeVariantId={activeVariantId}
        onSelectVariant={onSelectVariant}
      />

      <AnimatePresence>
        {panel === "code" ? (
          <StudioCodeOverlay
            key="code-overlay"
            item={item}
            onBack={() => onPanelChange("docs")}
            onClose={() => onPanelChange(null)}
            activeVariantId={activeVariantId}
            onSelectVariant={onSelectVariant}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}
