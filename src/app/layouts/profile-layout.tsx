import { Outlet, useRouterState } from "@tanstack/react-router"

import { RailScrollScrubber } from "@/registry/animated/rail-scroll-scrubber"
import { HOME_TOC_ITEMS } from "@/shared/config"
import { useScrollToTop } from "@/shared/hooks/use-scroll-to-top"
import { useTocRailSections } from "@/shared/hooks/use-toc-rail-sections"
import { EdgeBlur } from "@/shared/ui/system/edge-blur"
import ProgressWhileScroll from "@/shared/ui/system/progress-while-scroll"
import { Footer } from "@/widgets/profile-footer"
import { Header } from "@/widgets/profile-header"
import BottomMenu from "@/widgets/profile-header/bottom-menu"

import {
  GridContainer,
  type GridContainerMaxWidth,
  GridLayoutContext,
} from "./grid-layout"

export function ProfileLayout({ children }: { children?: React.ReactNode }) {
  // Reset scroll position immediately on route changes to prevent delayed scrolling
  // caused by scroll restoration or smooth-scroll behavior.
  useScrollToTop()

  const currentPath = useRouterState({ select: (s) => s.location.pathname })
  const isHome =
    currentPath === "/" ||
    currentPath === "" ||
    currentPath.replace(/\/+$/, "") === ""
  const isBlocks =
    currentPath === "/blocks" ||
    currentPath.startsWith("/blocks/") ||
    currentPath === "/block" ||
    currentPath.startsWith("/block/")
  const layoutMaxWidth: GridContainerMaxWidth = isBlocks ? "wide" : "default"

  const homeRailSections = useTocRailSections(HOME_TOC_ITEMS)

  return (
    <GridLayoutContext.Provider value={{ maxWidth: layoutMaxWidth }}>
      <div className="relative flex min-h-screen w-full overflow-x-clip bg-background text-foreground selection:bg-primary/20">
        {isHome && (
          <RailScrollScrubber
            sections={homeRailSections}
            accentColor="var(--primary)"
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="sticky top-0 z-50 w-full">
            <GridContainer
              borderTop={false}
              borderBottom={true}
              className="flex justify-center p-0"
            >
              <Header />
            </GridContainer>
          </div>

          {/* Bottom Floating Dynamic Dock & Scroll Progress */}
          <div className="mf:translate-x-0 fixed bottom-6 left-1/2 z-50 -translate-x-1/2 lg:right-8 lg:bottom-8 lg:left-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <BottomMenu />
              <ProgressWhileScroll />
            </div>
          </div>

          <main className="flex w-full flex-1 flex-col overflow-x-clip">
            {children ?? <Outlet />}
          </main>

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
