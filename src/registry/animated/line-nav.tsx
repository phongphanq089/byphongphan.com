/**
 * LineNav — Precision Caliper Ladder Navigation
 * Inspired by Devouring Details, chanh dai and Skiper UI.
 * Every tick on the ruler (main + sub graduations) animates with a Gaussian
 * proximity wave — the entire ladder flexes with spring physics around the
 * focused item. Fixed pitch grid: 5px per tick, 5 ticks per item row.
 */

import { memo, useEffect, useRef, useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/shared/lib/utils"

/** Fixed pitch of the ruler grid, in pixels. */
const TICK_PITCH = 5
/** Item block height = 5 pitches (main tick + 4 sub graduations). */
const ROW_HEIGHT = TICK_PITCH * 5
/** Tick layout template (top offsets in px) for one 25px item block. */
const TICK_SLOTS = [
  { y: 2, local: 1, role: "sub-small" },
  { y: 7, local: 2, role: "sub-small" },
  { y: 12, local: 0, role: "main" },
  { y: 17, local: 3, role: "sub-mid" },
  { y: 22, local: 4, role: "sub-small" },
] as const

type TickRole = (typeof TICK_SLOTS)[number]["role"]

/** Base (resting) geometry for each tick role — dual-theme via foreground tokens. */
const BASE_TICK: Record<TickRole, { width: number; className: string }> = {
  main: {
    width: 14,
    className: "bg-foreground/30 dark:bg-white/20",
  },
  "sub-mid": {
    width: 11,
    className: "bg-foreground/40 dark:bg-white/25",
  },
  "sub-small": {
    width: 7,
    className: "bg-foreground/20 dark:bg-white/15",
  },
}

/** Level look-up table for the proximity wave (Δ ticks from the target). */
const WAVE: { width: number; className: string; glowClass: string }[] = [
  {
    width: 52,
    className: "bg-blue-600 dark:bg-sky-400",
    glowClass:
      "shadow-[0_0_8px_rgba(37,99,235,0.35)] dark:shadow-[0_0_8px_rgba(56,189,248,0.6)]",
  },
  {
    width: 42,
    className: "bg-blue-600/55 dark:bg-sky-400/50",
    glowClass: "shadow-none",
  },
  {
    width: 34,
    className: "bg-blue-600/35 dark:bg-sky-400/30",
    glowClass: "shadow-none",
  },
  {
    width: 26,
    className: "bg-blue-600/25 dark:bg-sky-400/25",
    glowClass: "shadow-none",
  },
  {
    width: 20,
    className: "bg-blue-600/15 dark:bg-sky-400/15",
    glowClass: "shadow-none",
  },
]

function tickGeometry(role: TickRole, delta: number) {
  const wave = WAVE[delta]
  if (wave) return wave
  const base = BASE_TICK[role]
  return {
    width: base.width,
    className: base.className,
    glowClass: "shadow-none",
  }
}

export type LineNavItem = {
  title: React.ReactNode
  href: string
  /** Optional index number or string (e.g. 1 -> "01") */
  index?: number | string
  badge?: React.ReactNode
}

export type LineNavGroup = {
  /** Title content — string or composed nodes */
  title: React.ReactNode
  href?: string
  items: LineNavItem[]
}

export type LineNavProps = {
  className?: string
  /** Flat list of navigation items (for basic mode) */
  items?: LineNavItem[]
  /** Grouped navigation sections (for grouped mode) */
  groups?: LineNavGroup[]
  /** Href of the active item */
  activeHref?: string
  /** Scroll the active item into view on mount or change */
  scrollActiveIntoView?: boolean
  /** Show 2-digit index if provided (defaults to true) */
  showIndex?: boolean
  /** Called when an item or group header is clicked */
  onItemClick?: (
    item: LineNavItem | LineNavGroup,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => void
  /** Called when an item or group header is hovered or focused (intent preload) */
  onItemHover?: (item: LineNavItem | LineNavGroup) => void
}

export function LineNav({
  className,
  items,
  groups,
  activeHref,
  scrollActiveIntoView = true,
  showIndex = true,
  onItemClick,
  onItemHover,
}: LineNavProps) {
  const [internalActive, setInternalActive] = useState<string>(() => {
    if (activeHref) return activeHref
    if (items && items.length > 0) return items[0].href
    if (groups && groups.length > 0 && groups[0].items.length > 0) {
      return groups[0].items[0].href
    }
    return ""
  })

  const [hoveredHref, setHoveredHref] = useState<string | null>(null)
  const currentActive = activeHref ?? internalActive
  const activeItemRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    if (scrollActiveIntoView) {
      activeItemRef.current?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      })
    }
  }, [scrollActiveIntoView, currentActive])

  const handleItemClick = (
    item: LineNavItem | LineNavGroup,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (item.href) {
      if (activeHref === undefined) {
        setInternalActive(item.href)
      }
    }
    onItemClick?.(item, event)
  }

  const handleItemHover = (item: LineNavItem | LineNavGroup) => {
    if (item.href) {
      onItemHover?.(item)
    }
  }

  /** Map the flat list of items to global blocks for Δk proximity math. */
  const flatItems =
    groups && groups.length > 0
      ? groups.flatMap((group) => group.items)
      : (items ?? [])
  const targetHref = hoveredHref ?? currentActive
  const targetBlockIndex = flatItems.findIndex(
    (entry) => entry.href === targetHref
  )
  const safeTarget = targetBlockIndex === -1 ? 0 : targetBlockIndex

  // 1. Grouped Navigation Mode
  if (groups && groups.length > 0) {
    let blockCursor = 0
    return (
      <nav
        aria-label="Component navigation"
        className={cn("flex flex-col py-2 select-none", className)}
      >
        {groups.map((group, groupIndex) => {
          const isGroupActive = Boolean(
            group.href && group.href === currentActive
          )

          return (
            <div key={group.href ?? `group-${groupIndex}`} className="contents">
              {/* Group header row */}
              <div className="flex flex-col pt-3 pb-1 first:pt-1">
                {group.href ? (
                  <motion.a
                    ref={isGroupActive ? activeItemRef : undefined}
                    aria-current={isGroupActive ? "page" : undefined}
                    className="group flex h-7 items-center rounded-xs transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    href={group.href}
                    onClick={(event) => handleItemClick(group, event)}
                    onMouseEnter={() => {
                      setHoveredHref(group.href ?? null)
                      handleItemHover(group)
                    }}
                    onMouseLeave={() => setHoveredHref(null)}
                    onFocus={() => {
                      setHoveredHref(group.href ?? null)
                      handleItemHover(group)
                    }}
                    onBlur={() => setHoveredHref(null)}
                  >
                    <div className="relative flex h-full w-14 shrink-0 items-center">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-[2px] rounded-full transition-all duration-200",
                          isGroupActive
                            ? "w-12 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.35)] dark:bg-sky-400 dark:shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                            : "w-5 bg-foreground/40 group-hover:bg-foreground/70 dark:bg-white/25 dark:group-hover:bg-white/40"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "flex min-w-0 items-center gap-2 text-[11px] font-bold tracking-wider uppercase transition-colors",
                        isGroupActive
                          ? "text-blue-600 dark:text-sky-400"
                          : "text-foreground/90"
                      )}
                    >
                      {group.title}
                    </span>
                  </motion.a>
                ) : (
                  <div className="flex h-5 items-center select-none">
                    <div className="relative flex h-full w-14 shrink-0 items-center">
                      <span
                        aria-hidden="true"
                        className="h-[2px] w-5 rounded-full bg-foreground/40 dark:bg-white/25"
                      />
                    </div>
                    <span className="flex min-w-0 items-center gap-2 text-[11px] font-bold tracking-wider text-foreground/90 uppercase">
                      {group.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Group items */}
              {group.items.map((item, itemIndex) => {
                const isActive = item.href === currentActive
                const isHovered = hoveredHref === item.href
                const blockIndex = blockCursor++

                return (
                  <LineNavItemRow
                    key={item.href}
                    ref={isActive ? activeItemRef : undefined}
                    item={item}
                    index={
                      item.index ?? (showIndex ? itemIndex + 1 : undefined)
                    }
                    showIndex={showIndex}
                    isActive={isActive}
                    isHovered={isHovered}
                    targetBlockIndex={safeTarget}
                    blockIndex={blockIndex}
                    onClick={(event) => handleItemClick(item, event)}
                    onHover={() => handleItemHover(item)}
                    setHoveredHref={setHoveredHref}
                  />
                )
              })}
            </div>
          )
        })}
      </nav>
    )
  }

  // 2. Flat List Navigation Mode
  const navItems = items ?? []

  return (
    <nav
      aria-label="Component navigation"
      className={cn("flex flex-col py-2 select-none", className)}
    >
      {navItems.map((item, index) => {
        const isActive = item.href === currentActive
        const isHovered = hoveredHref === item.href

        return (
          <LineNavItemRow
            key={item.href}
            ref={isActive ? activeItemRef : undefined}
            item={item}
            index={item.index ?? (showIndex ? index + 1 : undefined)}
            showIndex={showIndex}
            isActive={isActive}
            isHovered={isHovered}
            targetBlockIndex={safeTarget}
            blockIndex={index}
            onClick={(event) => handleItemClick(item, event)}
            onHover={() => handleItemHover(item)}
            setHoveredHref={setHoveredHref}
          />
        )
      })}
    </nav>
  )
}

