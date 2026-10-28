import { useNavigate } from "@tanstack/react-router"
import { play } from "cuelume"
import { ChevronDown, LayoutGrid } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { BLOCK_CATEGORIES } from "@/features/blocks/blocks-data"
import { BLOCKS_DATA } from "@/features/blocks/blocks-data"
import {
  Drawer,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/ui/drawer"
import { cn } from "@/shared/lib/utils"
import { Button, Kbd } from "@/shared/ui/core"
import {
  LineNav,
  type LineNavGroup,
  type LineNavItem,
} from "@/shared/ui/core/line-nav"

export interface BlockQuickNavProps {
  currentCategory: string
  currentSlug: string
  currentTitle?: string
  className?: string
}

export function BlockQuickNav({
  currentCategory,
  currentSlug,
  currentTitle,
  className,
}: BlockQuickNavProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const activeHref = `/blocks/${currentCategory}/${currentSlug}`

  const navGroups: LineNavGroup[] = useMemo(() => {
    return BLOCK_CATEGORIES.map((cat) => {
      const items = BLOCKS_DATA.filter((b) => b.category === cat.id)
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((b) => ({
          title: b.title,
          href: `/blocks/${b.category}/${b.slug}`,
          badge: b.isNew ? (
            <span
              aria-label="New block"
              className="size-1.5 shrink-0 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.85)]"
            />
          ) : b.isUpdated ? (
            <span
              aria-label="Updated block"
              className="size-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.85)]"
            />
          ) : undefined,
        }))

      return {
        title: cat.label,
        href: `/blocks/${cat.id}`,
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
      navigate({ to: item.href })
      setOpen(false)
      play("tap", { emphasis: "subtle" })
    }
  }

  // Keyboard shortcut: Press 'b' to toggle, Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return
      }

      if (e.key === "b" || e.key === "B") {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault()
          setOpen((prev) => !prev)
          play("toggle", { direction: "forward", emphasis: "subtle" })
        }
      } else if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open])

  return (
    <>
      {/* Mobile top spacer so fixed top-12 bar doesn't cover top hero content */}
      <div className="h-11 w-full sm:hidden" aria-hidden="true" />

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger
          render={
            <button
              type="button"
              onClick={() =>
                play("toggle", { direction: "forward", emphasis: "subtle" })
              }
              className={cn(
                // Mobile: Fixed at top right below header (top-12 = 48px), 100% full width, height 44px
                "fixed inset-x-0 top-12 z-30 flex h-11 w-full max-w-sm items-center justify-between border-b border-border/70 bg-accent/90 px-4 backdrop-blur-md transition-colors hover:bg-accent/50 sm:rounded-md",
                // Desktop: Centered floating pill fixed at bottom
                "left-1/2 -translate-x-1/2 sm:z-40 sm:h-10 sm:w-auto sm:border sm:border-border/80 sm:px-4 sm:py-2 sm:shadow-xl sm:backdrop-blur-md sm:hover:bg-accent sm:hover:shadow-2xl lg:top-auto lg:bottom-10",
                className
              )}
            />
          }
        >
          {/* Mobile View: Shows current block and switch CTA */}
          <div className="flex w-full items-center justify-between lg:hidden">
            <div className="flex w-full items-center gap-2 truncate text-xs">
              <LayoutGrid className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate font-semibold text-foreground">
                {currentTitle || "Blocks"}
              </span>
              <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
                {currentCategory}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-primary">
              <ChevronDown className="size-3.5 transition-transform duration-200" />
            </div>
          </div>

          {/* Desktop View: Centered bottom floating pill */}
          <div className="hidden w-full justify-between sm:items-center sm:gap-2.5 sm:text-xs lg:flex">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <LayoutGrid className="size-4 text-primary" />
                <span className="font-medium text-foreground">
                  Blocks Navigation
                </span>
              </div>

              <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                {totalCount}
              </span>
            </div>
            <Kbd>B</Kbd>
          </div>
        </DrawerTrigger>

        {/* DrawerPopup with MaxWidth pattern */}
        <DrawerPopup className="mx-auto max-w-2xl sm:border-x" showBar>
          <DrawerHeader className="border-b border-border/40 pb-3">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-base font-bold">
                Blocks Navigation
              </DrawerTitle>
              <span className="rounded-full border border-border bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                {totalCount} blocks
              </span>
            </div>
          </DrawerHeader>

          <DrawerPanel className="max-h-[60vh] p-3">
            <LineNav
              groups={navGroups}
              activeHref={activeHref}
              scrollActiveIntoView={true}
              onItemClick={handleItemClick}
            />
          </DrawerPanel>

          <DrawerFooter
            variant="bare"
            className="border-t border-border/40 pt-3"
          >
            <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
              <span className="hidden items-center gap-1.5 font-mono text-[11px] sm:flex">
                Press <Kbd>Esc</Kbd> or swipe down to dismiss
              </span>
              <span className="text-[11px] sm:hidden">Swipe down to close</span>
              <DrawerClose render={<Button variant="outline" size="sm" />}>
                Close
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerPopup>
      </Drawer>
    </>
  )
}

export default BlockQuickNav
