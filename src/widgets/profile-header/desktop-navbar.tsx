import { Link, useRouterState } from "@tanstack/react-router"

import { MAIN_NAV_ITEMS, type NavItemConfig } from "@/shared/config"
import { cn } from "@/shared/lib/utils"

function isRouteActive(itemLink: string, currentPath: string): boolean {
  if (itemLink === "/") {
    return currentPath === "/" || currentPath === ""
  }
  if (itemLink === "/blocks") {
    return currentPath.startsWith("/blocks") || currentPath.startsWith("/block")
  }
  return currentPath.startsWith(itemLink)
}

function getDisplayTitle(item: NavItemConfig): string {
  if (item.id === "hooks") return "Hooks"
  return item.title
}

export interface DesktopNavbarProps {
  items?: NavItemConfig[]
  className?: string
}

export function DesktopNavbar({
  items = MAIN_NAV_ITEMS,
  className,
}: DesktopNavbarProps) {
  const currentPath = useRouterState({ select: (s) => s.location.pathname })

  return (
    <nav
      aria-label="Main navigation"
      className={cn("flex h-9 items-center select-none", className)}
    >
      <ul className="flex h-full items-center gap-1">
        {items.map((item) => {
          const isActive = isRouteActive(item.link, currentPath)

          return (
            <li key={item.id} className="flex h-full items-center">
              <Link
                to={item.link}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-8 items-center rounded-lg border px-3 text-[13px] font-semibold whitespace-nowrap transition-colors duration-150",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                  isActive
                    ? "border-border bg-background font-bold text-foreground shadow-xs dark:border-white/10 dark:bg-muted dark:text-white"
                    : "border-transparent text-muted-foreground hover:border-border/50 hover:bg-accent/70 hover:text-foreground"
                )}
              >
                <span>{getDisplayTitle(item)}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// Backward-compatible aliases
export const FlashlightNavbar = DesktopNavbar
export type FlashlightNavbarProps = DesktopNavbarProps
export const SpotlightNavbar = DesktopNavbar
export type SpotlightNavbarProps = DesktopNavbarProps

export default DesktopNavbar
