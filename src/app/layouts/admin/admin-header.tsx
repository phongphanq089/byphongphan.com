import { Link } from "@tanstack/react-router"
import {
  ExternalLink,
  Home,
  LogOut,
  Search,
  SlidersHorizontal,
} from "lucide-react"

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between border-b border-border/70 bg-accent/95 px-4 backdrop-blur-md transition-all">
      {/* ─── LEFT: Logo & Breadcrumbs / Project Selector ─── */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 size-8 rounded-lg hover:bg-muted" />

        {/* Brand Icon */}
        <Link
          to="/admin"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary font-black text-primary-foreground shadow-md shadow-primary/25"
        >
          <span className="text-xs tracking-tighter">PP</span>
        </Link>

        {/* Workspace info */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-foreground">phong phan</span>
        </div>
      </div>

      {/* ─── CENTER: Quick Search Command Bar ─── */}
      <div className="hidden items-center md:flex">
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", {
              key: "k",
              metaKey: true,
              ctrlKey: true,
            })
            window.dispatchEvent(event)
          }}
          className="flex h-8 w-64 items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 text-xs text-muted-foreground transition-all hover:border-border hover:bg-muted/70 lg:w-80"
        >
          <div className="flex items-center gap-2">
            <Search className="size-3.5 text-muted-foreground/70" />
            <span>Search admin...</span>
          </div>
          <kbd className="pointer-events-none rounded-md border border-border/80 bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* ─── RIGHT: Status & Quick Controls ─── */}
      <div className="flex items-center gap-2.5">
        {/* Neon Status Badge */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 sm:flex">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                <span>Neon DB: Online</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              PostgreSQL Serverless (Singapore Region)
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* View Public Live Site Button */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 gap-1.5 rounded-lg border-border/80 bg-background/50 px-2.5 text-xs font-medium text-foreground hover:bg-muted"
        >
          <Link to="/" target="_blank">
            <span>Live Site</span>
            <ExternalLink className="size-3 text-muted-foreground" />
          </Link>
        </Button>

        {/* User Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/60 text-xs font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none">
              PP
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 text-xs">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="leading-none font-semibold text-foreground">
                  Phong Phan
                </p>
                <p className="text-[11px] leading-none text-muted-foreground">
                  phongphanq089@gmail.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/admin/settings">
                  <SlidersHorizontal className="mr-2 size-3.5 text-muted-foreground" />
                  <span>Site Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/">
                  <Home className="mr-2 size-3.5 text-muted-foreground" />
                  <span>View Public Site</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
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
