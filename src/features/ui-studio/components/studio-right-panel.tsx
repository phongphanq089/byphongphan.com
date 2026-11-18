import { AnimatePresence } from "motion/react"

import type { StudioItem } from "../model/types"
import { useStudioStore } from "../store/studio-store"
import { StudioCodeOverlay } from "./studio-code-overlay"
import { StudioDocsView } from "./studio-docs-view"

interface StudioRightPanelProps {
  item: StudioItem
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
export function StudioRightPanel({ item }: StudioRightPanelProps) {
  const panel = useStudioStore((state) => state.panel)
  const setPanel = useStudioStore((state) => state.setPanel)
  const setActiveVariantId = useStudioStore((state) => state.setActiveVariantId)
  const storedVariantId = useStudioStore((state) => state.activeVariantId)
  const activeVariantId = storedVariantId ?? item.variants?.[0]?.id

  const hasDocs = item.collection !== "blocks"
  const closePanel = () => setPanel("closed")

  if (!hasDocs) {
    if (panel !== "code") return null
    return (
      <div className="relative h-full w-full overflow-hidden">
        <StudioCodeOverlay
          item={item}
          onClose={closePanel}
          activeVariantId={activeVariantId}
          onSelectVariant={setActiveVariantId}
        />
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <StudioDocsView
        item={item}
        onClose={closePanel}
        activeVariantId={activeVariantId}
        onSelectVariant={setActiveVariantId}
      />

      <AnimatePresence>
        {panel === "code" ? (
          <StudioCodeOverlay
            key="code-overlay"
            item={item}
            onBack={() => setPanel("docs")}
            onClose={closePanel}
            activeVariantId={activeVariantId}
            onSelectVariant={setActiveVariantId}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}
