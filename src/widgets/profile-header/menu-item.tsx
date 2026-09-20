import { Link, useRouterState } from "@tanstack/react-router"

import { cn } from "@/shared/lib/utils"

export const activeColors: Record<string, string> = {
  HOME: "var(--pp-primary)",
  BLOCKS: "var(--pp-primary)",
  PROJECTS: "var(--pp-primary)",
  BLOG: "var(--pp-primary)",
  RESOURCES: "var(--pp-primary)",
  STUDIO: "var(--pp-primary)",
  "DESIGN SYSTEM": "var(--pp-primary)",
  "COMPONENT-UI": "var(--pp-primary)",
  "COMPONNENT-UI": "var(--pp-primary)",
}

export interface NavItemType {
  label: string
  color?: string
  textColor?: string
  border?: string
  bg?: string
  link: string
}

interface MenuItemProps {
  item: NavItemType
  onClick?: () => void
}

export const MenuItem = ({ item }: MenuItemProps) => {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const isActive =
    item.link === "/" ? currentPath === "/" : currentPath.startsWith(item.link)

  return (
    <Link
      to={item.link}
      className={cn(
        "group relative flex items-center gap-2.5 border bg-background/60 px-2.5 py-1.5 backdrop-blur-xs transition-colors duration-150 hover:bg-accent",
        isActive
          ? "border-pp-primary shadow-xs"
          : "border-border/80 hover:border-foreground/40"
      )}
    >
      {/* Color Square */}
      <div
        className={cn(
          "h-2 w-2 shrink-0 rounded-xs bg-pp-primary transition-transform duration-150"
        )}
        style={{
          boxShadow: isActive ? "0 0 10px var(--pp-primary)" : undefined,
        }}
      />

      {/* Text */}
      <span
        className={cn(
          "text-xs font-medium tracking-wider whitespace-nowrap transition-colors duration-150",
          isActive
            ? "font-semibold text-pp-primary"
            : "text-muted-foreground group-hover:text-foreground"
        )}
      >
        {item.label}
      </span>

      {/* Cyber Active Bottom Bar */}
      {isActive && (
        <span
          className="absolute right-0 bottom-0 left-0 h-[2px] bg-pp-primary transition-all duration-150"
          style={{
            boxShadow: "0 0 8px var(--pp-primary)",
          }}
        />
      )}
    </Link>
  )
}
