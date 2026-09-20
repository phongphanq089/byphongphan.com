import { Link, useRouterState } from "@tanstack/react-router"

import { cn } from "@/shared/lib/utils"

export interface NavItemType {
  label: string
  link: string
}

export interface MenuItemProps {
  item: NavItemType
  onClick?: () => void
  className?: string
}

export function MenuItem({ item, onClick, className }: MenuItemProps) {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const isActive =
    item.link === "/" ? currentPath === "/" : currentPath.startsWith(item.link)

  return (
    <Link
      to={item.link}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-md border bg-background/60 px-2.5 py-1.5 backdrop-blur-xs transition-colors duration-150 hover:bg-accent",
        isActive
          ? "border-pp-primary shadow-xs"
          : "border-border/80 hover:border-foreground/40",
        className
      )}
    >
      <div
        className="size-2 shrink-0 rounded-xs bg-pp-primary transition-transform duration-150"
        style={{
          boxShadow: isActive ? "0 0 10px var(--pp-primary)" : undefined,
        }}
      />

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
