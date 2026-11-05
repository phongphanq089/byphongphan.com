import { Link, useRouterState } from "@tanstack/react-router"
import { cn } from "cn"
import {
  BookmarkCheck,
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  Library,
  LogOut,
  SlidersHorizontal,
  Tags,
} from "lucide-react"
import { useEffect } from "react"

import {
  Badge,
  PPPixelMark,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/shared/ui"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const mainNavItems: NavItem[] = [
  {
    title: "Overview",
    url: "/admin",
    icon: LayoutDashboard,
  },
]

const contentNavItems: NavItem[] = [
  {
    title: "Blog Posts",
    url: "/admin/posts",
    icon: FileText,
  },
  {
    title: "Series & Groups",
    url: "/admin/groups",
    icon: Library,
  },
  {
    title: "Categories & Tags",
    url: "/admin/categories",
    icon: Tags,
  },
]

const registryNavItems: NavItem[] = [
  {
    title: "Resources & Tools",
    url: "/admin/resources",
    icon: BookmarkCheck,
  },
]

const systemNavItems: NavItem[] = [
  {
    title: "Site Settings & SEO",
    url: "/admin/settings",
    icon: SlidersHorizontal,
  },
]

export function SidebarAdmin() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname })
  const { state, setOpenMobile, isMobile } = useSidebar()

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [currentPath, isMobile, setOpenMobile])

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const isItemActive = (url: string) => {
    if (url === "/admin") {
      return currentPath === "/admin" || currentPath === "/admin/"
    }
    return currentPath.startsWith(url)
  }

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="top-14! h-[calc(100svh-3.5rem)]! border-r border-border/80"
    >
      {/* ─── WORKSPACE / BRAND HEADER ─── */}
      <SidebarHeader className="border-b border-border/70 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="byphongphan - Admin Workspace"
              render={<Link to="/admin" />}
              onClick={handleNavClick}
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-sm border bg-primary/10 text-primary">
                <PPPixelMark className="text-primary" />
              </div>
              <div className="grid flex-1 text-left text-xs leading-tight">
                <span className="truncate font-semibold text-foreground">
                  byphongphan
                </span>
                <span className="truncate text-[10px] text-muted-foreground">
                  Admin Workspace
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2.5 py-3">
        {/* Main Dashboard */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const active = isItemActive(item.url)
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      render={<Link to={item.url} />}
                      onClick={handleNavClick}
                    >
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Management */}
        <SidebarGroup className="mt-4 p-0">
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Content & Blog
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-1">
            <SidebarMenu>
              {contentNavItems.map((item) => {
                const active = isItemActive(item.url)
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      render={<Link to={item.url} />}
                      onClick={handleNavClick}
                    >
                      <Icon className="size-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-auto text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Resources & Registry */}
        <SidebarGroup className="mt-4 p-0">
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Showcase & Registry
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-1">
            <SidebarMenu>
              {registryNavItems.map((item) => {
                const active = isItemActive(item.url)
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      render={<Link to={item.url} />}
                      onClick={handleNavClick}
                    >
                      <Icon className="size-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="outline"
                          className="ml-auto border-border bg-muted/40 px-1.5 py-0 text-[10px] text-muted-foreground"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4 p-0">
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            System & Media
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-1">
            <SidebarMenu>
              {systemNavItems.map((item) => {
                const active = isItemActive(item.url)
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      isActive={active}
                      tooltip={item.title}
                      render={<Link to={item.url} />}
                      onClick={handleNavClick}
                    >
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Media Assets (ImageKit)"
                  render={
                    <a
                      href="https://imagekit.io/dashboard"
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                  onClick={handleNavClick}
                >
                  <Images className="size-4" />
                  <span className="flex-1">ImageKit Media</span>
                  <ExternalLink className="size-3 text-muted-foreground/60" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <button
          type="button"

          aria-label="Log out"
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-md px-2",
            "text-sm font-medium text-sidebar-foreground/70",
            "transition-colors duration-150",
            "hover:bg-destructive/10 hover:text-destructive",
            "dark:hover:bg-destructive/20",
            "focus-visible:ring-2 focus-visible:outline-none",
            "focus-visible:ring-sidebar-ring",
            "active:bg-destructive/15",
            state === "collapsed" && "justify-center px-0"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {state === "expanded" && <span>Log out</span>}
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default SidebarAdmin
