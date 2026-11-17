import { Link } from "@tanstack/react-router"
import { Globe, PanelLeft } from "lucide-react"

import { DrawerTrigger } from "@/registry/ui/drawer"
import { cn } from "@/shared/lib/utils"
import { ModeToggle, PPPixelMark } from "@/shared/ui"
import { CommandMenuTrigger } from "@/widgets/command-menu"
import { GitHubStarButton } from "@/widgets/profile-header"

import { useStudioLayout } from "../hooks/studio-layout-context"
import { studioSidebarHandle } from "../hooks/studio-sidebar-handle"
import { useStudioDisplayUrl } from "../hooks/use-studio-display-url"

/**
 * Global studio header with integrated browser chrome:
 * - Left: macOS traffic lights + sidebar toggle + brand identity
 * - Center: Real browser address bar showing current host & path + JSON link
 * - Right: Search (⌘K), GitHub Star, Theme toggle
 */
export function StudioHeader() {
  const { isSidebarOpen } = useStudioLayout()
  const displayUrl = useStudioDisplayUrl()

  return (
    <header className="relative z-30 flex h-13 shrink-0 items-center justify-between gap-2 border-b border-border/70 bg-background/80 px-2.5 backdrop-blur-sm sm:px-4">
      {/* Left: Window traffic lights + Sidebar toggle + Brand identity */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        {/* Sidebar toggle — Base UI DrawerTrigger manages aria-expanded/aria-controls */}
        <DrawerTrigger
          handle={studioSidebarHandle}
          render={
            <button
              type="button"
              aria-label="Toggle sidebar (Ctrl+B)"
              title="Toggle sidebar (Ctrl+B)"
              className={cn(
                "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                isSidebarOpen && "bg-accent/60 text-foreground"
              )}
            />
          }
        >
          <PanelLeft
            className={cn(
              "size-4 transition-transform duration-300",
              !isSidebarOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </DrawerTrigger>

        <Link
          to="/"
          aria-label="Phong Phan — home"
          className="flex size-8 shrink-0 items-center justify-center sm:size-9"
        >
          <PPPixelMark className="size-full text-pp-primary" variant="glow" />
        </Link>
      </div>

      {/* Center: Real Browser URL Bar */}
      <div className="mx-1 flex h-7 max-w-md min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border border-border/60 bg-muted px-2.5 font-mono text-[10px] text-muted-foreground transition-colors hover:border-border hover:bg-muted/50 max-md:hidden sm:mx-4">
        <div className="flex min-w-0 items-center gap-1.5">
          <Globe
            className="size-3 shrink-0 text-muted-foreground/70"
            aria-hidden="true"
          />
          <span className="truncate" title={displayUrl}>
            {displayUrl}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        <CommandMenuTrigger compact />
        <GitHubStarButton />
        <ModeToggle />
      </div>
    </header>
  )
}
