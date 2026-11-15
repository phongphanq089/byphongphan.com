import { cn } from "@/shared/lib/utils"

import { useStudioKeyboard } from "../hooks/use-studio-keyboard"
import { useStudioState } from "../hooks/use-studio-state"
import type { StudioCollectionId, StudioItem } from "../model/types"
import { getStudioCollections } from "../model/unified-registry.adapter"
import { StudioCanvas } from "./studio-canvas"
import { StudioCatalogGrid } from "./studio-catalog-grid"
import { StudioDock } from "./studio-dock"
import { StudioHeader } from "./studio-header"
import { StudioRightPanel } from "./studio-right-panel"
import { StudioSidebar } from "./studio-sidebar"

const ALL_COLLECTION_LABEL = "All"

function collectionLabel(
  collections: ReturnType<typeof getStudioCollections>,
  id: StudioCollectionId
): string {
  return (
    collections.find((entry) => entry.id === id)?.label ?? ALL_COLLECTION_LABEL
  )
}

/**
 * Master–detail studio shell: sidebar (collections) · stage (catalog grid or
 * detail canvas) · right panel (docs / code). Full-height inside site chrome.
 */
export function StudioShell() {
  const state = useStudioState()
  const collections = getStudioCollections()

  const toggleDocs = () =>
    state.setPanel(state.panel === "docs" ? "closed" : "docs")
  const toggleCode = () =>
    state.setPanel(state.panel === "code" ? "closed" : "code")
  const closePanel = () => state.setPanel("closed")
  const onEscape = () => {
    if (state.panel !== "closed") {
      closePanel()
      return
    }
    state.selectItem(null)
  }

  useStudioKeyboard({
    toggleSidebar: state.toggleSidebar,
    toggleDocs,
    toggleCode,
    onEscape,
  })

  const activeItem: StudioItem | null = state.activeItem
  const label = collectionLabel(collections, state.collection)

  return (
    <div className="flex h-[calc(100dvh-3rem)] w-full overflow-hidden bg-background text-foreground">
      {/* Mobile backdrop for the sidebar overlay */}
      {state.isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          tabIndex={-1}
          onClick={state.toggleSidebar}
          className="fixed inset-0 z-20 cursor-default bg-black/40 md:hidden"
        />
      ) : null}

      {/* Column 1 — Sidebar */}
      <aside
        aria-label="Registry collections"
        className={cn(
          "absolute inset-y-0 left-0 z-30 h-full shrink-0 overflow-hidden border-r border-border/70 transition-[width,transform,opacity] duration-300 ease-out md:static md:z-auto",
          state.isSidebarOpen
            ? "w-60 translate-x-0 opacity-100"
            : "pointer-events-none w-0 -translate-x-full md:translate-x-0 md:opacity-0"
        )}
      >
        <StudioSidebar
          collections={collections}
          activeCollection={state.collection}
          onSelectCollection={state.selectCollection}
        />
      </aside>

      {/* Column 2 — Stage */}
      <section
        aria-label="Studio stage"
        className="relative flex h-full min-w-0 flex-1 flex-col"
      >
        <StudioHeader
          collectionLabel={label}
          itemTitle={activeItem?.title}
          panel={state.panel}
          isSidebarOpen={state.isSidebarOpen}
          onToggleSidebar={state.toggleSidebar}
          onToggleDocs={toggleDocs}
          onToggleCode={toggleCode}
        />

        <div className="relative flex min-h-0 flex-1 flex-col">
          {activeItem ? (
            <StudioCanvas
              item={activeItem}
              variantId={state.activeVariantId}
              onSelectVariant={state.selectVariant}
              customizerValues={state.customizerValues}
              onCustomizerChange={state.setCustomizerValue}
              onResetCustomizer={state.resetCustomizer}
            />
          ) : (
            <StudioCatalogGrid
              items={state.items}
              onSelectItem={state.selectItem}
            />
          )}

          <StudioDock item={activeItem} />
        </div>
      </section>

      {/* Column 3 — Right panel (sheet overlay below lg) */}
      <aside
        aria-label="Item details"
        className={cn(
          "fixed inset-y-0 right-0 z-30 h-full shrink-0 overflow-hidden border-l border-border/70 bg-background shadow-2xl transition-[width,opacity] duration-300 ease-out lg:static lg:z-auto lg:shadow-none",
          state.panel !== "closed" && activeItem
            ? "w-[380px] max-w-[92vw] opacity-100"
            : "pointer-events-none w-0 border-l-0 opacity-0"
        )}
      >
        {activeItem && state.panel !== "closed" ? (
          <StudioRightPanel
            item={activeItem}
            panel={state.panel}
            onPanelChange={(panel) => state.setPanel(panel ?? "closed")}
            activeVariantId={state.activeVariantId}
            onSelectVariant={state.selectVariant}
          />
        ) : null}
      </aside>
    </div>
  )
}
