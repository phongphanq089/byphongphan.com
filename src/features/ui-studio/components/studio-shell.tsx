import { Outlet, useNavigate, useParams } from "@tanstack/react-router"
import { play } from "cuelume"
import { useEffect, useMemo, useRef } from "react"

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
import { StudioVariantBar } from "./studio-dock"
import { StudioHeader } from "./studio-header"
import { StudioMobileDrawer } from "./studio-mobile-drawer"
import { StudioResizeHandle } from "./studio-resize-handle"
import { StudioRightPanel } from "./studio-right-panel"
import { StudioSidebar } from "./studio-sidebar"

/**
 * Minimalist Borderless Studio Shell (`/ui`):
 * - Fixed floating header (no border-b separator)
 * - Always-push sidebar (`StudioSidebar`): expands smoothly beside stage on desktop,
 *   pushes live stage right on mobile while keeping an interactive X-style edge peek
 *   that users can tap or swipe back/forth
 * - Rounded elevated stage island with bottom variant pill shown ONLY when variants exist
 * - Borderless floating Docs column (or contained Code card when Source Code is active)
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
  const isCompactViewport = useMediaQuery("max-md")
  const sidebarOpen = useStudioStore((state) => state.sidebarOpen)
  const setSidebarOpen = useStudioStore((state) => state.setSidebarOpen)
  const panel = useStudioStore((state) => state.panel)
  const syncActiveItem = useStudioStore((state) => state.syncActiveItem)
  const touchStartXRef = useRef<number | null>(null)

  useEffect(() => {
    syncActiveItem(activeItemId, docsAvailable)
  }, [activeItemId, docsAvailable, syncActiveItem])

  useEffect(() => {
    void rehydrateStudioPrefs()
  }, [])

  const navigate = useNavigate()

  const onEscape = () => {
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

  // X-app style swipe gesture: swipe left on peeking stage to close, swipe right from left edge to open
  const handleStageTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0]?.clientX ?? null
  }
  const handleStageTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isCompactViewport || touchStartXRef.current === null) return
    const endX = e.changedTouches[0]?.clientX
    if (typeof endX !== "number") return
    const deltaX = endX - touchStartXRef.current
    const startX = touchStartXRef.current
    touchStartXRef.current = null

    if (sidebarOpen && deltaX < -42) {
      setSidebarOpen(false)
    } else if (!sidebarOpen && startX < 36 && deltaX > 48) {
      setSidebarOpen(true)
    }
  }

  const showMobilePeekOverlay = isCompactViewport && sidebarOpen

  return (
    <div className="relative h-dvh w-screen overflow-hidden bg-background text-foreground">
      {/* Fixed, borderless floating top header */}
      <StudioHeader activeItem={activeItem} />

      {/* Horizontal Push Track: Sidebar pushes Stage + Right Panel */}
      <div className="flex h-full w-full overflow-hidden">
        <StudioSidebar activeSegment={segment} activeSlug={slug} />

        {/* Stage + Right Panel container: full 100vw on mobile so sidebar pushes it right with X-style peek */}
        <div
          onTouchStart={handleStageTouchStart}
          onTouchEnd={handleStageTouchEnd}
          className={cn(
            "relative flex h-full min-h-0 w-screen shrink-0 p-2 transition-[padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-3 md:w-auto md:min-w-0 md:flex-1",
            panelOpen ? "gap-1.5 sm:gap-2" : "gap-0",
            sidebarOpen && "md:pl-0"
          )}
        >
          {/* Rounded elevated Stage Island */}
          <section
            aria-label="Studio stage"
            className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/40 bg-muted dark:bg-muted/65"
          >
            <div className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
              <Outlet />
              <StudioVariantBar item={activeItem} />
            </div>

            {/* X-style interactive tap-to-close overlay on the peeking stage edge on mobile */}
            {showMobilePeekOverlay ? (
              <button
                type="button"
                aria-label="Close sidebar and return to canvas"
                onClick={() => setSidebarOpen(false)}
                className="absolute inset-0 z-30 cursor-pointer bg-background/15 backdrop-blur-[1px] transition-opacity md:hidden"
              />
            ) : null}
          </section>

          {/* Resize Handle (>= xl) */}
          {panelOpen ? (
            <StudioResizeHandle
              panelWidth={panelWidth}
              isDragging={isDragging}
              onPointerDown={handlePointerDown}
              onReset={resetWidth}
            />
          ) : null}

          {/* Desktop Docked Right Column (>= xl): borderless for Docs, contained card for Code */}
          <aside
            aria-label="Item details"
            inert={!panelOpen}
            style={
              {
                "--studio-panel-width": `${panelWidth}px`,
              } as React.CSSProperties
            }
            className={cn(
              "hidden h-full shrink-0 overflow-hidden transition-[width,opacity] duration-300 ease-out xl:block",
              isDragging && "transition-none",
              panelOpen
                ? "opacity-100 xl:w-[var(--studio-panel-width)]"
                : "pointer-events-none w-0 opacity-0"
            )}
          >
            <div className="flex h-full w-[var(--studio-panel-width)] flex-col overflow-hidden">
              {activeItem ? <StudioRightPanel item={activeItem} /> : null}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile / Tablet (< xl): bottom drawer for Docs & Source Code */}
      {isDrawerMode && activeItem ? (
        <StudioMobileDrawer item={activeItem} />
      ) : null}
    </div>
  )
}
