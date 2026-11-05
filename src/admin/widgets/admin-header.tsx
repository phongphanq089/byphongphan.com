import { Link, useRouterState } from "@tanstack/react-router"
import { ExternalLink, Moon, Search, Sun } from "lucide-react"

import { useTheme } from "@/shared/providers/theme-provider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
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
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border/70 bg-background/95 px-4 backdrop-blur-md transition-all">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 size-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" />

        <Separator
          orientation="vertical"
          className="mr-1 hidden h-4 bg-border/80 sm:block"
        />

        <Breadcrumb className="hidden text-xs sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to="/admin" />}>
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            {matchedConfig.group && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="hidden md:inline-flex">
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

      {/* ─── RIGHT: Quick Search, Theme Toggle, Live Site ─── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openCommandMenu}
          className="flex h-8 w-36 cursor-pointer items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-2.5 text-xs text-muted-foreground transition-all hover:border-border hover:bg-muted/70 sm:w-52 lg:w-64"
        >
          <div className="flex items-center gap-2">
            <Search className="size-3.5 text-muted-foreground/70" />
            <span className="truncate">Search...</span>
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
          className="hidden h-8 gap-1.5 rounded-lg border-border/80 bg-background/50 px-2.5 text-xs font-medium text-foreground hover:bg-muted md:inline-flex"
        >
          <Link to="/" target="_blank">
            <span>Live Site</span>
            <ExternalLink className="size-3 text-muted-foreground" />
          </Link>
        </Button>
      </div>
    </header>
  )
}
