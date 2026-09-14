import { Link, useRouterState } from "@tanstack/react-router"
import {
  BookmarkCheck,
  Boxes,
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  Library,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
  Tags,
} from "lucide-react"

import {
  Badge,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
  {
    title: "Registry Hub",
    url: "/admin/registry",
    icon: Boxes,
    badge: "CLI",
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
  const router = useRouterState()
  const currentPath = router.location.pathname
  const { toggleSidebar, state } = useSidebar()

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
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={
                        active
                          ? "bg-primary font-medium text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    >
                      <Link to={item.url}>
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
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
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={
                        active
                          ? "bg-primary font-medium text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    >
                      <Link to={item.url}>
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
                      </Link>
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
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={
                        active
                          ? "bg-primary font-medium text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    >
                      <Link to={item.url}>
                        <Icon className="size-4" />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant="outline"
                            className="ml-auto border-primary/40 bg-primary/10 px-1.5 py-0 text-[10px] text-primary"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System & Media */}
        <SidebarGroup className="mt-auto p-0">
          <SidebarGroupLabel className="px-2 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            System & Media
          </SidebarGroupLabel>
          <SidebarGroupContent className="pt-1">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Media Assets (ImageKit)">
                  <a
                    href="https://imagekit.io/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Images className="size-4" />
                    <span className="flex-1">ImageKit Media</span>
                    <ExternalLink className="size-3 text-muted-foreground/60" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {systemNavItems.map((item) => {
                const active = isItemActive(item.url)
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={
                        active
                          ? "bg-primary font-medium text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    >
                      <Link to={item.url}>
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Collapse Button */}
      <SidebarFooter className="border-t border-border/80 p-2">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          {state === "expanded" ? (
            <>
              <PanelLeftClose className="size-4" />
              <span>Collapse menu</span>
            </>
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default SidebarAdmin
