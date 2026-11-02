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

import { HOOK_CATEGORIES } from "@/shared/config"
import { cn } from "@/shared/lib/utils"
import {
  LineNav,
  type LineNavGroup,
  type LineNavItem,
} from "@/shared/ui/core/line-nav"

import { HOOKS_DATA } from "../hooks-data"

export interface HookQuickNavProps {
  currentCategory: string
  currentSlug: string
  currentTitle?: string
  className?: string
}

const PANEL_WIDTH = 270

export function HookQuickNav({
  currentCategory,
  currentSlug,
  currentTitle,
  className,
}: HookQuickNavProps) {
  const navigate = useNavigate()

  // On desktop (>= 1024px) start open, on mobile (< 1024px) start closed
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024
    }
    return true
  })

  // Active path for the currently viewed hook
  const activeHref = `/hooks/${currentCategory}/${currentSlug}`

  const currentHook = useMemo(
    () => HOOKS_DATA.find((h) => h.slug === currentSlug),
    [currentSlug]
  )
  const displayTitle = currentTitle || currentHook?.name || currentSlug

  const navGroups: LineNavGroup[] = useMemo(() => {
    return HOOK_CATEGORIES.map((cat) => {
      const items = HOOKS_DATA.filter((hook) => hook.category === cat.id)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((hook) => ({
          title: hook.name,
          href: `/hooks/${hook.category}/${hook.slug}`,
          badge: hook.isNew ? (
            <span
              aria-label="New hook"
              className="size-1.5 shrink-0 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.85)]"
            />
          ) : undefined,
        }))

      return {
        title: cat.label,
        href: `/hooks/${cat.id}`,
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

  // Close on Escape on mobile
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && window.innerWidth < 1024) {
        setOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <>
      {/* ── Fixed Floating Toggle Pill Button ── */}
      <div
        className={cn(
          "fixed top-20 left-4 z-40 transition-all duration-300 md:left-6",
          className
        )}
      >
        <button
          type="button"
          onClick={() => {
            play("tap", { emphasis: "subtle" })
            setOpen((prev) => !prev)
          }}
          aria-expanded={open}
          aria-label={open ? "Close Hook Navigator" : "Open Hook Navigator"}
          className={cn(
            "group flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all duration-200",
            "border-border/80 bg-background/90 text-foreground shadow-lg hover:border-primary/50 hover:bg-muted"
          )}
        >
          {open ? (
            <PanelLeftClose className="size-3.5 text-primary transition-transform duration-200 group-hover:scale-110" />
          ) : (
            <PanelLeftOpen className="size-3.5 text-primary transition-transform duration-200 group-hover:scale-110" />
          )}
          <span className="max-w-[140px] truncate font-mono text-xs font-bold sm:max-w-[180px]">
            {displayTitle}
          </span>
          <ChevronDown
            className={cn(
              "size-3 text-muted-foreground transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* ── Mobile Backdrop ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* ── Collapsible Floating QuickNav Panel ── */}
      <motion.aside
        initial={false}
        animate={{
          x: open ? 0 : -(PANEL_WIDTH + 40),
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 38,
        }}
        aria-label="Hook Quick Navigator"
        className={cn(
          "fixed top-32 left-4 z-40 flex flex-col rounded-xl border border-border/70 md:left-6",
          "bg-background/95 shadow-2xl backdrop-blur-xl",
          "max-h-[calc(100vh-9.5rem)] overflow-hidden"
        )}
        style={{ width: PANEL_WIDTH }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-border/60 px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <LayoutGrid className="size-3.5 text-primary" />
            <span className="text-[11px] font-bold tracking-wider text-foreground uppercase">
              Hook Index
            </span>
            <span className="py-0.2 rounded-full bg-primary/10 px-1.5 font-mono text-[9px] font-bold text-primary">
              {totalCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close hook navigation panel"
            className="rounded p-1 text-muted-foreground/70 hover:bg-muted hover:text-foreground"
          >
            <PanelLeftClose className="size-3.5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-2 py-2">
          <LineNav
            groups={navGroups}
            activeHref={activeHref}
            onItemClick={handleItemClick}
            className="w-full text-xs"
          />
        </div>
      </motion.aside>
    </>
  )
}
