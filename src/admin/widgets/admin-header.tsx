import { Link, useRouterState } from "@tanstack/react-router"
import {
  ExternalLink,
  Home,
  LogOut,
  Moon,
  Search,
  SlidersHorizontal,
  Sun,
} from "lucide-react"

import { useTheme } from "@/shared/providers/theme-provider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  SidebarTrigger,
} from "@/shared/ui"
import { openCommandMenu } from "@/widgets/command-menu"

const ROUTE_CONFIG: Record<string, { group?: string; title: string }> = {
  "/admin": { title: "Overview" },
  "/admin/": { title: "Overview" },
  "/admin/posts": { group: "Content & Blog", title: "Blog Posts" },
  "/admin/groups": { group: "Content & Blog", title: "Series & Groups" },
  "/admin/categories": { group: "Content & Blog", title: "Categories & Tags" },
  "/admin/resources": {
    group: "Showcase & Registry",
    title: "Resources & Tools",
  },
  "/admin/registry": { group: "Showcase & Registry", title: "Registry Hub" },
  "/admin/settings": { group: "System & Media", title: "Site Settings & SEO" },
}

export function AdminHeader() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname })
  const { theme, setTheme } = useTheme()

  // Match the current route or find prefix match
  const matchedConfig = ROUTE_CONFIG[currentPath] ||
    Object.entries(ROUTE_CONFIG).find(
      ([path]) => path !== "/admin" && currentPath.startsWith(path)
    )?.[1] || { title: "Overview" }

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between border-b border-border/70 bg-accent/95 px-4 backdrop-blur-md transition-all">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 size-8 rounded-lg hover:bg-muted" />

        <Separator
          orientation="vertical"
          className="mr-1 hidden h-4 bg-border lg:block"
        />

        <Breadcrumb className="hidden text-xs lg:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/admin" />}>
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            {matchedConfig.group && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="hidden xl:inline-flex">
                  <span className="text-muted-foreground/70">
                    {matchedConfig.group}
                  </span>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                {matchedConfig.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* ─── CENTER/RIGHT: Quick Search Command Bar ─── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openCommandMenu}
          className="flex h-8 w-40 cursor-pointer items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 text-xs text-muted-foreground transition-all hover:border-border hover:bg-muted/70 sm:w-56 lg:w-72"
        >
          <div className="flex items-center gap-2">
            <Search className="size-3.5 text-muted-foreground/70" />
            <span className="truncate">Type to search...</span>
          </div>
          <kbd className="pointer-events-none hidden rounded-md border border-border/80 bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            Ctrl K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="size-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>

        {/* View Public Live Site Button */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="hidden h-8 gap-1.5 rounded-lg border-border/80 bg-background/50 px-2.5 text-xs font-medium text-foreground hover:bg-muted sm:inline-flex"
        >
          <Link to="/" target="_blank">
            <span>Live Site</span>
            <ExternalLink className="size-3 text-muted-foreground" />
          </Link>
        </Button>

        {/* User Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border/80 bg-muted/60 text-xs font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none"
            aria-label="User menu"
          >
            PP
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 text-xs">
            <div className="flex flex-col space-y-1 p-2">
              <p className="leading-none font-semibold text-foreground">
                Phong Phan
              </p>
              <p className="text-[11px] leading-none text-muted-foreground">
                phongphanq089@gmail.com
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                render={<Link to="/admin/settings" />}
              >
                <SlidersHorizontal className="mr-2 size-3.5 text-muted-foreground" />
                <span>Site Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                render={<Link to="/" />}
              >
                <Home className="mr-2 size-3.5 text-muted-foreground" />
                <span>View Public Site</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                window.location.href = "/"
              }}
            >
              <LogOut className="mr-2 size-3.5" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
