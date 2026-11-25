import { Drawer, DrawerPopup } from "@/registry/ui/drawer"

import type { StudioItem } from "../model/types"
import { useStudioStore } from "../store/studio-store"
import { StudioCodeOverlay } from "./studio-code-overlay"
import { StudioDocsView } from "./studio-docs-view"

interface StudioMobileDrawerProps {
  item: StudioItem | null
}

/**
 * Mobile Drawer with Base UI Native Nested Drawers:
 * - When Docs is open, the outer Drawer renders StudioDocsView.
 * - When Code is open and the item has docs, the outer Drawer remains open
 *   and scales back (3D stack) while the nested inner Drawer renders Code.
 * - Swiping down or clicking Back on the Code drawer returns to Docs.
 * - Swiping down on Docs closes everything.
 * - Blocks (no docs) directly open a single Code drawer.
 */
export function StudioMobileDrawer({ item }: StudioMobileDrawerProps) {
  const panel = useStudioStore((state) => state.panel)
  const setPanel = useStudioStore((state) => state.setPanel)
  const setActiveVariantId = useStudioStore((state) => state.setActiveVariantId)
  const storedVariantId = useStudioStore((state) => state.activeVariantId)

  if (!item) return null

  const hasDocs = item.collection !== "blocks"
  const isOuterOpen = panel !== "closed"
  const isCodeOpen = panel === "code"
  const activeVariantId = storedVariantId ?? item.variants?.[0]?.id

  if (!hasDocs) {
    // Blocks ship without docs — single Code drawer
    return (
      <Drawer
        open={isCodeOpen}
        onOpenChange={(open) => {
          if (!open) setPanel("closed")
        }}
        position="bottom"
      >
        <DrawerPopup
          showBar
          viewportClassName="xl:hidden"
          className="flex h-[88dvh] max-h-[88dvh] min-h-0 flex-col overflow-hidden bg-background text-foreground"
        >
          <StudioCodeOverlay
            item={item}
            onClose={() => setPanel("closed")}
            activeVariantId={activeVariantId}
            onSelectVariant={setActiveVariantId}
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
        if (!open) setPanel("closed")
      }}
      position="bottom"
    >
      <DrawerPopup
        showBar
        viewportClassName="xl:hidden"
        className="flex h-[90dvh] max-h-[90dvh] min-h-0 flex-col overflow-hidden bg-background text-foreground"
      >
        {/* Parent content: Docs view */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <StudioDocsView
            item={item}
            showHeaderBar
            onClose={() => setPanel("closed")}
            activeVariantId={activeVariantId}
            onSelectVariant={setActiveVariantId}
          />
        </div>

        {/* Nested child drawer: Source Code */}
        <Drawer
          open={isCodeOpen}
          onOpenChange={(open) => {
            if (!open) {
              // Dismissing the nested code drawer returns to the docs view underneath
              setPanel("docs")
            }
          }}
          position="bottom"
        >
          <DrawerPopup
            showBar
            hasBackdrop={false}
            viewportClassName="xl:hidden"
            className="flex h-[88dvh] max-h-[88dvh] min-h-0 flex-col overflow-hidden bg-background text-foreground shadow-2xl"
          >
            <StudioCodeOverlay
              item={item}
              onBack={() => setPanel("docs")}
              onClose={() => setPanel("closed")}
              activeVariantId={activeVariantId}
              onSelectVariant={setActiveVariantId}
            />
          </DrawerPopup>
        </Drawer>
      </DrawerPopup>
    </Drawer>
  )
}
