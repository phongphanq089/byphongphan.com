import { useNavigate, useRouter } from "@tanstack/react-router"
import { Layers3, X } from "lucide-react"
import { useMemo } from "react"

import {
  LineNav,
  type LineNavGroup,
  type LineNavItem,
} from "@/registry/animated/line-nav"
import { Button } from "@/registry/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerHeader,
  DrawerPopup,
  DrawerTitle,
} from "@/registry/ui/drawer"
import { ScrollArea } from "@/registry/ui/scroll-area"

import { useStudioLayout } from "../hooks/studio-layout-context"
import { studioSidebarHandle } from "../hooks/studio-sidebar-handle"
import type { StudioItem } from "../model/types"
import {
  getStudioItemHref,
  STUDIO_RECORDS,
} from "../model/unified-registry.adapter"

interface StudioSidebarProps {
  /** Current route segment — null on `/ui` (all items). */
  activeSegment: string | null
  /** Current detail slug — undefined unless a detail route is active. */
  activeSlug?: string | null
  /** Whether the floating drawer is open. */
  isOpen: boolean
  /** Controlled open state callback from drawer gestures / backdrop / trigger. */
  onOpenChange?: (open: boolean) => void
}

const toNavItem = (item: StudioItem, index?: number): LineNavItem => ({
  title: (
    <span className="inline-flex items-center gap-1.5 font-sans">
      {typeof index === "number" ? (
        <span className="font-sans text-[10px] font-medium text-muted-foreground/70 tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
      ) : null}
      <span className="truncate">{item.title}</span>
    </span>
  ),
  href: getStudioItemHref(item),
  badge: item.isNew ? (
    <span
      aria-label="New"
      className="size-1.5 shrink-0 rounded-full bg-pp-primary shadow-[0_0_6px_var(--pp-primary-glow)]"
    />
  ) : undefined,
})

function CountBadge({ count }: { count: number }) {
  return (
    <span className="rounded-[4px] border border-pp-primary/30 bg-pp-primary/10 px-1.5 py-0.5 font-sans text-[10px] leading-none font-semibold text-pp-primary tabular-nums">
      {String(count).padStart(2, "0")}
    </span>
  )
}

function MajorGroupTitle({
  label,
  count,
  icon,
}: {
  label: string
  count: number
  icon?: React.ReactNode
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      {icon ?? null}
      <span className="font-sans text-[11px] font-bold tracking-tight text-foreground">
        {label}
      </span>
      <CountBadge count={count} />
    </span>
  )
}

/**
 * Modern Inset Floating Sidebar built using the project's official `@/registry/ui/drawer.tsx`.
 * Features:
 * - Controlled Base UI Drawer at layer z-50 with a dimming glass backdrop (modal)
 * - Detached trigger via `studioSidebarHandle` — the header `[|]` button is the DrawerTrigger
 * - Self-contained inset card: own `DrawerHeader` (logo + close), never covered by the page header
 * - Flat, stable hierarchy: `All Items` on top, then Blocks / Unique / Basic / Hooks
 *   — each with a count badge; items carry 2-digit indices, everything in `font-sans`
 * - Base UI `ScrollArea` scroll container with `scrollFade` for the 77+ items
 * - Strict typography: 100% `font-sans` (Mulish) — no `font-mono` anywhere
 * - Smooth native swipe dismiss + hardware-accelerated animations
 */
