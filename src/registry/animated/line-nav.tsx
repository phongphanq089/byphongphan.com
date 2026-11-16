/**
 * This component is inspired by Devouring Details , chanh dai and Skiper UI.
 */

import { memo, useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/shared/lib/utils"

/** Item line — standard rule of the caliper: default short, active longest. */
const lineVariants = {
  normal: { width: 24 },
  active: { width: 40 },
  hover: { width: 40 },
}

/** Group header line — fixed, shorter than item lines ("nhóm to line ngắn"). */
const GROUP_LINE_WIDTH = 14

/** Divider tick between items. */
const TICK_CLASS = "h-px w-5 shrink-0 bg-foreground/15"

export type LineNavItem = {
  title: React.ReactNode
  href: string
  badge?: React.ReactNode
}

export type LineNavGroup = {
  /** Title content — string or composed nodes (accent count badge…). */
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

  // 1. Grouped Navigation Mode
  if (groups && groups.length > 0) {
    return (
      <nav
        aria-label="Component navigation"
        className={cn("flex flex-col gap-1.5 py-4 select-none", className)}
      >
        {groups.map((group, groupIndex) => {
          const isGroupActive = Boolean(
            group.href && group.href === currentActive
          )

          return (
            <div key={group.href ?? `group-${groupIndex}`} className="contents">
              {/* Group header — fixed height row so it can never collapse */}
              {group.href ? (
                <motion.a
                  ref={isGroupActive ? activeItemRef : undefined}
                  aria-current={isGroupActive ? "page" : undefined}
                  className="group flex h-7 items-center gap-3 rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  href={group.href}
                  initial={false}
                  onClick={(event) => handleItemClick(group, event)}
                  onMouseEnter={() => handleItemHover(group)}
                  onFocus={() => handleItemHover(group)}
                >
                  <span
                    aria-hidden="true"
                    style={{ width: GROUP_LINE_WIDTH }}
                    className={cn(
                      "h-[2px] shrink-0 rounded-full transition-[background-color,box-shadow] ease-out",
                      isGroupActive
                        ? "bg-pp-primary shadow-[0_0_8px_var(--pp-primary-glow)]"
                        : "bg-pp-primary/75 group-hover:bg-pp-primary"
                    )}
                  />
                  <span className="flex min-w-0 items-center gap-2">
                    {group.title}
                  </span>
                </motion.a>
              ) : (
                <div className="flex h-7 items-center gap-3 select-none">
                  <span
                    aria-hidden="true"
                    style={{ width: GROUP_LINE_WIDTH }}
                    className="h-[2px] shrink-0 rounded-full bg-pp-primary/75"
                  />
                  <span className="flex min-w-0 items-center gap-2">
                    {group.title}
                  </span>
                </div>
              )}

              {/* Tick dividers following the group header */}
              <span aria-hidden="true" className={TICK_CLASS} />
              <span aria-hidden="true" className={TICK_CLASS} />

              {/* Group items */}
              {group.items.map((item, itemIndex) => {
                const isActive = item.href === currentActive
                const isLastItemInGroup = itemIndex === group.items.length - 1

                return (
                  <LineNavItem
                    key={item.href}
                    ref={isActive ? activeItemRef : undefined}
                    title={item.title}
                    href={item.href}
                    badge={item.badge}
                    active={isActive}
                    isLast={isLastItemInGroup}
                    onClick={(event) => handleItemClick(item, event)}
                    onHover={() => handleItemHover(item)}
                  />
                )
              })}
            </div>
          )
        })}
      </nav>
    )
  }

  const navItems = items ?? []

  return (
    <nav
      aria-label="Component navigation"
      className={cn("flex flex-col gap-1.5 py-4 select-none", className)}
    >
      {navItems.map((item, index) => {
        const isActive = item.href === currentActive

        return (
          <LineNavItem
            key={item.href}
            ref={isActive ? activeItemRef : undefined}
            title={item.title}
            href={item.href}
            badge={item.badge}
            active={isActive}
            isLast={index === navItems.length - 1}
            onClick={(event) => handleItemClick(item, event)}
            onHover={() => handleItemHover(item)}
          />
        )
      })}
    </nav>
  )
}

const LineNavItem = memo(function LineNavItem({
  ref,
  title,
  href,
  badge,
  active = false,
  isLast = false,
  onClick,
  onHover,
}: {
  ref?: React.Ref<HTMLAnchorElement>
  title: React.ReactNode
  href: string
  badge?: React.ReactNode
  active?: boolean
  isLast?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  onHover?: () => void
}) {
  return (
    <>
      <motion.a
        ref={ref}
        aria-current={active ? "page" : undefined}
        className="group flex h-6 items-center gap-3 rounded-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        href={href}
        initial={false}
        animate={active ? "active" : "normal"}
        whileHover="hover"
        onClick={onClick}
        onMouseEnter={onHover}
        onFocus={onHover}
      >
        <motion.span
          aria-hidden="true"
          className={cn(
            "block h-px shrink-0 transition-[background-color,box-shadow] ease-out",
            active
              ? "bg-foreground shadow-[0_0_8px_rgba(255,255,255,0.7)]"
              : "bg-foreground/20 group-hover:bg-foreground"
          )}
          variants={lineVariants}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-sm whitespace-nowrap transition-[color,font-weight] ease-out",
            active
              ? "font-semibold text-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          )}
        >
          {title}
          {badge}
        </span>
      </motion.a>

      {!isLast && (
        <>
          <span aria-hidden="true" className={TICK_CLASS} />
          <span aria-hidden="true" className={TICK_CLASS} />
        </>
      )}
    </>
  )
})
