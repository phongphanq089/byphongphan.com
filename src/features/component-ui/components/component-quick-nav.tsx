import { useNavigate } from "@tanstack/react-router"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useMemo, useState } from "react"

import { cn } from "@/shared/lib/utils"
import {
  LineNav,
  type LineNavGroup,
  type LineNavItem,
} from "@/shared/ui/core/line-nav"

import { COMPONENTS_DATA } from "../components-data"

export interface ComponentQuickNavProps {
  currentCategory: string
  currentSlug: string
  className?: string
}

const PANEL_WIDTH = 270

export function ComponentQuickNav({
  currentCategory,
  currentSlug,
  className,
}: ComponentQuickNavProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState<boolean>(true)

  // Active path for the currently viewed component
  const activeHref = `/component-ui/${currentCategory}/${currentSlug}`

  // Grouped components: excluding "all" and "foundations" (only "primitives" and "animations")
  const navGroups: LineNavGroup[] = useMemo(() => {
    const categories: { id: string; label: string }[] = [
      { id: "primitives", label: "Primitives" },
      { id: "animations", label: "Animations" },
    ]

    return categories.map((cat) => {
      const items = COMPONENTS_DATA.filter((comp) => comp.category === cat.id)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((comp) => ({
          title: comp.name,
          href: `/component-ui/${comp.category}/${comp.slug}`,
          badge: comp.isNew ? (
            <span
              aria-label="New component"
              className="size-1.5 shrink-0 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.85)]"
            />
          ) : undefined,
        }))

      return {
        title: cat.label,
        href: `/component-ui/${cat.id}`,
        items,
      }
    })
  }, [])

  const totalCount = useMemo(
    () => navGroups.reduce((acc, g) => acc + g.items.length, 0),
    [navGroups]
  )

  const handleItemClick = (
    item: LineNavItem | LineNavGroup,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault()

    if (item.href) {
      navigate({ to: item.href })
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setOpen(false)
      }
    }
  }

  // Close with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return (
    <div className="pointer-events-none fixed top-1/2 left-0 z-40 -translate-y-1/2 max-lg:hidden">
      <motion.div
        initial={false}
        animate={{
          x: open ? 0 : -(PANEL_WIDTH + 24),
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="flex h-[72vh] max-h-[640px] w-[270px] flex-col overflow-hidden rounded-lg border border-border/80 bg-muted backdrop-blur-md"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-3.5 py-2.5">
          <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Components ({totalCount})
          </span>
        </div>

        {/* Scrollable LineNav Ladder with Category Groups */}
        <div
          className={cn(
            "flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden",
            className
          )}
        >
          <div className="h-full min-h-0 flex-1 scrollbar-none overflow-y-auto px-2 py-1">
            <LineNav
              groups={navGroups}
              activeHref={activeHref}
              scrollActiveIntoView={true}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </motion.div>

      {/* Single Toggle Button */}
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        initial={false}
        animate={{
          x: open ? PANEL_WIDTH + -40 : 0,
        }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto absolute top-6 flex size-9 -translate-y-1/2 items-center justify-center rounded-md border border-border/80 bg-muted text-muted-foreground shadow-xl backdrop-blur-md transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label={
          open ? "Collapse component navigation" : "Open component navigation"
        }
        title={open ? "Collapse navigation" : `Components (${totalCount})`}
        aria-expanded={open}
      >
        {open ? (
          <PanelLeftClose className="size-4" />
        ) : (
          <PanelLeftOpen className="size-4" />
        )}
      </motion.button>
    </div>
  )
}
