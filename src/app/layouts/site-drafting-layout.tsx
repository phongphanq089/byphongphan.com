import { Outlet, useRouterState } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { FullWidthCaliperRuler } from "@/features/home/components/full-width-caliper-ruler"
import { ScrollIndicator } from "@/registry/animated/scroll-indicator"
import { HOME_TOC_ITEMS } from "@/shared/config"
import { useScrollPosition } from "@/shared/hooks/use-scroll-position"
import { useScrollToTop } from "@/shared/hooks/use-scroll-to-top"
import { useTocRailSections } from "@/shared/hooks/use-toc-rail-sections"
import { cn } from "@/shared/lib/utils"
import { EdgeBlur } from "@/shared/ui/system/edge-blur"
import ProgressWhileScroll from "@/shared/ui/system/progress-while-scroll"
import { Header } from "@/widgets"
import { Footer } from "@/widgets/profile-footer"
import BottomMenu from "@/widgets/profile-header/bottom-menu"

import { type GridContainerMaxWidth, GridLayoutContext } from "./grid-layout"

export interface SiteDraftingLayoutProps {
  children?: React.ReactNode
}

/**
 * Unified Master Site Layout (Architectural Drafting Shell)
 *
 * Serves as the single root layout for the entire `_site` route tree:
 * - Home route (`/`):
 *   - Edge-to-edge CAD Caliper Ruler at #banner
 *   - Origin & Time live status bar
 *   - Continuous 6-hairline architectural drafting spine
 *   - ProfileHeader floating island (hidden at top, revealed when scrolled > 300px)
 *   - LineNav-style ScrollIndicator on the right rail
 * - Subpages (`/blog`, `/resources`, `/mcp`, etc.):
 *   - Standard sticky ProfileHeader for immediate navigation
 *   - Full-width content with responsive GridContainer maxWidth
 * - All routes:
 *   - Bottom floating dynamic dock (BottomMenu + ProgressWhileScroll)
 *   - EdgeBlur
 *   - Production Footer with PhongPhan spotlight watermark
 */
export function SiteDraftingLayout({ children }: SiteDraftingLayoutProps) {
  useScrollToTop()

  const [time, setTime] = useState<string>("")
  const [date, setDate] = useState<string>("")

  const currentPath = useRouterState({ select: (s) => s.location.pathname })
  const isHome =
    currentPath === "/" ||
    currentPath === "" ||
    currentPath.replace(/\/+$/, "") === ""
  const isBlocks =
    currentPath === "/ui/blocks" || currentPath.startsWith("/ui/blocks/")
  const isDocsDetail = /^\/ui\/[^/]+\/[^/]+/.test(currentPath)

  const layoutMaxWidth: GridContainerMaxWidth = isBlocks
    ? "wide"
    : isDocsDetail
      ? "6xl"
      : "default"

  const homeRailSections = useTocRailSections(HOME_TOC_ITEMS)
  const { y } = useScrollPosition()
  const isHomeHeaderVisible = y > 300

  // Live Asia/Ho_Chi_Minh clock for the architectural origin readout
  useEffect(() => {
    if (!isHome) return

    const updateTime = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour: "2-digit",
        minute: "2-digit",
      })
      const dateStr = now.toLocaleDateString("en-GB", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      setTime(timeStr)
      setDate(dateStr)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [isHome])

  return (
    <GridLayoutContext.Provider value={{ maxWidth: layoutMaxWidth }}>
      <div className="relative min-h-screen w-full overflow-x-clip bg-background font-sans text-foreground antialiased selection:bg-pp-secondary/25">
        {/* ─── FLOATING PROFILE HEADER ─── */}
        {/* On Home: hidden by default at top, slides down when y > 300px */}
        {/* On Subpages: sticky at top for immediate navigation & search */}
        <div
          className={cn(
            "z-50 w-full transition-all duration-300 ease-out select-none",
            isHome
              ? cn(
                  "fixed top-0 right-0 left-0",
                  isHomeHeaderVisible
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-full opacity-0"
                )
              : "sticky top-0 overflow-visible"
          )}
        >
          <Header />
        </div>

        {/* ─── SCROLL INDICATOR RAIL (LINENAV PROXIMITY WAVE) ─── */}
        {isHome && (
          <ScrollIndicator
            sections={homeRailSections}
            className="fixed top-1/2 right-2 z-40 flex h-[340px] -translate-y-1/2 sm:right-6 sm:h-[440px]"
          />
        )}

        {/* ─── CONTINUOUS ARCHITECTURAL SPINE (6 VERTICAL HAIRLINES TOP TO BOTTOM) ─── */}
        {isHome && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 mx-auto w-full max-w-[1024px] px-4 select-none sm:px-6"
          >
            <div className="relative size-full">
              <div className="absolute top-0 bottom-0 left-0 w-px bg-border/40" />
              <div className="absolute top-0 bottom-0 left-[224px] hidden w-px bg-border/40 lg:block" />
              <div className="absolute top-0 bottom-0 left-[272px] hidden w-px bg-border/40 lg:block" />
              <div className="absolute top-0 bottom-0 left-[800px] hidden w-px bg-border/40 lg:block" />
              <div className="absolute top-0 bottom-0 left-[848px] hidden w-px bg-border/40 lg:block" />
              <div className="absolute top-0 right-0 bottom-0 w-px bg-border/40" />
            </div>
          </div>
        )}

        {/* ─── TOP FULL-WIDTH CAD CALIPER RULER (EDGE-TO-EDGE) ─── */}
        {isHome && (
          <div id="banner" className="relative z-10">
            <FullWidthCaliperRuler />
          </div>
        )}

        {/* ─── ARCHITECTURAL ORIGIN & TIME BAR (HOME ONLY) ─── */}
        {isHome && (
          <div className="relative z-10 mx-auto w-full max-w-[1024px] px-4 pt-8 pb-4 select-none sm:px-6">
            <div className="relative flex items-start justify-end pb-8">
              <div className="pr-4 text-right font-mono text-[10px] leading-tight text-muted-foreground sm:pr-6">
                <div className="text-xs text-foreground sm:text-sm">
                  From Ninh Hoà,
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  {date || "23 November 2026"}
                </div>
                <div className="mt-1 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground/80">
                  <span>{time || "16:00"}</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-muted-foreground">blue hour</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── MAIN CONTENT VIEWPORT ─── */}
        <main className="relative z-10 flex w-full flex-1 flex-col overflow-x-clip">
          {children ?? <Outlet />}
        </main>

        {/* ─── BOTTOM FLOATING DYNAMIC DOCK ─── */}
        <div className="mf:translate-x-0 fixed bottom-6 left-1/2 z-50 -translate-x-1/2 select-none lg:right-8 lg:bottom-8 lg:left-auto xl:right-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <BottomMenu />
            <ProgressWhileScroll />
          </div>
        </div>

        {/* ─── FULL-WIDTH PRODUCTION FOOTER ─── */}
        <div className="relative z-10 w-full border-t border-border pt-12">
          <Footer />
        </div>
      </div>

      {/* Mobile EdgeBlur — smaller height, visible below md */}
      <div className="md:hidden">
        <EdgeBlur position="bottom" height={30} />
      </div>
      {/* Desktop EdgeBlur — taller height, visible at md+ */}
      <div className="hidden md:block">
        <EdgeBlur position="bottom" height={70} />
      </div>
    </GridLayoutContext.Provider>
  )
}
