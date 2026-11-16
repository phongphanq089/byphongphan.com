import { Drawer, DrawerPopup } from "@/registry/ui/drawer"

import type { StudioItem } from "../model/types"
import { StudioCodeOverlay } from "./studio-code-overlay"
import { StudioDocsView } from "./studio-docs-view"

interface StudioMobileDrawerProps {
  item: StudioItem | null
  panel: "docs" | "code" | "closed"
  onPanelChange: (panel: "docs" | "code" | null) => void
  activeVariantId?: string
  onSelectVariant: (variantId: string | null) => void
}

/**
 * Mobile Drawer with Base UI Native Nested Drawers:
 * - When Docs is open, the outer Drawer renders StudioDocsView.
 * - When Code is open and item has docs, the outer Drawer remains open and
 *   scales back (3D stack), while the nested inner Drawer renders StudioCodeOverlay.
 * - Swiping down or clicking Back on the Code drawer returns smoothly to Docs.
 * - Swiping down on Docs closes everything.
 * - Blocks (no docs) directly open a single Code drawer.
 */
export function StudioMobileDrawer({
  item,
  panel,
  onPanelChange,
  activeVariantId,
  onSelectVariant,
}: StudioMobileDrawerProps) {
  if (!item) return null

  const hasDocs = item.collection !== "blocks"
  const isOuterOpen = panel !== "closed"
  const isCodeOpen = panel === "code"

  if (!hasDocs) {
    // Blocks ship without docs — single Code drawer
    return (
      <Drawer
        open={isCodeOpen}
        onOpenChange={(open) => {
          if (!open) onPanelChange(null)
        }}
        position="bottom"
      >
        <DrawerPopup
          variant="straight"
          showBar
          viewportClassName="xl:hidden"
          className="flex h-[88dvh] max-h-[88dvh] min-h-0 flex-col overflow-hidden bg-background text-foreground"
        >
          <StudioCodeOverlay
            item={item}
            onClose={() => onPanelChange(null)}
            activeVariantId={activeVariantId}
            onSelectVariant={onSelectVariant}
          />
        </DrawerPopup>
      </Drawer>
    )
  }

  // Components & Hooks — Nested Drawer stack
  // Outer drawer is OPEN whenever Docs OR Code is active!
  return (
    <Drawer
      open={isOuterOpen}
      onOpenChange={(open) => {
        if (!open) onPanelChange(null)
      }}
      position="bottom"
    >
      <DrawerPopup
        variant="straight"
        showBar
        viewportClassName="xl:hidden"
        className="flex h-[90dvh] max-h-[90dvh] min-h-0 flex-col overflow-hidden bg-background text-foreground"
      >
        {/* Parent content: Docs view */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <StudioDocsView
            item={item}
            onClose={() => onPanelChange(null)}
            activeVariantId={activeVariantId}
            onSelectVariant={onSelectVariant}
          />
        </div>

        {/* Nested child drawer: Source Code */}
        <Drawer
          open={isCodeOpen}
          onOpenChange={(open) => {
            if (!open) {
              // Dismissing the nested code drawer returns to the docs view underneath
              onPanelChange("docs")
            }
          }}
          position="bottom"
        >
          <DrawerPopup
            variant="straight"
            showBar
            hasBackdrop={false}
            viewportClassName="xl:hidden"
            className="flex h-[88dvh] max-h-[88dvh] min-h-0 flex-col overflow-hidden bg-background text-foreground shadow-2xl"
          >
            <StudioCodeOverlay
              item={item}
              onBack={() => onPanelChange("docs")}
              onClose={() => onPanelChange(null)}
              activeVariantId={activeVariantId}
              onSelectVariant={onSelectVariant}
            />
          </DrawerPopup>
        </Drawer>
      </DrawerPopup>
    </Drawer>
  )
}
