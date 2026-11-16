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
 * Desktop right-hand docked column. Docs renders as the base layer; when
 * `panel === "code"` the Source Code drawer slides in on top of it with a
 * grab handle you can drag downward to dismiss (native-feeling interaction).
 */
export function StudioRightPanel({
  item,
  panel,
  onPanelChange,
  activeVariantId,
  onSelectVariant,
}: StudioRightPanelProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
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
