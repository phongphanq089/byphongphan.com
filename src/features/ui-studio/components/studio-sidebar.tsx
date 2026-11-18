import { Link, useNavigate, useRouter } from "@tanstack/react-router"
import {
  ChevronDown,
  Component as ComponentIcon,
  LayoutGrid,
  LayoutTemplate,
  type LucideIcon,
  Search,
  Webhook,
  X,
} from "lucide-react"
import { motion } from "motion/react"
import { useMemo, useState } from "react"

import {
  LineNav,
  type LineNavGroup,
  type LineNavItem,
} from "@/registry/animated/line-nav"
import { Button } from "@/registry/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerPopup,
  DrawerTitle,
} from "@/registry/ui/drawer"
import { ScrollArea } from "@/registry/ui/scroll-area"
import {
  BLOCK_CATEGORIES,
  COMPONENT_CATEGORIES,
  HOOK_CATEGORIES,
} from "@/shared/config"
import { playClickSound, playHoverSound } from "@/shared/lib/sound"
import { cn } from "@/shared/lib/utils"
import { PPPixelMark } from "@/shared/ui"

import { studioSidebarHandle } from "../hooks/studio-sidebar-handle"
import type { StudioItem } from "../model/types"
import {
  getStudioItemHref,
  resolveStudioItem,
  STUDIO_RECORDS,
} from "../model/unified-registry.adapter"
import { useStudioStore } from "../store/studio-store"

interface StudioSidebarProps {
  /** Current route segment — null on `/ui` (all items). */
  activeSegment: string | null
  /** Current detail slug — undefined unless a detail route is active. */
  activeSlug?: string | null
}

type StudioSectionId = "components" | "blocks" | "hooks"
type CategoryEntry = { id: string; label: string }

interface StudioSection {
  id: StudioSectionId
  title: string
  icon: LucideIcon
  /** Total (unfiltered) item count for the section badge. */
  count: number
  groups: LineNavGroup[]
}

/** Typographic nav item — numbering handled by the section builder. */
const toNavItem = (item: StudioItem, index: number): LineNavItem => ({
  title: item.title,
  href: getStudioItemHref(item),
  index,
  badge: item.isNew ? (
    <span
      aria-label="New"
      className="size-1.5 shrink-0 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.6)] dark:bg-sky-400 dark:shadow-[0_0_6px_rgba(56,189,248,0.8)]"
    />
  ) : undefined,
})

/** Category sub-header inside a section — uppercased label + count */
const toCategoryTitle = (label: string, count: number): React.ReactNode => (
  <span className="inline-flex min-w-0 items-center gap-2">
    <span className="truncate">{label}</span>
    <span className="font-mono text-[9px] text-muted-foreground/60 tabular-nums">
      {String(count).padStart(2, "0")}
    </span>
  </span>
)

const CATEGORY_CONFIG: Record<StudioSectionId, readonly CategoryEntry[]> = {
  components: COMPONENT_CATEGORIES,
  blocks: BLOCK_CATEGORIES,
  hooks: HOOK_CATEGORIES,
}

/** Group a flat list by category config order (skipping empty categories). */
function buildCategoryGroups(
  items: StudioItem[],
  sectionId: StudioSectionId
): LineNavGroup[] {
  const categories = CATEGORY_CONFIG[sectionId]
  const orderOf = new Map(categories.map((entry, index) => [entry.id, index]))
  const byCategory = new Map<string, StudioItem[]>()

  for (const item of items) {
    const key = item.categoryName ?? "other"
    const list = byCategory.get(key) ?? []
    list.push(item)
    byCategory.set(key, list)
  }

  let indexRef = 0

  return [...byCategory.entries()]
    .sort(([a], [b]) => (orderOf.get(a) ?? 999) - (orderOf.get(b) ?? 999))
    .map(([categoryId, categoryItems]) => {
      const label =
        categories.find((entry) => entry.id === categoryId)?.label ?? categoryId
      return {
        title: toCategoryTitle(label, categoryItems.length),
        items: categoryItems.map((item) => toNavItem(item, ++indexRef)),
      }
    })
}

function itemMatches(item: LineNavItem, query: string): boolean {
  if (typeof item.title === "string") {
    return item.title.toLowerCase().includes(query)
  }
  return item.href.toLowerCase().includes(query)
}

interface CollapsibleSectionProps {
  sectionId: StudioSectionId
  icon: StudioSection["icon"]
  title: string
  /** Filtered count shown in the section badge. */
  count: number
  open: boolean
  onToggle: () => void
  children?: React.ReactNode
}

