import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { cn } from "@/shared/lib"

export interface TOCItem {
  id: string
  title: string
  depth: number // e.g. 2 for H2, 3 for H3, 4 for H4
  url?: string
}

export interface TableOfContentsProps {
  /**
   * Predefined list of TOC items. If omitted, containerRef will be scanned for h2, h3.
   */
  items?: TOCItem[]
  /**
   * Optional ref of the article/content container to automatically scan for headings.
   */
  containerRef?: React.RefObject<HTMLElement | null>
  /**
   * Header title text (default: "On this page")
   */
  title?: string
  /**
   * Header icon override
   */
  icon?: React.ReactNode
  /**
   * Additional container CSS classes
   */
  className?: string
  /**
   * Controlled active heading id
   */
  activeId?: string
  /**
   * Callback fired when a TOC item is clicked
   */
  onItemClick?: (id: string) => void
  /**
   * Offset in px to account for sticky top navigation bar (default: 84)
   */
  scrollOffset?: number
}

interface ItemCoords {
  x: number
  yMid: number
  yTop: number
  yBottom: number
}

const X_BASE = 14
const INDENT_STEP = 16

export const TableOfContents = ({
  items: propItems,
  containerRef,
  title = "ON THIS PAGE",
  icon = <BookOpen className="size-3.5 opacity-75" />,
  className,
  activeId: controlledActiveId,
  onItemClick,
  scrollOffset = 84,
}: TableOfContentsProps) => {
  const [scannedItems, setScannedItems] = useState<TOCItem[]>([])
  const [internalActiveId, setInternalActiveId] = useState<string | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const [itemCoords, setItemCoords] = useState<ItemCoords[]>([])

  // 1. Resolve active items (prop items or auto-scanned from container)
  const items = useMemo(() => {
    if (propItems && propItems.length > 0) {
      return propItems
    }
    return scannedItems
  }, [propItems, scannedItems])

  // 2. Auto-scan headings if containerRef provided and no static items
  useEffect(() => {
    if (propItems && propItems.length > 0) return
    if (!containerRef?.current) return

    const container = containerRef.current
    const headings = container.querySelectorAll<HTMLHeadingElement>("h2, h3")

    const discovered: TOCItem[] = []
    headings.forEach((heading, idx) => {
      let id = heading.id
      if (!id) {
        id =
          heading.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || `heading-${idx}`
        heading.id = id
      }
      discovered.push({
        id,
        title: heading.textContent || "",
        depth: heading.tagName.toLowerCase() === "h2" ? 2 : 3,
      })
    })

    setScannedItems(discovered)
  }, [containerRef, propItems])

  // 3. Track active heading on scroll
  useEffect(() => {
    if (items.length === 0) return

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    if (headingElements.length === 0) return

    const observerCallback = () => {
      const scrollY = window.scrollY
      let currentActiveId: string | null = null

      for (let i = 0; i < headingElements.length; i++) {
        const el = headingElements[i]
        const top =
          el.getBoundingClientRect().top + scrollY - (scrollOffset + 20)
        if (scrollY >= top) {
          currentActiveId = el.id
        }
      }

      // If at top of page, first item is active
      if (!currentActiveId && headingElements[0]) {
        currentActiveId = headingElements[0].id
      }

      setInternalActiveId(currentActiveId)
    }

    window.addEventListener("scroll", observerCallback, { passive: true })
    observerCallback()

    return () => {
      window.removeEventListener("scroll", observerCallback)
    }
  }, [items, scrollOffset])

  const activeId = controlledActiveId ?? internalActiveId ?? items[0]?.id

  // 4. Calculate item depths normalized to level 0
  const minDepth = useMemo(() => {
    if (items.length === 0) return 2
    return Math.min(...items.map((it) => it.depth))
  }, [items])

  // 5. Measure exact coordinate points of each item row
  const measureCoords = useCallback(() => {
    if (!listRef.current) return
    const listRect = listRef.current.getBoundingClientRect()

    const coords: ItemCoords[] = []
    items.forEach((item, idx) => {
      const el = itemRefs.current[idx]
      if (!el) {
        // Default fallback spacing
        const fallbackY = idx * 34 + 14
        coords.push({
          x: X_BASE + (item.depth - minDepth) * INDENT_STEP,
          yMid: fallbackY,
          yTop: fallbackY - 8,
          yBottom: fallbackY + 8,
        })
        return
      }

      const rect = el.getBoundingClientRect()
      const yTop = rect.top - listRect.top
      const yMid = yTop + rect.height / 2
      const yBottom = yTop + rect.height
      const level = Math.max(0, item.depth - minDepth)
      const x = X_BASE + level * INDENT_STEP

      coords.push({
        x,
        yMid,
        yTop,
        yBottom,
      })
    })

    setItemCoords(coords)
  }, [items, minDepth])

  useLayoutEffect(() => {
    measureCoords()
  }, [measureCoords])

  useEffect(() => {
    const handleResize = () => measureCoords()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [measureCoords])

  // 6. Generate Stepped Chamfer Rail SVG Path
  const { fullSvgPath, activeSvgPath, activeDotCoord } = useMemo(() => {
    if (itemCoords.length === 0) {
      return { fullSvgPath: "", activeSvgPath: "", activeDotCoord: null }
    }

    const activeIdx = items.findIndex((it) => it.id === activeId)
    const effectiveActiveIdx = activeIdx >= 0 ? activeIdx : 0

    // Full Path Construction
    const parts: string[] = []
    const first = itemCoords[0]
    parts.push(`M ${first.x} ${first.yTop + 2}`)

    for (let i = 0; i < itemCoords.length; i++) {
      const curr = itemCoords[i]
      parts.push(`L ${curr.x} ${curr.yMid}`)

      if (i < itemCoords.length - 1) {
        const next = itemCoords[i + 1]
        if (curr.x === next.x) {
          // Straight line down
          parts.push(`L ${curr.x} ${next.yMid}`)
        } else {
          // 45-degree chamfer transition in the gap
          const gapMid = (curr.yBottom + next.yTop) / 2
          const dx = Math.abs(next.x - curr.x)
          const bevelHalfY = dx / 2
          const yStart = gapMid - bevelHalfY
          const yEnd = gapMid + bevelHalfY

          parts.push(`L ${curr.x} ${yStart}`)
          parts.push(`L ${next.x} ${yEnd}`)
          parts.push(`L ${next.x} ${next.yMid}`)
        }
      } else {
        parts.push(`L ${curr.x} ${curr.yBottom - 2}`)
      }
    }

    const fullPathStr = parts.join(" ")

    // Active Path Construction (From start up to active item)
    const activeParts: string[] = []
    activeParts.push(`M ${first.x} ${first.yTop + 2}`)

    for (let i = 0; i <= effectiveActiveIdx; i++) {
      const curr = itemCoords[i]
      activeParts.push(`L ${curr.x} ${curr.yMid}`)

      if (i < effectiveActiveIdx) {
        const next = itemCoords[i + 1]
        if (curr.x === next.x) {
          parts.push(`L ${curr.x} ${next.yMid}`)
        } else {
          const gapMid = (curr.yBottom + next.yTop) / 2
          const dx = Math.abs(next.x - curr.x)
          const bevelHalfY = dx / 2
          const yStart = gapMid - bevelHalfY
          const yEnd = gapMid + bevelHalfY

          activeParts.push(`L ${curr.x} ${yStart}`)
          activeParts.push(`L ${next.x} ${yEnd}`)
          activeParts.push(`L ${next.x} ${next.yMid}`)
        }
      }
    }

    const activePathStr = activeParts.join(" ")
    const activeDot = itemCoords[effectiveActiveIdx]
      ? {
          x: itemCoords[effectiveActiveIdx].x,
          y: itemCoords[effectiveActiveIdx].yMid,
        }
      : null

    return {
      fullSvgPath: fullPathStr,
      activeSvgPath: activePathStr,
      activeDotCoord: activeDot,
    }
  }, [itemCoords, items, activeId])

  // 7. Smooth Scroll on Click
  const handleItemClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const target = document.getElementById(id)
    if (target) {
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - scrollOffset
      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      })
      setInternalActiveId(id)
      window.history.replaceState(null, "", `#${id}`)
      onItemClick?.(id)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <nav
      aria-label="Table of contents"
      className={cn(
        "relative flex w-full flex-col text-sm select-none",
        className
      )}
    >
      {/* Header */}
      {title && (
        <div className="mb-3.5 flex items-center gap-2 text-[11px] font-semibold tracking-wider text-muted-foreground/75 uppercase">
          {icon}
          <span>{title}</span>
        </div>
      )}

      {/* Main Container with Stepped SVG Rail and Nav Items */}
      <div className="relative w-full">
        {/* SVG Stepped Chamfer Rail Overlay */}
        <svg
          className="pointer-events-none absolute top-0 left-0 h-full w-16 overflow-visible"
          aria-hidden="true"
        >
          {/* Background Inactive Rail Track */}
          {fullSvgPath && (
            <path
              d={fullSvgPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/10 dark:text-white/15"
            />
          )}

          {/* Active Illuminated Rail Track */}
          {activeSvgPath && (
            <motion.path
              d={activeSvgPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground dark:text-white"
              initial={false}
              animate={{ d: activeSvgPath }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 32,
              }}
            />
          )}

          {/* Glowing Active Head Pip */}
          {activeDotCoord && (
            <motion.circle
              cx={activeDotCoord.x}
              cy={activeDotCoord.y}
              r="2.5"
              className="fill-foreground dark:fill-white"
              initial={false}
              animate={{
                cx: activeDotCoord.x,
                cy: activeDotCoord.y,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
              }}
            />
          )}
        </svg>

        {/* Item List */}
        <ul ref={listRef} className="flex flex-col gap-1">
          {items.map((item, idx) => {
            const isActive = item.id === activeId
            const level = Math.max(0, item.depth - minDepth)
            const paddingLeft = X_BASE + level * INDENT_STEP + 12

            return (
              <li
                key={item.id}
                ref={(el) => {
                  itemRefs.current[idx] = el
                }}
                className="relative"
              >
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleItemClick(e, item.id)}
                  style={{ paddingLeft: `${paddingLeft}px` }}
                  className={cn(
                    "group flex w-full items-center py-1 text-xs transition-colors duration-200",
                    isActive
                      ? "font-semibold text-foreground dark:text-white"
                      : "font-normal text-muted-foreground/75 hover:text-foreground"
                  )}
                >
                  <span className="line-clamp-2 leading-relaxed">
                    {item.title}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
