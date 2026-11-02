import { useNavigate } from "@tanstack/react-router"
import { play } from "cuelume"
import { LayoutGrid, type LucideIcon, PanelLeft } from "lucide-react"
import { useState } from "react"

import { cn } from "@/shared/lib/utils"
import {
  Button,
  Drawer,
  DrawerDescription,
  DrawerHeader,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/core"
import {
  LineNav,
  type LineNavGroup,
  type LineNavItem,
} from "@/shared/ui/core/line-nav"

export interface DocQuickNavProps {
  entityTitle: string
  currentCategory: string
  currentSlug: string
  currentTitle?: string
  navGroups: LineNavGroup[]
  totalCount: number
  activeHref?: string
  icon?: LucideIcon
  className?: string
  onItemSelect?: (item: LineNavItem | LineNavGroup) => void
}

export function DocQuickNav({
  entityTitle,
  currentCategory,
  currentSlug,
  currentTitle,
  navGroups,
  totalCount,
  activeHref,
  icon: Icon = LayoutGrid,
  className,
  onItemSelect,
}: DocQuickNavProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const displayTitle = currentTitle || currentSlug

  const handleItemClick = (
    item: LineNavItem | LineNavGroup,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault()

    if (item.href) {
      play("tap", { emphasis: "subtle" })
      navigate({ to: item.href })
      setOpen(false)
      onItemSelect?.(item)
    }
  }

  const navContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border/60 px-4">
        <div className="flex items-center gap-2">
          <Icon className="size-3.5 text-primary" />
          <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            {entityTitle} ({totalCount})
          </span>
        </div>
      </div>

      <div className="flex-1 scrollbar-none overflow-y-auto px-2 py-3">
        <LineNav
          groups={navGroups}
          activeHref={activeHref}
          scrollActiveIntoView={true}
          onItemClick={handleItemClick}
          className="w-full text-xs"
        />
      </div>
    </div>
  )

  return (
    <>
      <aside
        aria-label={`${entityTitle} Navigation`}
        className={cn(
          "sticky top-12 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col border-r border-border/70 bg-muted/80 backdrop-blur-xs lg:flex xl:w-70",
          className
        )}
      >
        {navContent}
      </aside>

      {/* ── 2. Mobile Bar & Drawer (Gesture-enabled swipe from left): visible on < lg only ── */}
      <div className="sticky top-12 z-30 flex h-11 w-full items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur-md lg:hidden">
        <div className="flex max-w-[70%] items-center gap-2 truncate text-xs">
          <Icon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate font-semibold text-foreground">
            {displayTitle}
          </span>
          <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground uppercase">
            {currentCategory}
          </span>
        </div>

        <Drawer position="left" open={open} onOpenChange={setOpen}>
          <DrawerTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-7.5 gap-1.5 rounded-md px-2.5 text-xs font-medium"
                onClick={() =>
                  play("toggle", { direction: "forward", emphasis: "subtle" })
                }
                aria-label={`Open ${entityTitle.toLowerCase()} navigation drawer`}
              >
                <PanelLeft className="size-3.5 text-primary" />
                <span>Menu</span>
              </Button>
            }
          />
          <DrawerPopup
            position="left"
            showBar
            className="w-[280px] p-0 sm:max-w-xs"
          >
            <DrawerHeader className="sr-only">
              <DrawerTitle>{entityTitle} Navigation</DrawerTitle>
              <DrawerDescription>
                Browse all available {entityTitle.toLowerCase()}
              </DrawerDescription>
            </DrawerHeader>
            {navContent}
          </DrawerPopup>
        </Drawer>
      </div>
    </>
  )
}