interface LineNavItemRowProps {
  ref?: React.Ref<HTMLAnchorElement>
  item: LineNavItem
  index?: number | string
  showIndex?: boolean
  isActive: boolean
  isHovered: boolean
  /** Block index of the item closest to the focus wave (hovered ?? active). */
  targetBlockIndex: number
  /** Block index of this row within the flat item sequence. */
  blockIndex: number
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void
  onHover: () => void
  setHoveredHref: (href: string | null) => void
}

const LineNavItemRow = memo(function LineNavItemRow({
  ref,
  item,
  index,
  showIndex = true,
  isActive,
  isHovered,
  targetBlockIndex,
  blockIndex,
  onClick,
  onHover,
  setHoveredHref,
}: LineNavItemRowProps) {
  const formattedIndex =
    showIndex && index !== undefined
      ? typeof index === "number"
        ? String(index).padStart(2, "0")
        : String(index)
      : null

  // Global tick index for this block: main tick = blockIndex * 5
  const blockBase = blockIndex * 5

  return (
    <motion.a
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      href={item.href}
      onClick={onClick}
      onMouseEnter={() => {
        setHoveredHref(item.href)
        onHover()
      }}
      onMouseLeave={() => setHoveredHref(null)}
      onFocus={() => {
        setHoveredHref(item.href)
        onHover()
      }}
      onBlur={() => setHoveredHref(null)}
      className="group relative grid grid-cols-[3.5rem_minmax(0,1fr)] outline-none"
      style={{ height: ROW_HEIGHT }}
    >
      {/* Ruler spine — fixed width, ticks originate at x = 0 */}
      <div aria-hidden="true" className="relative h-full w-14">
        {TICK_SLOTS.map((slot) => {
          const tickGlobal = blockBase + slot.local
          const targetGlobal = targetBlockIndex * 5
          const delta = Math.abs(tickGlobal - targetGlobal)
          const geo = tickGeometry(slot.role, delta)
          return (
            <motion.span
              key={slot.local}
              initial={false}
              animate={{ width: geo.width }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={cn(
                "absolute left-0 block h-px",
                geo.className,
                geo.glowClass
              )}
              style={{ top: slot.y }}
            />
          )
        })}
      </div>

      {/* Text column — aligned to the main (center) tick of the block */}
      <span
        className={cn(
          "flex h-full min-w-0 items-center gap-2 pr-2 text-xs font-medium tracking-tight",
          isActive
            ? "font-semibold text-blue-600 dark:font-medium dark:text-sky-400"
            : isHovered
              ? "font-medium text-foreground"
              : "text-foreground/70 group-hover:text-foreground dark:text-muted-foreground/75"
        )}
      >
        {formattedIndex ? (
          <span
            className={cn(
              "shrink-0 text-[12px] tabular-nums",
              isActive
                ? "font-semibold text-blue-600 dark:font-medium dark:text-sky-400"
                : "text-foreground/50 group-hover:text-foreground/80 dark:text-muted-foreground/45 dark:group-hover:text-muted-foreground"
            )}
          >
            {formattedIndex}
          </span>
        ) : null}
        <span className="truncate text-sm">{item.title}</span>
        {item.badge}
      </span>
    </motion.a>
  )
})