function CollapsibleSection({
  sectionId,
  icon: Icon,
  title,
  count,
  open,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  const headerId = `studio-section-${sectionId}`

  return (
    <section aria-label={title} className="flex flex-col">
      <button
        type="button"
        id={headerId}
        aria-expanded={open}
        aria-controls={`${headerId}-body`}
        onClick={onToggle}
        className="group flex h-9 w-full items-center gap-2 rounded-md px-2 text-left transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Icon
          className="size-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-foreground"
          aria-hidden="true"
        />
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <span className="truncate font-sans text-[12px] font-semibold tracking-tight text-foreground">
            {title}
          </span>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground/60 tabular-nums">
            {String(count).padStart(2, "0")}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground/60 transition-transform duration-300 ease-out",
            !open && "-rotate-90"
          )}
          aria-hidden="true"
        />
      </button>

      <motion.div
        id={`${headerId}-body`}
        role="region"
        aria-labelledby={headerId}
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="pb-1">{children}</div>
      </motion.div>
    </section>
  )
}

/**
 * Modern Inset Floating Sidebar using the signature LineNav caliper animation:
 * - Three collapsible top-level sections (Components / Sections and Blocks / Hooks)
 *   grouped by their real taxonomy categories (no synthetic Unique/Basic split)
 * - Caliper-style ruler items with electric-blue active state
 * - Instant search filter with auto-expand of matching sections
 * - Clean typographic section titles with monospace counts
 * - Smooth native swipe dismiss & hardware-accelerated animations
 */
