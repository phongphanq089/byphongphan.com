import { Link } from "@tanstack/react-router"
import {
  BookOpen,
  Code2,
  ExternalLink,
  Maximize2,
  Minimize2,
  Moon,
  PanelLeft,
  Search,
  Star,
  Sun,
} from "lucide-react"
import { useEffect, useState } from "react"

import { DrawerTrigger } from "@/registry/ui/drawer"
import { siteConfig } from "@/shared/config"
import { cn } from "@/shared/lib/utils"
import { useTheme } from "@/shared/providers/theme-provider"
import { Kbd } from "@/shared/ui/core"
import { openCommandMenu } from "@/widgets/command-menu"

import { useStudioLayout } from "../hooks/studio-layout-context"
import { studioSidebarHandle } from "../hooks/studio-sidebar-handle"

export function StudioHeader() {
  const { isSidebarOpen, panel, toggleDocs, toggleCode, activeItem } =
    useStudioLayout()
  // Blocks ship without MDX docs — hide the Docs toggle there, keep Code only
  const hasDocs = activeItem !== null && activeItem.collection !== "blocks"
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const handleToggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await document.documentElement.requestFullscreen()
      }
    } catch {
      // Fullscreen might be blocked by browser policy
    }
  }

  return (
    <header className="relative z-30 flex h-11 shrink-0 items-center justify-between border-b border-border/70 bg-background/80 px-2.5 backdrop-blur-sm sm:px-4">
      {/* Left: Sidebar toggle + Brand identity (No breadcrumb!) */}
      <div className="flex items-center gap-2.5">
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
          to="/ui"
          className="group flex items-center gap-1.5 font-heading text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-pp-primary"
        >
          <span className="italic">
            byphongphan
            <span className="font-normal text-foreground/40">/</span>
            <span>ui</span>
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/60 transition-colors group-hover:text-foreground">
            (...)
          </span>
        </Link>
      </div>

      {/* Right: Quick actions cluster */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        {/* Search / Command palette */}
        <button
          type="button"
          onClick={openCommandMenu}
          aria-label="Open command palette (Ctrl+K)"
          title="Search registry (Ctrl+K)"
          className="hidden h-7 items-center gap-1.5 rounded-md px-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:inline-flex"
        >
          <Search className="size-3.5" aria-hidden="true" />
          <Kbd className="h-4 min-w-4 px-1 text-[9px]">⌘K</Kbd>
        </button>

        {/* Fullscreen toggle */}
        <button
          type="button"
          onClick={handleToggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {isFullscreen ? (
            <Minimize2 className="size-3.5" aria-hidden="true" />
          ) : (
            <Maximize2 className="size-3.5" aria-hidden="true" />
          )}
        </button>

        {/* Panel toggles — only relevant on a detail page */}
        {activeItem ? (
          <>
            {hasDocs ? (
              <button
                type="button"
                onClick={toggleDocs}
                aria-label="View docs"
                title="Toggle documentation panel (F)"
                aria-pressed={panel === "docs"}
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                  panel === "docs" && "bg-accent text-foreground shadow-xs"
                )}
              >
                <BookOpen className="size-3.5" aria-hidden="true" />
              </button>
            ) : null}

            <button
              type="button"
              onClick={toggleCode}
              aria-label="View code"
              title="Toggle source code view (C)"
              aria-pressed={panel === "code"}
              className={cn(
                "inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                panel === "code" && "bg-accent text-foreground shadow-xs"
              )}
            >
              <Code2 className="size-3.5" aria-hidden="true" />
            </button>
          </>
        ) : null}

        {/* External project link */}
        <a
          href={siteConfig.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View repository on GitHub"
          title="Open repository on GitHub"
          className="hidden size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none xs:inline-flex"
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>

        {/* GitHub Star button */}
        <a
          href={siteConfig.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star on GitHub"
          title="Star byphongphan/ui on GitHub"
          className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border/70 bg-muted/30 px-2 font-sans text-[11px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <Star
            className="size-3 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] tabular-nums">265</span>
        </a>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {isDark ? (
            <Sun className="size-3.5" aria-hidden="true" />
          ) : (
            <Moon className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  )
}