export function StudioSidebar({
  activeSegment,
  activeSlug,
  isOpen,
  onOpenChange,
}: StudioSidebarProps) {
  const { setSidebarOpen } = useStudioLayout()
  const navigate = useNavigate()
  const router = useRouter()

  const groups = useMemo<LineNavGroup[]>(() => {
    const blocks = STUDIO_RECORDS.filter(
      (r) => r.item.collection === "blocks"
    ).map((r) => r.item)

    const unique = STUDIO_RECORDS.filter(
      (r) =>
        r.item.collection === "base" && r.source.type === "registry:component"
    ).map((r) => r.item)

    const basic = STUDIO_RECORDS.filter(
      (r) => r.item.collection === "base" && r.source.type === "registry:ui"
    ).map((r) => r.item)

    const hooks = STUDIO_RECORDS.filter(
      (r) => r.item.collection === "hooks"
    ).map((r) => r.item)

    let itemIndex = 0
    const toIndexedNavItem = (item: StudioItem) => toNavItem(item, itemIndex++)

    return [
      {
        title: (
          <MajorGroupTitle
            icon={
              <Layers3
                className="size-3.5 text-pp-primary"
                aria-hidden="true"
              />
            }
            label="All Items"
            count={STUDIO_RECORDS.length}
          />
        ),
        href: "/ui",
        items: [],
      },
      {
        title: <MajorGroupTitle label="★ Blocks" count={blocks.length} />,
        href: "/ui/blocks",
        items: blocks.map(toIndexedNavItem),
      },
      {
        title: <MajorGroupTitle label="Unique" count={unique.length} />,
        href: "/ui/base",
        items: unique.map(toIndexedNavItem),
      },
      {
        title: <MajorGroupTitle label="Basic" count={basic.length} />,
        href: "/ui/base",
        items: basic.map(toIndexedNavItem),
      },
      {
        title: <MajorGroupTitle label="Hooks" count={hooks.length} />,
        href: "/ui/hooks",
        items: hooks.map(toIndexedNavItem),
      },
    ]
  }, [])

  const activeHref = activeSegment
    ? activeSlug
      ? `/ui/${activeSegment}/${activeSlug}`
      : `/ui/${activeSegment}`
    : "/ui"

  // Modal drawer semantics: pressing the backdrop or Escape closes the drawer.
  const handleOpenChange = onOpenChange ?? setSidebarOpen

  const handleNavigate = (
    item: LineNavItem | LineNavGroup,
    event?: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!("href" in item) || !item.href) return
    const href = item.href

    if (event) {
      // Preserve browser-native new tab/window gestures
      const isModifiedClick =
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      if (isModifiedClick) return
      // Plain click: SPA navigation instead of a full page reload
      event.preventDefault()
    }

    // Modal drawer: picking a component dismisses the drawer
    setSidebarOpen(false)

    void navigate({ href })
  }

  const handleItemHover = (item: LineNavItem | LineNavGroup) => {
    if (!("href" in item) || !item.href) return
    // Preload the target route chunk while the user's intent is forming
    router.preloadRoute({ to: item.href }).catch(() => {
      // Preload failures are non-fatal — navigation still works on click
    })
  }

  return (
    <Drawer
      handle={studioSidebarHandle}
      open={isOpen}
      onOpenChange={handleOpenChange}
      position="left"
    >
      <DrawerPopup
        variant="inset"
        hasBackdrop={true}
        backdropProps={{ className: "bg-black/40" }}
        showBar={false}
        portalProps={{ keepMounted: true }}
        className="h-full w-80 max-w-[85vw] flex-col overflow-hidden rounded-2xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/95"
      >
        {/* Self-contained header: logo + close (never covered by the page header) */}
        <DrawerHeader className="flex shrink-0 flex-row items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
          <DrawerTitle className="flex items-center gap-2 font-sans text-sm font-semibold tracking-tight text-foreground">
            <span className="italic">
              byphongphan
              <span className="font-normal text-foreground/40">/</span>ui
            </span>
            <span className="font-sans text-[10px] text-muted-foreground/60">
              (...)
            </span>
          </DrawerTitle>

          <DrawerClose
            render={
              <Button
                size="icon"
                variant="ghost"
                aria-label="Close sidebar"
                className="size-7"
              />
            }
          >
            <X className="size-3.5" aria-hidden="true" />
          </DrawerClose>
        </DrawerHeader>

        {/* Caliper ruler line along the inner left edge */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-2 border-r border-border/40 text-border [background:repeating-linear-gradient(to_bottom,transparent_0_14px,currentColor_14px_15px,transparent_15px_28px)]"
          />

          <ScrollArea
            className="h-full w-full"
            scrollFade
            overscrollContain
            orientation="vertical"
          >
            <div className="relative p-2 pl-3">
              <LineNav
                groups={groups}
                activeHref={activeHref}
                scrollActiveIntoView
                onItemClick={(item, event) => handleNavigate(item, event)}
                onItemHover={handleItemHover}
                className="w-full"
              />
            </div>
          </ScrollArea>
        </div>
      </DrawerPopup>
    </Drawer>
  )
}