export function StudioSidebar({
  activeSegment,
  activeSlug,
}: StudioSidebarProps) {
  const sidebarOpen = useStudioStore((state) => state.sidebarOpen)
  const setSidebarOpen = useStudioStore((state) => state.setSidebarOpen)
  const [filterQuery, setFilterQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState<
    Record<StudioSectionId, boolean>
  >({
    components: true,
    blocks: true,
    hooks: false,
  })
  const navigate = useNavigate()
  const router = useRouter()

  const activeHref = activeSegment
    ? activeSlug
      ? `/ui/${activeSegment}/${activeSlug}`
      : `/ui/${activeSegment}`
    : "/ui"

  // Route-derived: force the section hosting the active item open
  const activeItem = useMemo(
    () =>
      activeSegment && activeSlug
        ? (resolveStudioItem(activeSegment, activeSlug)?.item ?? null)
        : null,
    [activeSegment, activeSlug]
  )
  const forcedOpen = useMemo(() => {
    const set = new Set<StudioSectionId>()
    if (activeItem?.collection === "base") set.add("components")
    else if (activeItem?.collection === "blocks") set.add("blocks")
    else if (activeItem?.collection === "hooks") set.add("hooks")
    return set
  }, [activeItem])

  const filterActive = filterQuery.trim().length > 0
  const query = filterQuery.trim().toLowerCase()

  // Build the three sections from STUDIO_RECORDS (static registry — never mutates)
  const sections = useMemo<StudioSection[]>(() => {
    const blocks = STUDIO_RECORDS.filter(
      (r) => r.item.collection === "blocks"
    ).map((r) => r.item)
    const components = STUDIO_RECORDS.filter(
      (r) => r.item.collection === "base"
    ).map((r) => r.item)
    const hooks = STUDIO_RECORDS.filter(
      (r) => r.item.collection === "hooks"
    ).map((r) => r.item)

    return [
      {
        id: "components",
        title: "Components",
        icon: ComponentIcon,
        count: components.length,
        groups: buildCategoryGroups(components, "components"),
      },
      {
        id: "blocks",
        title: "Sections and Blocks",
        icon: LayoutTemplate,
        count: blocks.length,
        groups: buildCategoryGroups(blocks, "blocks"),
      },
      {
        id: "hooks",
        title: "Hooks",
        icon: Webhook,
        count: hooks.length,
        groups: buildCategoryGroups(hooks, "hooks"),
      },
    ]
  }, [])

  // Filter items in real time when searching — also yields per-section match counts
  const filteredSections = useMemo<StudioSection[]>(() => {
    if (!filterActive) return sections

    return sections
      .map((section) => ({
        ...section,
        groups: section.groups
          .map((group) => ({
            ...group,
            items: group.items.filter((item) => itemMatches(item, query)),
          }))
          .filter((group) => group.items.length > 0),
      }))
      .filter(
        (section) =>
          section.groups.reduce(
            (total, group) => total + group.items.length,
            0
          ) > 0
      )
  }, [sections, filterActive, query])

  const isSectionOpen = (id: StudioSectionId): boolean =>
    filterActive
      ? filteredSections.some((section) => section.id === id)
      : (expandedSections[id] ?? false) || forcedOpen.has(id)

  const filteredCount = (section: StudioSection) =>
    section.groups.reduce((total, group) => total + group.items.length, 0)

  const toggleSection = (id: StudioSectionId) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleOpenChange = (open: boolean) => {
    setSidebarOpen(open)
    if (!open) {
      setFilterQuery("")
    }
  }

  const handleNavigate = (
    item: LineNavItem | LineNavGroup,
    event?: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!("href" in item) || !item.href) return
    const href = item.href

    if (event) {
      const isModifiedClick =
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      if (isModifiedClick) return
      event.preventDefault()
    }

    setSidebarOpen(false)
    setFilterQuery("")
    void navigate({ href })
  }

  const handleItemHover = (item: LineNavItem | LineNavGroup) => {
    if (!("href" in item) || !item.href) return
    router.preloadRoute({ to: item.href }).catch(() => {})
  }

  return (
    <Drawer
      handle={studioSidebarHandle}
      open={sidebarOpen}
      onOpenChange={handleOpenChange}
      position="left"
    >
      <DrawerPopup
        variant="inset"
        hasBackdrop={true}
        backdropProps={{ className: "bg-black/50 backdrop-blur-xs" }}
        showBar={true}
        className="h-full w-80 max-w-[85vw] flex-col overflow-hidden border border-border/80 bg-background/95 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/95"
      >
        {/* Drawer Header: Logo + Title + Close */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-4 py-3">
          <DrawerTitle className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground">
            <Link
              to="/"
              aria-label="Phong Phan — home"
              className="flex size-7 shrink-0 items-center justify-center transition-opacity hover:opacity-80"
            >
              <PPPixelMark
                className="size-full text-pp-primary"
                variant="glow"
              />
            </Link>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-foreground">UI Studio</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
                {STUDIO_RECORDS.length}
              </span>
            </div>
          </DrawerTitle>

          <DrawerClose
            render={
              <Button
                size="icon"
                variant="ghost"
                aria-label="Close sidebar"
                className="size-7 text-muted-foreground hover:text-foreground"
              />
            }
          >
            <X className="size-3.5" aria-hidden="true" />
          </DrawerClose>
        </div>

        {/* Quick filter input */}
        <div className="shrink-0 border-b border-border/40 px-3 py-2.5">
          <div className="relative flex items-center">
            <Search
              className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground/50"
              aria-hidden="true"
            />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter items..."
              className="h-8 w-full rounded-md border border-border/60 bg-muted/40 pr-7 pl-8 text-xs text-foreground transition-colors placeholder:text-muted-foreground/50 focus:border-border focus:bg-background focus:ring-1 focus:ring-ring/40 focus:outline-none"
            />
            {filterQuery ? (
              <button
                type="button"
                onClick={() => setFilterQuery("")}
                aria-label="Clear filter"
                className="absolute right-2 inline-flex size-4 items-center justify-center rounded-sm text-muted-foreground/60 hover:text-foreground"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Collapsible sections */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <ScrollArea
            className="h-full w-full"
            scrollFade
            overscrollContain
            orientation="vertical"
          >
            <div className="relative space-y-1 p-2 pl-3">
              {/* All Items direct navigation link */}
              {!filterActive ? (
                <div className="mb-1.5 border-b border-border/40 pb-1.5">
                  <Link
                    to="/ui"
                    onClick={() => {
                      playClickSound()
                      setSidebarOpen(false)
                      setFilterQuery("")
                    }}
                    onMouseEnter={() => playHoverSound()}
                    className={cn(
                      "group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
                      activeHref === "/ui"
                        ? "bg-accent font-semibold text-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <LayoutGrid
                        className={cn(
                          "size-3.5 transition-colors",
                          activeHref === "/ui"
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                        aria-hidden="true"
                      />
                      <span>All Items</span>
                    </div>
                    <span
                      className={cn(
                        "font-mono text-[10px] tabular-nums",
                        activeHref === "/ui"
                          ? "font-bold text-primary"
                          : "text-muted-foreground/60"
                      )}
                    >
                      {STUDIO_RECORDS.length}
                    </span>
                  </Link>
                </div>
              ) : null}

              {filteredSections.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No components match &ldquo;{filterQuery}&rdquo;
                </div>
              ) : (
                filteredSections.map((section) => (
                  <CollapsibleSection
                    key={section.id}
                    sectionId={section.id}
                    icon={section.icon}
                    title={section.title}
                    count={filteredCount(section)}
                    open={isSectionOpen(section.id)}
                    onToggle={() => toggleSection(section.id)}
                  >
                    <LineNav
                      groups={section.groups}
                      activeHref={activeHref}
                      scrollActiveIntoView
                      onItemClick={(item, event) => handleNavigate(item, event)}
                      onItemHover={handleItemHover}
                      className="w-full"
                    />
                  </CollapsibleSection>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DrawerPopup>
    </Drawer>
  )
}
