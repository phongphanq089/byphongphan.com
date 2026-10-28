import { useNavigate } from "@tanstack/react-router"
import { play } from "cuelume"
import {
  ChevronDown,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useMemo, useState } from "react"

import { COMPONENT_CATEGORIES } from "@/shared/config"
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
  currentTitle?: string
  className?: string
}

const PANEL_WIDTH = 270

export function ComponentQuickNav({
  currentCategory,
  currentSlug,
  currentTitle,
  className,
}: ComponentQuickNavProps) {
  const navigate = useNavigate()

  // On desktop (>= 1024px) start open, on mobile (< 1024px) start closed
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024
    }
    return true
  })

  // Active path for the currently viewed component
  const activeHref = `/component-ui/${currentCategory}/${currentSlug}`

  const currentComponent = useMemo(
    () => COMPONENTS_DATA.find((c) => c.slug === currentSlug),
    [currentSlug]
  )
  const displayTitle = currentTitle || currentComponent?.name || currentSlug

  const navGroups: LineNavGroup[] = useMemo(() => {
    return COMPONENT_CATEGORIES.map((cat) => {
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
          ) : comp.isUpdated ? (
            <span
              aria-label="Updated component"
              className="size-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.85)]"
            />
          ) : undefined,
        }))

      return {
        title: cat.label,
        href: `/component-ui/${cat.id}`,
        items,
      }
    }).filter((group) => group.items.length > 0)
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
      play("tap", { emphasis: "subtle" })
      navigate({ to: item.href })
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
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
    <>
      {/* ── 1. Mobile top spacer so fixed top-12 bar doesn't cover top page content ── */}
      <div className="h-11 w-full lg:hidden" aria-hidden="true" />

      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev)
          play("toggle", {
            direction: open ? "back" : "forward",
            emphasis: "subtle",
          })
        }}
        className="fixed inset-x-0 top-12 left-1/2 z-30 flex h-11 w-full max-w-md -translate-x-1/2 items-center justify-between bg-accent/90 px-4 backdrop-blur-md transition-colors hover:bg-accent/50 sm:rounded-md lg:hidden"
        aria-expanded={open}
      >
        <div className="w-fullitems-center flex w-full justify-between">
          <div className="flex max-w-[70%] items-center gap-2 truncate text-xs">
            <LayoutGrid className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate font-semibold text-foreground">
              {displayTitle}
            </span>
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
              {currentCategory}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-primary">
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </div>
        </div>
      </button>

      {/* ── 3. Mobile Backdrop Overlay when Side Panel is open ── */}
      {open && (
        <div
          className="fixed inset-0 z-39 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={() => {
            setOpen(false)
            play("toggle", { direction: "back", emphasis: "subtle" })
          }}
          aria-hidden="true"
        />
      )}

      {/* ── 4. Floating Side Panel (Both Desktop and Mobile) ── */}
      <div className="pointer-events-none fixed top-1/2 left-0 z-40 -translate-y-1/2">
        <motion.div
          initial={false}
          animate={{
            x: open ? 0 : -(PANEL_WIDTH + 24),
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
          }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          className="flex h-[72vh] max-h-[640px] w-[270px] flex-col overflow-hidden rounded-r-lg border border-l-0 border-border/80 bg-background/95 shadow-2xl backdrop-blur-md dark:bg-muted/95"
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

        {/* Desktop Single Toggle Button (also visible on mobile when open for easy close) */}
        <motion.button
          type="button"
          onClick={() => {
            setOpen((prev) => !prev)
            play("toggle", {
              direction: open ? "back" : "forward",
              emphasis: "subtle",
            })
          }}
          initial={false}
          animate={{
            x: open ? PANEL_WIDTH - 34 : 0,
          }}
          transition={{ type: "spring", damping: 28, stiffness: 280 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "pointer-events-auto absolute top-4.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-r-md border border-l-0 border-border/80 bg-background/95 text-muted-foreground shadow-xl backdrop-blur-md transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none dark:bg-muted/95",
            !open && "max-lg:hidden"
          )}
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
    </>
  )
}

export default ComponentQuickNav
