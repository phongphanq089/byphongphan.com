import { useNavigate } from "@tanstack/react-router"
import { play } from "cuelume"
import { LayoutGrid, PanelLeft } from "lucide-react"
import { useMemo, useState } from "react"

import { HOOK_CATEGORIES } from "@/shared/config"
import { cn } from "@/shared/lib/utils"
import {
  Button,
  Drawer,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/core"
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

export function HookQuickNav({
  currentCategory,
  currentSlug,
  currentTitle,
  className,
}: HookQuickNavProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

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
              className="size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--pp-primary-glow)]"
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
      setOpen(false)
    }
  }

  const navContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-border/60 px-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="size-3.5 text-primary" />
          <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            Hooks ({totalCount})
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
      {/* ── 1. Desktop Sticky Sidebar: always flex on laptop (lg+), hidden on mobile ── */}
      <aside
        aria-label="Hook Navigation"
        className={cn(
          "sticky top-12 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col border-r border-border/70 bg-muted/90 backdrop-blur-xs lg:flex xl:w-70",
          className
        )}
      >
        {navContent}
      </aside>

      {/* ── 2. Mobile Bar & Drawer: visible on < lg only ── */}
      <div className="sticky top-12 z-30 flex h-11 w-full items-center justify-between border-b border-border/70 bg-background/95 px-4 backdrop-blur-md lg:hidden">
        <div className="flex max-w-[70%] items-center gap-2 truncate text-xs">
          <LayoutGrid className="size-3.5 shrink-0 text-muted-foreground" />
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
                aria-label="Open hook navigation drawer"
              >
                <PanelLeft className="size-3.5 text-primary" />
                <span>Menu</span>
              </Button>
            }
          />

          <DrawerPopup variant="inset" showCloseButton={true}>
            <DrawerHeader>
              <DrawerTitle>Components Navigation</DrawerTitle>
            </DrawerHeader>
            <DrawerPanel>{navContent}</DrawerPanel>
          </DrawerPopup>
        </Drawer>
      </div>
    </>
  )
}

export default HookQuickNav
