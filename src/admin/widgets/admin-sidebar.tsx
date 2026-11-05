import { Link, useRouterState } from "@tanstack/react-router"
import {
  BookmarkCheck,
  ChevronsUpDown,
  ExternalLink,
  FileText,
  Home,
  Images,
  LayoutDashboard,
  Library,
  LogOut,
  SlidersHorizontal,
  Tags,
} from "lucide-react"
import { useEffect } from "react"

import { useAdminConfirm } from "@/admin/components"
import {
  Avatar,
  AvatarFallback,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
  const { setOpenMobile, isMobile } = useSidebar()
  const { confirm, ConfirmDialog } = useAdminConfirm()

  const handleLogout = async () => {
    const isConfirmed = await confirm({
      title: "Log out of Admin Workspace?",
      description:
        "Are you sure you want to log out? You will need to sign in again to access the dashboard and content management.",
      variant: "warning",
      confirmText: "Log out",
      cancelText: "Cancel",
      icon: <LogOut className="size-5" />,
    })

    if (!isConfirmed) return

    window.location.href = "/"
  }

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
      variant="inset"
      collapsible="icon"
      className="[&_[data-slot=sidebar-inner]]:bg-transparent"
    >
      {/* ─── WORKSPACE / BRAND HEADER ─── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="byphongphan - Admin Workspace"
              render={<Link to="/admin" />}
              onClick={handleNavClick}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                <PPPixelMark className="size-4 text-primary-foreground" />
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                className="w-full"
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    tooltip={{
                      children: "Phong Phan (Admin)",
                      side: "right",
                    }}
                  />
                }
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary/15 text-xs font-bold text-primary">
                    PP
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-xs leading-tight">
                  <span className="truncate font-semibold text-foreground">
                    Phong Phan
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    phongphanq089@gmail.com
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg text-xs"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
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
                    render={<Link to="/" target="_blank" />}
                  >
                    <Home className="mr-2 size-3.5 text-muted-foreground" />
                    <span>View Public Site</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 size-3.5" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
      <ConfirmDialog />
    </Sidebar>
  )
}

export default SidebarAdmin
