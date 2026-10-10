/**
 * This component is inspired by Devouring Details , chanh dai and Skiper UI.
 */

import { memo, useEffect, useRef, useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/shared/lib/utils"

const lineVariants = {
  normal: { width: 24 },
  active: { width: 40 },
  hover: { width: 40 },
}

const groupLineVariants = {
  normal: { width: 16 },
  active: { width: 24 },
  hover: { width: 20 },
}

export type LineNavItem = {
  title: React.ReactNode
  href: string
  badge?: React.ReactNode
}

export type LineNavGroup = {
  title: string
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
}

export function LineNav({
  className,
  items,
  groups,
  activeHref,
  scrollActiveIntoView = true,
  onItemClick,
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

  // 1. Grouped Navigation Mode
  if (groups && groups.length > 0) {
    return (
      <nav
        className={cn("flex flex-col gap-2 py-5.25 select-none", className)}
        style={
          {
            "--line-nav-width": `${lineVariants.normal.width}px`,
          } as React.CSSProperties
        }
      >
        {groups.map((group, groupIndex) => {
          const isGroupActive = Boolean(
            group.href && group.href === currentActive
          )
          const isLastGroup = groupIndex === groups.length - 1

          return (
            <div key={group.title} className="contents">
              {/* Group Header */}
              {group.href ? (
                <motion.a
                  ref={isGroupActive ? activeItemRef : undefined}
                  aria-current={isGroupActive ? "page" : undefined}
                  className="group relative flex h-px items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3.5 focus-visible:outline-none"
                  href={group.href}
                  initial={false}
                  animate={isGroupActive ? "active" : "normal"}
                  whileHover="hover"
                  onClick={(event) => handleItemClick(group, event)}
                >
                  <motion.span
                    className={cn(
                      "block h-px shrink-0 transition-[background-color] ease-out",
                      isGroupActive
                        ? "bg-foreground"
                        : "bg-foreground/30 group-hover:bg-foreground/60"
                    )}
                    variants={groupLineVariants}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />
                  <span className="font-mono text-[11px] font-medium tracking-wider text-foreground uppercase transition-[color] ease-out group-hover:text-foreground">
                    {group.title}
                  </span>
                </motion.a>
              ) : (
                <div className="group relative flex h-px items-center gap-3 select-none">
                  <span className="block h-px w-4 shrink-0 bg-foreground/30" />
                  <span className="font-mono text-[11px] font-medium tracking-wider text-foreground uppercase">
                    {group.title}
                  </span>
                </div>
              )}

              {/* Ticks following group header */}
              <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
              <span className="block h-px w-(--line-nav-width) bg-foreground/20" />

              {/* Group items */}
              {group.items.map((item, itemIndex) => {
                const isActive = item.href === currentActive
                const isLastItemInGroup = itemIndex === group.items.length - 1
                const isVeryLast = isLastGroup && isLastItemInGroup

                return (
                  <LineNavItem
                    key={item.href}
                    ref={isActive ? activeItemRef : undefined}
                    title={item.title}
                    href={item.href}
                    badge={item.badge}
                    active={isActive}
                    isLast={isVeryLast}
                    onClick={(event) => handleItemClick(item, event)}
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
      className={cn("flex flex-col gap-2 py-5.25 select-none", className)}
      style={
        {
          "--line-nav-width": `${lineVariants.normal.width}px`,
        } as React.CSSProperties
      }
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
}: {
  ref?: React.Ref<HTMLAnchorElement>
  title: React.ReactNode
  href: string
  badge?: React.ReactNode
  active?: boolean
  isLast?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}) {
  return (
    <>
      <motion.a
        ref={ref}
        aria-current={active ? "page" : undefined}
        className="group relative flex h-px items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3.5 focus-visible:outline-none"
        href={href}
        initial={false}
        animate={active ? "active" : "normal"}
        whileHover="hover"
        onClick={onClick}
      >
        <motion.span
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
          <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
          <span className="block h-px w-(--line-nav-width) bg-foreground/20" />
        </>
      )}
    </>
  )
})
