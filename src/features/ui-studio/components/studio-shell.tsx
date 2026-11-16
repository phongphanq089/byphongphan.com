import { Outlet, useNavigate, useParams } from "@tanstack/react-router"
import { play } from "cuelume"
import { useMemo } from "react"

import { useKeyboardShortcuts } from "@/shared/hooks/use-keyboard-shortcuts"
import { cn } from "@/shared/lib/utils"

import { StudioLayoutProvider } from "../hooks/studio-layout-context"
import { useStudioKeyboard } from "../hooks/use-studio-keyboard"
import { useStudioPanelResize } from "../hooks/use-studio-panel-resize"
import { useStudioState } from "../hooks/use-studio-state"
import type { StudioControlValue, StudioItem } from "../model/types"
import {
  getStudioAdjacentItems,
  getStudioItemHref,
  resolveStudioItem,
} from "../model/unified-registry.adapter"
import { StudioDock } from "./studio-dock"
import { StudioHeader } from "./studio-header"
import { StudioResizeHandle } from "./studio-resize-handle"
import { StudioRightPanel } from "./studio-right-panel"
import { StudioSidebar } from "./studio-sidebar"

const noopToggleDocs = () => {}

/**
 * Modern inset floating studio shell (`/ui`).
 * The stage is a rounded "island" frame inset from the viewport edges; the
 * docs/code panel docks as a second column inside the desk (never floating)
 * while the sidebar remains a full-screen modal drawer portaled to body
 * (z-50, above the header).
 */
export function StudioShell() {
  const rawParams = useParams({ strict: false }) as {
    collection?: string
    slug?: string
  }
  const segment =
    typeof rawParams.collection === "string" ? rawParams.collection : null
  const slug = typeof rawParams.slug === "string" ? rawParams.slug : null

  const record = segment && slug ? resolveStudioItem(segment, slug) : undefined
  const activeItem = record?.item ?? null
  const activeItemId = activeItem?.id ?? null
  // Blocks ship without MDX docs — Docs panel and F shortcut stay inert
  const docsAvailable =
    activeItem !== null && activeItem.collection !== "blocks"

  const state = useStudioState({ activeItemId })
  const navigate = useNavigate()

  const onEscape = () => {
    // The modal drawer consumes Escape natively — don't also navigate away
    if (state.isSidebarOpen) {
      state.setSidebarOpen(false)
      return
    }
    if (state.panel !== "closed") {
      state.setPanel("closed")
      return
    }
    if (activeItemId) {
      if (segment) {
        void navigate({
          to: "/ui/$collection",
          params: { collection: segment },
        })
        return
      }
      void navigate({ to: "/ui" })
    }
  }

  useStudioKeyboard({
    toggleSidebar: state.toggleSidebar,
    toggleDocs: docsAvailable ? state.toggleDocs : noopToggleDocs,
    toggleCode: state.toggleCode,
    onEscape,
  })

  // Left/right arrows jump between studio items (detail pages only).
  const { prev, next } = useMemo(
    () =>
      activeItem
        ? getStudioAdjacentItems(activeItem)
        : { prev: undefined, next: undefined },
    [activeItem]
  )
  const goAdjacent = (
    target: StudioItem | undefined,
    direction: "back" | "forward"
  ) => {
    if (!target) return
    play("attention", { direction, emphasis: "subtle" })
    void navigate({ href: getStudioItemHref(target) })
  }
  useKeyboardShortcuts("left", () => goAdjacent(prev, "back"), {
    enabled: Boolean(prev),
    preventDefault: true,
  })
  useKeyboardShortcuts("right", () => goAdjacent(next, "forward"), {
    enabled: Boolean(next),
    preventDefault: true,
  })

  const activeVariantId =
    state.variantId ?? activeItem?.variants?.[0]?.id ?? undefined

  const closePanel = () => state.setPanel("closed")
  const setCustomizerValue = (key: string, value: StudioControlValue) =>
    state.setCustomizerValue(key, value)

  // A docs panel cannot exist for blocks — degrade gracefully to closed
  const viewPanel =
    state.panel === "docs" && !docsAvailable ? "closed" : state.panel

  const layoutValue = {
    segment,
    record: record ?? null,
    activeItem,
    activeVariantId,
    isSidebarOpen: state.isSidebarOpen,
    setSidebarOpen: state.setSidebarOpen,
    toggleSidebar: state.toggleSidebar,
    panel: viewPanel,
    setPanel: state.setPanel,
    toggleDocs: docsAvailable ? state.toggleDocs : noopToggleDocs,
    toggleCode: state.toggleCode,
    closePanel,
    variantId: state.variantId,
    setVariantId: state.setVariantId,
    customizerValues: state.customizerValues,
    setCustomizerValue,
    resetCustomizer: state.resetCustomizer,
  }

  const panelOpen = viewPanel !== "closed" && Boolean(activeItem)
  const { panelWidth, isDragging, handlePointerDown, resetWidth } =
    useStudioPanelResize()

  return (
    <StudioLayoutProvider value={layoutValue}>
      {/* Viewport: padded desk around the island + docked panel */}
      <div className="relative h-dvh w-screen overflow-hidden bg-muted/40 p-2 sm:p-3.5 dark:bg-black">
        <div className="flex h-full w-full gap-2 sm:gap-3.5">
          {/* Inset island frame */}
          <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-black/10 bg-background shadow-xs sm:rounded-3xl dark:border-white/10">
            <StudioHeader />

            {/* Column 2 — Outlet (catalog or detail stage) */}
            <section
              aria-label="Studio stage"
              className="relative flex min-h-0 flex-1 flex-col"
            >
              <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                <Outlet />
                <StudioDock item={activeItem} />
              </div>
            </section>
          </div>

          {/* Docked right panel — width is the persisted user preference;
              drag the divider handle to resize. Always mounted for smooth
              transitions; full-screen overlay on mobile; inert when closed. */}
          {panelOpen ? (
            <StudioResizeHandle
              panelWidth={panelWidth}
              isDragging={isDragging}
              onPointerDown={handlePointerDown}
              onReset={resetWidth}
            />
          ) : null}

          <aside
            aria-label="Item details"
            inert={!panelOpen}
            style={
              {
                "--studio-panel-width": `${panelWidth}px`,
              } as React.CSSProperties
            }
            className={cn(
              "h-full shrink-0 overflow-hidden transition-[width,opacity] duration-300 ease-out",
              isDragging && "transition-none",
              "max-sm:absolute max-sm:inset-2 max-sm:z-30",
              panelOpen
                ? "opacity-100 max-sm:w-auto sm:w-[var(--studio-panel-width)]"
                : "pointer-events-none w-0 opacity-0 max-sm:w-0"
            )}
          >
            <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-background shadow-2xl max-sm:w-full sm:w-[var(--studio-panel-width)] sm:rounded-3xl">
              {activeItem ? (
                <StudioRightPanel
                  item={activeItem}
                  panel={viewPanel === "code" ? "code" : "docs"}
                  onPanelChange={(panel) => state.setPanel(panel ?? "closed")}
                  activeVariantId={activeVariantId}
                  onSelectVariant={state.setVariantId}
                />
              ) : null}
            </div>
          </aside>
        </div>

        {/* Full-screen modal drawer portaled to body (z-50, above the header) */}
        <StudioSidebar
          activeSegment={segment}
          isOpen={state.isSidebarOpen}
          onOpenChange={state.setSidebarOpen}
          activeSlug={slug}
        />
      </div>
    </StudioLayoutProvider>
  )
}
