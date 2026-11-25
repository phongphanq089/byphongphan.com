# Line Nav

> Minimalist animated line navigation with spring-physics indicators, scroll-spy integration, and orientation variants.

## Overview

**Line Nav** is a vertical navigation component with an authentic ruler-tick ladder indicator inspired by chanh dai, Devouring Details and Skiper UI.

It supports both a flat **Basic** list and a structured **Grouped** hierarchy, where major category headers and active items extend prominent indicator rules with spring physics.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/line-nav.json
```

  
    
      - Install dependencies:
      ```bash
npm install motion clsx tailwind-merge
```
      - Copy and paste the component into your project:
      ```tsx
// animated/line-nav.tsx
/**
 * LineNav — Precision Caliper Ladder Navigation
 * Inspired by Devouring Details, chanh dai and Skiper UI.
 * Every tick on the ruler (main + sub graduations) animates with a Gaussian
 * proximity wave — the entire ladder flexes with spring physics around the
 * focused item. Fixed pitch grid: 5px per tick, 5 ticks per item row.
 */

import { memo, useEffect, useRef, useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"

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

const STUDIO_BASE_TICK: Record<TickRole, { width: number; className: string }> =
  {
    main: {
      width: 14,
      className: "bg-foreground/30 dark:bg-white/25",
    },
    "sub-mid": {
      width: 10,
      className: "bg-foreground/40 dark:bg-white/30",
    },
    "sub-small": {
      width: 6,
      className: "bg-foreground/22 dark:bg-white/15",
    },
  }

const STUDIO_WAVE: { width: number; className: string; glowClass: string }[] = [
  {
    width: 42,
    className: "bg-blue-600 dark:bg-sky-400",
    glowClass:
      "shadow-[0_0_8px_rgba(37,99,235,0.35)] dark:shadow-[0_0_8px_rgba(56,189,248,0.6)]",
  },
  {
    width: 34,
    className: "bg-blue-600/55 dark:bg-sky-400/50",
    glowClass: "shadow-none",
  },
  {
    width: 27,
    className: "bg-blue-600/35 dark:bg-sky-400/30",
    glowClass: "shadow-none",
  },
  {
    width: 21,
    className: "bg-blue-600/25 dark:bg-sky-400/25",
    glowClass: "shadow-none",
  },
  {
    width: 16,
    className: "bg-blue-600/15 dark:bg-sky-400/15",
    glowClass: "shadow-none",
  },
]

function tickGeometry(
  role: TickRole,
  delta: number,
  variant: LineNavVariant = "default"
) {
  const waveTable = variant === "studio" ? STUDIO_WAVE : WAVE
  const baseTable = variant === "studio" ? STUDIO_BASE_TICK : BASE_TICK
  const wave = waveTable[delta]
  if (wave) return wave
  const base = baseTable[role]
  return {
    width: base.width,
    className: base.className,
    glowClass: "shadow-none",
  }
}

export type LineNavVariant = "default" | "studio"

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
  /** Visual density preset (`"studio"` uses ultra-fine whisper ticks). */
  variant?: LineNavVariant
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
  variant = "default",
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
              <div
                className={cn(
                  "flex flex-col pb-1 first:pt-1",
                  variant === "studio" ? "pt-4" : "pt-3"
                )}
              >
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
                    <div
                      className={cn(
                        "relative flex h-full shrink-0 items-center",
                        variant === "studio" ? "w-12" : "w-14"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-[2px] rounded-full transition-all duration-200",
                          variant === "studio"
                            ? isGroupActive
                              ? "w-10 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.35)] dark:bg-sky-400 dark:shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                              : "w-4 bg-foreground/40 group-hover:bg-foreground/70 dark:bg-white/25 dark:group-hover:bg-white/40"
                            : isGroupActive
                              ? "w-12 bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.35)] dark:bg-sky-400 dark:shadow-[0_0_8px_rgba(56,189,248,0.6)]"
                              : "w-5 bg-foreground/40 group-hover:bg-foreground/70 dark:bg-white/25 dark:group-hover:bg-white/40"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "flex min-w-0 items-center gap-2 uppercase transition-colors",
                        variant === "studio"
                          ? "text-[11px] font-bold tracking-wider"
                          : "text-[11px] font-bold tracking-wider",
                        isGroupActive
                          ? "text-blue-600 dark:text-sky-400"
                          : "text-foreground/85"
                      )}
                    >
                      {group.title}
                    </span>
                  </motion.a>
                ) : (
                  <div className="flex h-6 items-center select-none">
                    <div
                      className={cn(
                        "relative flex h-full shrink-0 items-center",
                        variant === "studio" ? "w-12" : "w-14"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-[2px] rounded-full bg-foreground/40 dark:bg-white/25",
                          variant === "studio" ? "w-4" : "w-5"
                        )}
                      />
                    </div>
                    <span className="flex min-w-0 items-center gap-2 text-[11px] font-bold tracking-wider text-foreground/85 uppercase">
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
                    variant={variant}
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
            variant={variant}
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
  variant?: LineNavVariant
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
  variant = "default",
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
  const isStudio = variant === "studio"

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
      className={cn(
        "group relative grid outline-none",
        isStudio
          ? "grid-cols-[3rem_minmax(0,1fr)]"
          : "grid-cols-[3.5rem_minmax(0,1fr)]"
      )}
      style={{ height: ROW_HEIGHT }}
    >
      {/* Ruler spine — fixed width, ticks originate at x = 0 */}
      <div
        aria-hidden="true"
        className={cn("relative h-full", isStudio ? "w-12" : "w-14")}
      >
        {TICK_SLOTS.map((slot) => {
          const tickGlobal = blockBase + slot.local
          const targetGlobal = targetBlockIndex * 5
          const delta = Math.abs(tickGlobal - targetGlobal)
          const geo = tickGeometry(slot.role, delta, variant)
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
          "flex h-full min-w-0 items-center gap-2 pr-2 tracking-tight transition-colors",
          isStudio ? "text-[14.5px]" : "text-xs font-medium",
          isActive
            ? "font-semibold text-blue-600 dark:font-medium dark:text-sky-400"
            : isHovered
              ? "font-medium text-foreground"
              : isStudio
                ? "font-normal text-foreground/85 group-hover:text-foreground dark:text-foreground/80"
                : "text-foreground/65 group-hover:text-foreground dark:text-muted-foreground/70"
        )}
      >
        {formattedIndex ? (
          <span
            className={cn(
              "shrink-0 tabular-nums",
              isStudio ? "text-[12.5px]" : "text-[12px]",
              isActive
                ? "font-semibold text-blue-600 dark:font-medium dark:text-sky-400"
                : isStudio
                  ? "text-foreground/55 group-hover:text-foreground/85 dark:text-muted-foreground/65 dark:group-hover:text-foreground"
                  : "text-foreground/50 group-hover:text-foreground/80 dark:text-muted-foreground/45 dark:group-hover:text-muted-foreground"
            )}
          >
            {formattedIndex}
          </span>
        ) : null}
        <span
          className={cn("truncate", isStudio ? "text-[14.5px]" : "text-sm")}
        >
          {item.title}
        </span>
        {item.badge}
      </span>
    </motion.a>
  )
})

