import { Outlet, useNavigate, useParams } from "@tanstack/react-router"
import { play } from "cuelume"
import { useEffect, useMemo } from "react"

import { useMediaQuery } from "@/registry/hooks/use-media-query"
import { useKeyboardShortcuts } from "@/shared/hooks/use-keyboard-shortcuts"
import { cn } from "@/shared/lib/utils"

import { useStudioKeyboard } from "../hooks/use-studio-keyboard"
import { useStudioPanelResize } from "../hooks/use-studio-panel-resize"
import type { StudioItem } from "../model/types"
import {
  getStudioAdjacentItems,
  getStudioItemHref,
  resolveStudioItem,
} from "../model/unified-registry.adapter"
import { rehydrateStudioPrefs, useStudioStore } from "../store/studio-store"
import { StudioDock } from "./studio-dock"
import { StudioHeader } from "./studio-header"
import { StudioMobileDrawer } from "./studio-mobile-drawer"
import { StudioResizeHandle } from "./studio-resize-handle"
import { StudioRightPanel } from "./studio-right-panel"
import { StudioSidebar } from "./studio-sidebar"

/**
 * Modern inset floating studio shell (`/ui`).
 * Route-derived identity (segment/slug/item) comes from TanStack Router;
 * interactive client state (sidebar, panel, width, playground) lives in the
 * studio store — this component only owns layout composition and URL sync.
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
  const docsAvailable =
    activeItem !== null && activeItem.collection !== "blocks"

  const isDrawerMode = useMediaQuery("max-xl")
  const panel = useStudioStore((state) => state.panel)

  // Sync/reset playground state whenever the staged item changes
  const syncActiveItem = useStudioStore((state) => state.syncActiveItem)
  useEffect(() => {
    syncActiveItem(activeItemId, docsAvailable)
  }, [activeItemId, docsAvailable, syncActiveItem])

  // Hydrate persisted prefs once after mount (never read during SSR)
  useEffect(() => {
    void rehydrateStudioPrefs()
  }, [])

  const navigate = useNavigate()

  const onEscape = () => {
    // The modal drawer consumes Escape natively — don't also navigate away
    const state = useStudioStore.getState()
    if (state.sidebarOpen) {
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

  useStudioKeyboard({ onEscape })

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

  const panelOpen = !isDrawerMode && panel !== "closed" && Boolean(activeItem)
  const { panelWidth, isDragging, handlePointerDown, resetWidth } =
    useStudioPanelResize()

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-muted p-2 sm:p-3.5 dark:bg-accent/70">
      <div
        className={cn(
          "flex h-full w-full bg-transparent transition-all duration-300",
          panelOpen ? "gap-1.5 sm:gap-2" : "gap-0"
        )}
      >
        {/* Inset island frame */}
        <div className="relative flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-black/10 bg-background shadow-xs sm:rounded-3xl dark:border-white/10">
          <StudioHeader />

          {/* Column 2 — Outlet (catalog or detail stage) */}
          <section
            aria-label="Studio stage"
            className="relative flex h-full min-h-0 flex-1 flex-col"
          >
            <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
              <Outlet />
              {activeItem ? <StudioDock item={activeItem} /> : null}
            </div>
          </section>
        </div>

        {/* Docked right panel (>= xl) — width from the studio store */}
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
            "hidden h-full shrink-0 overflow-hidden rounded-2xl transition-[width,opacity] duration-300 ease-out xl:block",
            isDragging && "transition-none",
            panelOpen
              ? "opacity-100 xl:w-[var(--studio-panel-width)]"
              : "pointer-events-none w-0 opacity-0"
          )}
        >
          <div className="flex h-full w-[var(--studio-panel-width)] flex-col overflow-hidden rounded-2xl border border-border/70 bg-background shadow-2xl xl:rounded-3xl">
            {activeItem ? <StudioRightPanel item={activeItem} /> : null}
          </div>
        </aside>
      </div>

      {/* Drawer mode: bottom nested drawer for screens below xl (< 1280px) */}
      {isDrawerMode && activeItem ? (
        <StudioMobileDrawer item={activeItem} />
      ) : null}

      {/* Full-screen modal drawer portaled to body (z-50, above the header) */}
      <StudioSidebar activeSegment={segment} activeSlug={slug} />
    </div>
  )
}
