import { ArrowUp, BookOpen, ChevronUp, X } from "lucide-react"

import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/core"
import { TableOfContents, type TOCItem } from "@/shared/ui/system"

interface BlogPostHudProps {
  tocItems: TOCItem[]
  readingProgress: number
  readTime: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onScrollToTop: () => void
}

export function BlogPostHud({
  tocItems,
  readingProgress,
  readTime,
  isOpen,
  onOpenChange,
  onScrollToTop,
}: BlogPostHudProps) {
  return (
    <>
      {/* ── Real-time Glowing Reading Progress Top git  Beam ── */}
      <div
        className="fixed top-0 right-0 left-0 z-50 h-[3px] bg-border/20 backdrop-blur-xs"
        role="progressbar"
        aria-valuenow={readingProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-gradient-to-r from-pp-primary via-pp-primary to-cyan-400 shadow-[0_0_12px_rgba(0,180,216,0.6)] transition-[width] duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* ── Fixed Right Action Console & Slide-Over Drawer (Universal, All Screens) ── */}
      {tocItems.length > 0 && (
        <div className="fixed top-1/2 right-0 z-40 flex -translate-y-1/2 flex-col items-end gap-2">
          {/* Quick Jump-to-Top Floating Circle (appears once scrolled down) */}
          {readingProgress > 12 && (
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              onClick={onScrollToTop}
              className="mr-2 size-8 rounded-full border-border/80 bg-background/90 text-muted-foreground shadow-lg backdrop-blur-md transition-all hover:border-pp-primary hover:text-foreground active:scale-90"
              aria-label="Scroll to top"
            >
              <ArrowUp className="size-3.5" />
            </Button>
          )}

          {/* Main Floating Trigger Tab docked flush to right edge */}
          <Drawer open={isOpen} onOpenChange={onOpenChange} direction="right">
            <DrawerTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="group flex h-11 items-center gap-2 rounded-l-full rounded-r-none border-y border-r-0 border-l border-border/90 bg-background/95 py-2 pr-2.5 pl-3 shadow-2xl backdrop-blur-xl transition-all hover:border-pp-primary/60 hover:text-foreground active:scale-95"
                aria-label="Open Table of Contents and Reading Progress"
              >
                {/* Mini SVG Progress Ring */}
                <div className="relative flex size-5 items-center justify-center">
                  <svg className="size-5 -rotate-90" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="9.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-border/40"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeDasharray={59.7}
                      strokeDashoffset={59.7 - (59.7 * readingProgress) / 100}
                      strokeLinecap="round"
                      className="text-pp-primary transition-all duration-150 ease-out"
                    />
                  </svg>
                  <span className="size-1.5 animate-pulse rounded-full bg-pp-primary" />
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold">
                  <span className="text-foreground">TOC</span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-pp-primary">{readingProgress}%</span>
                </div>

                <ChevronUp className="size-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5" />
              </Button>
            </DrawerTrigger>

            <DrawerContent className="w-[85vw] max-w-sm border-l border-border/80 bg-background/95 shadow-2xl backdrop-blur-xl sm:w-96">
              <DrawerHeader className="flex flex-row items-center justify-between border-b border-border/50 px-5 pt-4 pb-3">
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <BookOpen className="size-4 text-pp-primary" />
                    <DrawerTitle className="text-xs font-bold tracking-wider text-foreground uppercase">
                      READING TELEMETRY & SPEC
                    </DrawerTitle>
                  </div>
                  <DrawerDescription className="text-[11px] text-muted-foreground">
                    {readTime} MIN READ • {tocItems.length} SECTIONS DETECTED
                  </DrawerDescription>
                </div>

                <DrawerClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Close panel"
                  >
                    <X className="size-4" />
                  </Button>
                </DrawerClose>
              </DrawerHeader>

              {/* Drawer Body matching user screenshot perfectly */}
              <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4 pb-8">
                {/* 1. Progress Telemetry Card */}
                <div className="flex flex-col gap-2.5 rounded-xl border border-border/70 bg-card/60 p-3.5 shadow-xs backdrop-blur-md">
                  <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <span className="size-1.5 animate-pulse rounded-full bg-pp-primary" />
                      <span>PROGRESS</span>
                    </span>
                    <span className="font-bold text-pp-primary">
                      {readingProgress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pp-primary via-pp-primary to-cyan-400 transition-all duration-150 ease-out"
                      style={{ width: `${readingProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground/75">
                    <span>{readTime} MIN READ</span>
                    <span>{tocItems.length} SECTIONS</span>
                  </div>
                </div>

                {/* 2. Table of Contents Card */}
                <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 shadow-xs backdrop-blur-md">
                  <TableOfContents
                    items={tocItems}
                    scrollOffset={88}
                    title="ON THIS PAGE"
                    icon={<BookOpen className="size-3.5 opacity-80" />}
                    onItemClick={() => onOpenChange(false)}
                  />
                </div>

                {/* 3. Jump to Top Action Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => {
                    onScrollToTop()
                    onOpenChange(false)
                  }}
                  className="w-full gap-2 border-border/70 bg-card/40 text-xs font-medium text-foreground hover:border-pp-primary hover:text-foreground"
                >
                  <ArrowUp className="size-3.5" />
                  <span>Jump to Top ↑</span>
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      )}
    </>
  )
}