```
      - Update the import paths to match your project aliases.
    
  

## Usage

### 1. Basic Navigation (Flat List)

```tsx
import { LineNav } from "@/components/line-nav"

const items = [
  { title: "Pixel preloader", href: "#pixel-preloader" },
  { title: "Box loading preloader", href: "#box-loading-preloader" },
  { title: "Vercel Liquid simulation", href: "#vercel-liquid" },
  { title: "Ascii Simulation", href: "#ascii-simulation" },
  { title: "Interactive3d Hero", href: "#interactive3d-hero" },
]

export function BasicExample() {
  return <LineNav items={items} activeHref="#pixel-preloader" />
}
```

### 2. Grouped Navigation (Categorized)

```tsx
import { LineNav } from "@/components/line-nav"

const groups = [
  {
    title: "Crazy Hero",
    href: "#crazy-hero",
    items: [
      { title: "Vercel Liquid simulation", href: "#vercel-liquid" },
      { title: "Ascii Simulation", href: "#ascii-simulation" },
    ],
  },
  {
    title: "OG NavBars",
    href: "#og-navbars",
    items: [
      { title: "Nike menu", href: "#nike-menu" },
      { title: "Apple Navbar V001", href: "#apple-navbar-v001" },
    ],
  },
]

export function GroupedExample() {
  return <LineNav groups={groups} activeHref="#nike-menu" />
}
```

## Props

| Prop                   | Type                     | Default         | Description                                             |
| :--------------------- | :----------------------- | :-------------- | :------------------------------------------------------ |
| `items`                | `LineNavItem[]`          | `undefined`     | Flat array of navigation items `{ title, href }`.       |
| `groups`               | `LineNavGroup[]`         | `undefined`     | Categorized groups `{ title, href?, items }`.           |
| `activeHref`           | `string`                 | `undefined`     | Controlled active item href.                            |
| `defaultActiveHref`    | `string`                 | First item href | Uncontrolled initial active item href.                  |
| `sublineCount`         | `number`                 | `2`             | Number of intermediate tick marks between entries.      |
| `scrollActiveIntoView` | `boolean`                | `true`          | Scroll active item into view on mount.                  |
| `onItemClick`          | `(item, event) => void`  | `undefined`     | Callback fired when an item or group header is clicked. |
| `onActiveChange`       | `(href: string) => void` | `undefined`     | Callback fired when the active href changes.            |
