import {
  CaretDownIcon,
  CubeIcon,
  type Icon as PhosphorIcon,
  LayoutIcon,
  WebhooksLogoIcon,
} from "@phosphor-icons/react"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { motion } from "motion/react"
import { useMemo, useState } from "react"

import {
  LineNav,
  type LineNavGroup,
  type LineNavItem,
} from "@/registry/animated/line-nav"
import { useMediaQuery } from "@/registry/hooks/use-media-query"
import { ScrollArea } from "@/registry/ui/scroll-area"
import {
  BLOCK_CATEGORIES,
  COMPONENT_CATEGORIES,
  HOOK_CATEGORIES,
} from "@/shared/config"
import { cn } from "@/shared/lib/utils"

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
  icon: PhosphorIcon
  count: number
  groups: LineNavGroup[]
}

const toNavItem = (item: StudioItem, index: number): LineNavItem => ({
  title: item.title,
  href: getStudioItemHref(item),
  index,
  badge: item.isNew ? (
    <span
      aria-label="New"
      className="size-1.5 shrink-0 rounded-full bg-blue-600 shadow-[0_0_6px_rgba(37,99,235,0.45)] dark:bg-sky-400"
    />
  ) : undefined,
})

const toCategoryTitle = (label: string, count: number): React.ReactNode => (
  <span className="inline-flex min-w-0 items-center gap-1.5">
    <span className="truncate">{label}</span>
    <span className="font-mono text-[10px] text-muted-foreground/65 tabular-nums">
      {String(count).padStart(2, "0")}
    </span>
  </span>
)

const CATEGORY_CONFIG: Record<StudioSectionId, readonly CategoryEntry[]> = {
  components: COMPONENT_CATEGORIES,
  blocks: BLOCK_CATEGORIES,
  hooks: HOOK_CATEGORIES,
}

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

interface CollapsibleSectionProps {
  sectionId: StudioSectionId
  icon: StudioSection["icon"]
  title: string
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
        className="group flex h-8.5 w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 text-left transition-colors outline-none hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Icon
          size={16}
          className="shrink-0 text-muted-foreground/70 transition-colors group-hover:text-foreground"
          aria-hidden="true"
        />
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="truncate font-sans text-sm font-semibold tracking-tight text-foreground/90 group-hover:text-foreground">
            {title}
          </span>
          <span className="shrink-0 font-mono text-[10.5px] text-muted-foreground/60 tabular-nums">
            {String(count).padStart(2, "0")}
          </span>
        </span>
        <CaretDownIcon
          size={14}
          className={cn(
            "shrink-0 text-muted-foreground/60 transition-transform duration-250 ease-out",
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
        transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <div className="pb-2">{children}</div>
      </motion.div>
    </section>
  )
}

/**
 * Spacious push-layout Studio Sidebar using refined `LineNav variant="studio"`.
 *
 * Sits seamlessly on the outer shell background with no separating border lines:
 * - Desktop (`>= md`): expands smoothly to 296–312px, pushing the stage card aside.
 * - Mobile (`< md`): expands to ~82vw, pushing the stage card right while keeping
 *   an interactive edge peek visible (X-style slide/tap to dismiss).
 */
export function StudioSidebar({
  activeSegment,
  activeSlug,
}: StudioSidebarProps) {
  const sidebarOpen = useStudioStore((state) => state.sidebarOpen)
  const setSidebarOpen = useStudioStore((state) => state.setSidebarOpen)
  const isCompactViewport = useMediaQuery("max-md")
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
        icon: CubeIcon,
        count: components.length,
        groups: buildCategoryGroups(components, "components"),
      },
      {
        id: "blocks",
        title: "Blocks",
        icon: LayoutIcon,
        count: blocks.length,
        groups: buildCategoryGroups(blocks, "blocks"),
      },
      {
        id: "hooks",
        title: "Hooks",
        icon: WebhooksLogoIcon,
        count: hooks.length,
        groups: buildCategoryGroups(hooks, "hooks"),
      },
    ]
  }, [])

  const isSectionOpen = (id: StudioSectionId): boolean =>
    (expandedSections[id] ?? false) || forcedOpen.has(id)

  const toggleSection = (id: StudioSectionId) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }))
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

    if (isCompactViewport) {
      setSidebarOpen(false)
    }
    void navigate({ href })
  }

  const handleItemHover = (item: LineNavItem | LineNavGroup) => {
    if (!("href" in item) || !item.href) return
    router.preloadRoute({ to: item.href }).catch(() => {})
  }

  return (
    <aside
      aria-label="UI Studio navigation"
      aria-hidden={!sidebarOpen}
      inert={!sidebarOpen}
      className={cn(
        "relative flex h-full shrink-0 flex-col overflow-hidden bg-background transition-[width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] select-none",
        sidebarOpen
          ? "w-[82vw] max-w-[324px] opacity-100 md:w-[300px] md:max-w-[300px] lg:w-[320px] lg:max-w-[320px]"
          : "pointer-events-none w-0 opacity-0"
      )}
    >
      {/* Inner fixed-width wrapper prevents text reflow while width animates */}
      <div className="flex h-full w-[82vw] max-w-[324px] flex-col pt-18 md:w-[300px] md:max-w-[300px] lg:w-[320px] lg:max-w-[320px]">
        {/* Navigation sections */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <ScrollArea
            className="h-full w-full"
            scrollFade
            overscrollContain
            orientation="vertical"
          >
            <div className="relative space-y-2 px-3.5 pb-8">
              {sections.map((section) => (
                <CollapsibleSection
                  key={section.id}
                  sectionId={section.id}
                  icon={section.icon}
                  title={section.title}
                  count={section.count}
                  open={isSectionOpen(section.id)}
                  onToggle={() => toggleSection(section.id)}
                >
                  <LineNav
                    variant="studio"
                    groups={section.groups}
                    activeHref={activeHref}
                    scrollActiveIntoView
                    onItemClick={(item, event) => handleNavigate(item, event)}
                    onItemHover={handleItemHover}
                    className="w-full"
                  />
                </CollapsibleSection>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </aside>
  )
}
