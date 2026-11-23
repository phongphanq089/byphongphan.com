import React, { useEffect, useState } from "react"

import { ScrollIndicator } from "@/registry/animated/scroll-indicator"
import type { TOCItemConfig } from "@/shared/config"
import { useScrollPosition } from "@/shared/hooks/use-scroll-position"
import { useTocRailSections } from "@/shared/hooks/use-toc-rail-sections"
import { cn } from "@/shared/lib/utils"
import { Skeleton } from "@/shared/ui/core/skeleton"
import { PPPixelMark } from "@/shared/ui/icons/pp-pixel-mark"
import { Header } from "@/widgets"
import { Footer } from "@/widgets/profile-footer"

import { BlocksSchematicShowcase } from "./components/blocks-schematic-showcase"
import { ComponentsFullWidthShowcase } from "./components/components-fullwidth-showcase"
import { FullWidthCaliperRuler } from "./components/full-width-caliper-ruler"

const PREVIEW_TOC_ITEMS: TOCItemConfig[] = [
  {
    title: "Banner Hero",
    url: "#banner",
    depth: 1,
    description: "CAD caliper ruler and drafting header",
  },
  {
    title: "About Me",
    url: "#about",
    depth: 1,
    description: "Biography, profile mark & architectural banner",
  },
  {
    title: "Tech Stack",
    url: "#tech-stack",
    depth: 1,
    description: "Core technologies, libraries & engineering stack",
  },
  {
    title: "UI Components Section",
    url: "#components-ui",
    depth: 1,
    description: "Interactive component showpieces & edge-to-edge bento",
  },
  {
    title: "Blocks Section",
    url: "#blocks",
    depth: 1,
    description: "Composed, ready-to-drop page blocks schematic",
  },
  {
    title: "Hooks Section",
    url: "#hooks",
    depth: 1,
    description: "Type-safe, copy-paste React hooks",
  },
  {
    title: "Writing Section",
    url: "#blog",
    depth: 1,
    description: "Articles, blogs, and engineering notes",
  },
  {
    title: "Resources Section",
    url: "#resources",
    depth: 1,
    description: "Curated tools and developer resources",
  },
  {
    title: "Location (Viet Nam)",
    url: "#vietnam-map",
    depth: 1,
    description: "Geographic radar spotlight of Ninh Hoà & signed mark",
  },
]

/**
 * Architectural Editorial Layout for byphongphan.com
 * Dynamic, mutating layout structure:
 *
 * 1. Top Section: 1024px 5-track Swiss Drafting Grid
 *    - Ruler: 224 | 48 | 528 | 48 | 176
 *    - I ABOUT (Avatar PL. 1, Name, Bio, Socials)
 *    - II TECH STACK (Dotted leader lines)
 *    - III PRODUCTION BLOCKS (Full 2x2 Blueprint Schematic Grid)
 * 2. Section IV: FULL-WIDTH BREAKOUT — UI COMPONENTS SHOWCASE
 *    - Edge-to-edge expansive 3x3 Bento Showcase Grid matching screenshot
 * 3. Bottom Section: 1024px Swiss Drafting Grid
 *    - V HOOKS
 *    - VI WRITING
 *    - VII RESOURCES
 *    - VIII LOCATION & SIGNED (PL. 2 Territorial radar plate + Red signature)
 * 4. Full-Width Footer: Existing production Footer with PhongPhan spotlight watermark
 */
export function HomePreviewPage() {
  const [time, setTime] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const { y } = useScrollPosition()
  const showHeader = y > 300
  const railSections = useTocRailSections(PREVIEW_TOC_ITEMS)

  useEffect(() => {
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
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-background pt-0 font-sans text-foreground antialiased selection:bg-pp-secondary/25">
      {/* ─── FLOATING PROFILE HEADER (HIDDEN BY DEFAULT, REVEALED WHEN SCROLLED PAST ~300PX) ─── */}
      <div
        className={cn(
          "fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300 ease-out",
          showHeader
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        )}
      >
        <Header />
      </div>

      {/* ─── SCROLL INDICATOR RAIL ─── */}
      <ScrollIndicator
        sections={railSections}
        className="fixed top-1/2 right-2 z-40 flex h-[340px] -translate-y-1/2 sm:right-6 sm:h-[440px]"
      />

      {/* ─── CONTINUOUS ARCHITECTURAL SPINE (6 VERTICAL HAIRLINES TOP TO BOTTOM) ─── */}
      {/* Runs continuously across the entire document without breaks or missing chunks */}
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

      {/* ─── FULL-WIDTH CAD CALIPER RULER (EDGE-TO-EDGE VIEWPORT MEASUREMENT) ─── */}
      <div id="banner">
        <FullWidthCaliperRuler />
      </div>

      {/* ─── PART 1: 1024px ARCHITECTURAL BLUEPRINT SHEET (UPPER CONTAINER) ─── */}
      <div className="relative z-10 mx-auto w-full max-w-[1024px] px-4 pt-8 sm:px-6">
        {/* Top Header: Origin & Time on Right */}
        <div className="relative flex items-start justify-end pb-12 select-none">
          <div className="pr-4 text-right font-mono text-[10px] leading-tight text-muted-foreground sm:pr-6">
            <div className="font-serif text-xs text-foreground italic sm:text-sm">
              From Ninh Hoà,
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {date || "21 November 2026"}
            </div>
            <div className="mt-1 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground/80">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              <span>{time || "11:00"}</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-muted-foreground">blue hour</span>
            </div>
          </div>
        </div>

        {/* ─── SECTION I: ABOUT (ABOUT ME / BIO) ─── */}
        <div
          id="about"
          className="relative flex flex-col items-start pb-14 lg:flex-row"
        >
          <div className="mb-6 flex w-full flex-col items-start pr-0 lg:mb-0 lg:w-[224px] lg:shrink-0 lg:items-end lg:pr-6">
            <div className="space-y-1.5">
              <a
                href="/"
                className="group relative flex size-20 items-center justify-center rounded border border-border bg-card/40 p-2.5 transition-all hover:border-pp-secondary/50 hover:bg-card/70 sm:size-24"
                title="Phong Phan Portfolio"
              >
                <PPPixelMark
                  size={54}
                  className="h-auto w-auto text-pp-primary transition-all duration-300 group-hover:scale-105 group-hover:text-pp-secondary group-hover:drop-shadow-[0_0_12px_var(--pp-secondary-glow)]"
                  variant="glow"
                />
                <span className="pointer-events-none absolute top-1 left-1 font-mono text-[7px] text-muted-foreground/40">
                  +
                </span>
                <span className="pointer-events-none absolute right-1 bottom-1 font-mono text-[7px] text-muted-foreground/40">
                  +
                </span>
              </a>
              <div className="text-right font-mono text-[8px] tracking-widest text-muted-foreground/60 uppercase">
                PL. 1
              </div>
            </div>

            <div className="mt-10 hidden w-full items-center gap-2 pl-6 font-mono text-xs select-none lg:flex">
              <span className="font-serif text-sm font-medium text-pp-secondary italic">
                I
              </span>
              <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                ABOUT
              </span>
              <div className="ml-2 flex-1 border-b border-border" />
            </div>
          </div>

          <div className="hidden w-[48px] shrink-0 lg:block" />

          <div className="w-full max-w-[528px] space-y-4">
            <div className="mb-3 flex items-center gap-2 font-mono text-xs select-none lg:hidden">
              <span className="font-serif text-sm font-medium text-pp-secondary italic">
                I
              </span>
              <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
                ABOUT
              </span>
              <div className="ml-2 flex-1 border-b border-border" />
            </div>

            {/* Architectural Banner: Vegeta Ultra Ego (Placed FIRST at the top) */}
            <div className="relative w-full overflow-hidden rounded-lg border border-border bg-card/40 p-2 shadow-sm transition-colors hover:border-border/90">
              <div className="flex items-center justify-between px-1 pb-1.5 font-mono text-[8px] text-muted-foreground/60 select-none">
                <span className="flex items-center gap-1.5">
                  <span className="size-1 animate-pulse rounded-full bg-pp-secondary" />
                  FIG. 01 // ULTRA EGO
                </span>
                <span>524 × 326 PX • DYNAMIC FRAME</span>
              </div>
              <div className="relative overflow-hidden rounded border border-border/60 bg-black/60">
                <img
                  src="/vegeta-ultra-ego.gif"
                  alt="Vegeta Ultra Ego Banner"
                  className="h-auto max-h-[300px] w-full object-cover object-center select-none"
                  loading="eager"
                />
                <span className="pointer-events-none absolute top-1 left-1 font-mono text-[7px] text-white/40">
                  +
                </span>
                <span className="pointer-events-none absolute top-1 right-1 font-mono text-[7px] text-white/40">
                  +
                </span>
                <span className="pointer-events-none absolute bottom-1 left-1 font-mono text-[7px] text-white/40">
                  +
                </span>
                <span className="pointer-events-none absolute right-1 bottom-1 font-mono text-[7px] text-white/40">
                  +
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Skeleton className="h-8 w-56 rounded bg-muted/80 sm:w-64" />
              <Skeleton className="h-4 w-72 rounded bg-muted/50 sm:w-80" />
            </div>

            <div className="max-w-[460px] space-y-1.5 pt-1">
              <Skeleton className="h-3.5 w-full rounded bg-muted/60" />
              <Skeleton className="h-3.5 w-[92%] rounded bg-muted/60" />
              <Skeleton className="h-3.5 w-[75%] rounded bg-muted/40" />
            </div>

            <div className="flex items-center gap-3 pt-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="size-4.5 rounded bg-muted/60" />
              ))}
            </div>
          </div>
        </div>

        {/* ─── SECTION II: TECH STACK ─── */}
        <div
          id="tech-stack"
          className="relative flex flex-col items-start pb-14 lg:flex-row"
        >
          <div className="mb-4 flex w-full items-center gap-2 pl-0 font-mono text-xs select-none lg:mb-0 lg:w-[224px] lg:shrink-0 lg:pl-6">
            <span className="font-serif text-sm font-medium text-pp-secondary italic">
              II
            </span>
            <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
              TECH STACK
            </span>
            <div className="ml-2 flex-1 border-b border-border" />
          </div>

          <div className="hidden w-[48px] shrink-0 lg:block" />

          <div className="w-full max-w-[528px] space-y-3">
            {[
              { catW: "w-44", tagW: "w-28" },
              { catW: "w-36", tagW: "w-24" },
              { catW: "w-40", tagW: "w-32" },
              { catW: "w-32", tagW: "w-20" },
              { catW: "w-38", tagW: "w-22" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <Skeleton
                  className={`h-3.5 ${item.catW} rounded bg-muted/80`}
                />
                <div className="mx-2 flex-1 border-b border-dotted border-border" />
                <Skeleton
                  className={`h-3.5 ${item.tagW} rounded bg-muted/50`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PART 2: SECTION III: FULL-WIDTH BREAKOUT — UI COMPONENTS SHOWCASE ─── */}
      {/* Expands to 100% full viewport width with flush bottom baseline */}
      <div
        id="components-ui"
        className="my-8 w-full border-y border-border bg-card/20 px-4 py-16 sm:px-6 md:px-8 xl:px-10 2xl:px-12"
      >
        <ComponentsFullWidthShowcase />
      </div>

      {/* ─── PART 3: SECTION IV: PRODUCTION BLOCKS (HORIZONTAL SLIDE TO RIGHT) ─── */}
      {/* Aligns with 1024px content column on the left and bleeds to the right edge */}
      <div
        id="blocks"
        className="relative z-10 w-full overflow-hidden border-b border-border py-8"
      >
        <BlocksSchematicShowcase />
      </div>

      {/* ─── PART 4: 1024px ARCHITECTURAL BLUEPRINT SHEET (LOWER CONTAINER) ─── */}
      <div className="relative z-10 mx-auto w-full max-w-[1024px] px-4 sm:px-6">
        {/* ─── SECTION V: HOOKS ─── */}
        <div
          id="hooks"
          className="relative flex flex-col items-start pt-6 pb-14 lg:flex-row"
        >
          <div className="mb-4 flex w-full items-center gap-2 pl-0 font-mono text-xs select-none lg:mb-0 lg:w-[224px] lg:shrink-0 lg:pl-6">
            <span className="font-serif text-sm font-medium text-pp-secondary italic">
              V
            </span>
            <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
              HOOKS
            </span>
            <div className="ml-2 flex-1 border-b border-border" />
          </div>

          <div className="hidden w-[48px] shrink-0 lg:block" />

          <div className="w-full max-w-[528px] space-y-3">
            {[
              { id: "01", titleW: "w-36", tagW: "w-16" },
              { id: "02", titleW: "w-40", tagW: "w-18" },
              { id: "03", titleW: "w-44", tagW: "w-16" },
              { id: "04", titleW: "w-32", tagW: "w-20" },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] text-muted-foreground/60">
                    {item.id}
                  </span>
                  <Skeleton
                    className={`h-3.5 ${item.titleW} rounded bg-muted/80 font-mono`}
                  />
                </div>
                <div className="mx-2 flex-1 border-b border-dotted border-border" />
                <Skeleton
                  className={`h-3.5 ${item.tagW} rounded bg-muted/50`}
                />
              </div>
            ))}

            <div className="pt-2">
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <Skeleton className="h-3 w-20 rounded bg-muted/60" />
                <span className="text-pp-secondary/80">→</span>
              </span>
            </div>
          </div>
        </div>

        {/* ─── SECTION VI: WRITING ─── */}
        <div
          id="blog"
          className="relative flex flex-col items-start pb-14 lg:flex-row"
        >
          <div className="mb-4 flex w-full items-center gap-2 pl-0 font-mono text-xs select-none lg:mb-0 lg:w-[224px] lg:shrink-0 lg:pl-6">
            <span className="font-serif text-sm font-medium text-pp-secondary italic">
              VI
            </span>
            <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
              WRITING
            </span>
            <div className="ml-2 flex-1 border-b border-border" />
          </div>

          <div className="hidden w-[48px] shrink-0 lg:block" />

          <div className="w-full max-w-[528px] space-y-3">
            {[
              { id: "01", titleW: "w-52", dateW: "w-16" },
              { id: "02", titleW: "w-56", dateW: "w-16" },
              { id: "03", titleW: "w-44", dateW: "w-14" },
              { id: "04", titleW: "w-48", dateW: "w-16" },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] text-muted-foreground/60">
                    {item.id}
                  </span>
                  <Skeleton
                    className={`h-3.5 ${item.titleW} rounded bg-muted/80`}
                  />
                </div>
                <div className="mx-2 flex-1 border-b border-dotted border-border" />
                <Skeleton
                  className={`h-3.5 ${item.dateW} rounded bg-muted/50`}
                />
              </div>
            ))}

            <div className="pt-2">
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <Skeleton className="h-3 w-20 rounded bg-muted/60" />
                <span className="text-pp-secondary/80">→</span>
              </span>
            </div>
          </div>
        </div>

        {/* ─── SECTION VII: RESOURCES ─── */}
        <div
          id="resources"
          className="relative flex flex-col items-start pb-14 lg:flex-row"
        >
          <div className="mb-4 flex w-full items-center gap-2 pl-0 font-mono text-xs select-none lg:mb-0 lg:w-[224px] lg:shrink-0 lg:pl-6">
            <span className="font-serif text-sm font-medium text-pp-secondary italic">
              VII
            </span>
            <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
              RESOURCES
            </span>
            <div className="ml-2 flex-1 border-b border-border" />
          </div>

          <div className="hidden w-[48px] shrink-0 lg:block" />

          <div className="w-full max-w-[528px] space-y-3">
            {[
              { id: "01", titleW: "w-48", tagW: "w-18" },
              { id: "02", titleW: "w-44", tagW: "w-14" },
              { id: "03", titleW: "w-50", tagW: "w-16" },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[11px] text-muted-foreground/60">
                    {item.id}
                  </span>
                  <Skeleton
                    className={`h-3.5 ${item.titleW} rounded bg-muted/80`}
                  />
                </div>
                <div className="mx-2 flex-1 border-b border-dotted border-border" />
                <Skeleton
                  className={`h-3.5 ${item.tagW} rounded bg-muted/50`}
                />
              </div>
            ))}

            <div className="pt-2">
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                <Skeleton className="h-3 w-24 rounded bg-muted/60" />
                <span className="text-pp-secondary/80">→</span>
              </span>
            </div>
          </div>
        </div>

        {/* ─── SECTION VIII: LOCATION (VIETNAM) + SIGNED ─── */}
        <div
          id="vietnam-map"
          className="relative flex flex-col items-start pb-20 lg:flex-row"
        >
          <div className="mb-4 flex w-full items-center gap-2 pl-0 font-mono text-xs select-none lg:mb-0 lg:w-[224px] lg:shrink-0 lg:pl-6">
            <span className="font-serif text-sm font-medium text-pp-secondary italic">
              VIII
            </span>
            <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
              LOCATION
            </span>
            <div className="ml-2 flex-1 border-b border-border" />
          </div>

          <div className="hidden w-[48px] shrink-0 lg:block" />

          <div className="w-full max-w-[528px] space-y-4">
            <div className="relative flex flex-col justify-between overflow-hidden rounded border border-border bg-card/40 p-4">
              <div className="z-10 flex items-center justify-between font-mono text-[8px] text-muted-foreground/60">
                <span>PL. 2 // TERRITORIAL POSITION</span>
                <span>12°30&apos;N, 109°10&apos;E</span>
              </div>

              <div className="z-10 my-auto flex flex-col items-center justify-center py-5">
                <div className="relative flex size-14 items-center justify-center rounded-full border border-dashed border-border">
                  <span className="size-1.5 animate-ping rounded-full bg-pp-secondary" />
                  <span className="absolute size-1.5 rounded-full bg-pp-secondary" />
                  <div className="absolute h-px w-full border-t border-border" />
                  <div className="absolute h-full w-px border-l border-border" />
                </div>
                <div className="mt-2.5 text-center font-mono text-[9px] text-muted-foreground">
                  Ninh Hoà, Khánh Hoà • Vietnam
                </div>
              </div>

              <div className="z-10 flex items-center justify-between font-mono text-[8px] text-muted-foreground/60">
                <span>MAPLIBRE GL // SPATIAL CANVAS</span>
                <span>ONLINE</span>
              </div>
            </div>

            {/* Motivational Quote below Map Card */}
            <div className="pt-1">
              <div className="relative rounded-lg border border-border/70 bg-card/40 px-4 py-3.5 backdrop-blur-sm transition-colors hover:border-border">
                <div className="flex items-start gap-3">
                  <span className="-mt-0.5 shrink-0 font-serif text-2xl leading-none font-normal text-pp-secondary italic select-none">
                    &ldquo;
                  </span>
                  <div className="space-y-1.5">
                    <p className="font-serif text-xs leading-relaxed tracking-wide text-foreground/90 italic sm:text-[13px]">
                      Before you can be great, you must first be good. Before
                      being good, you must accept being bad. And before being
                      bad, you must allow yourself to start.
                    </p>
                    <div className="flex items-center gap-2 pt-0.5 font-mono text-[8px] tracking-widest text-muted-foreground/60 uppercase select-none">
                      <span>PHILOSOPHY</span>
                      <span>•</span>
                      <span>ON CRAFT &amp; PERSEVERANCE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature Flourish (SIGNED + Red Script) */}
            <div className="flex items-center justify-end gap-5 pt-14 pb-4 select-none">
              <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase">
                SIGNED
              </span>
              <div className="w-16 border-b border-border sm:w-20" />

              <div className="text-pp-secondary transition-colors hover:brightness-110">
                <svg
                  className="h-10 w-28 overflow-visible sm:h-12 sm:w-34"
                  viewBox="0 0 160 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Signature"
                >
                  <path
                    d="M 12 38 C 15 20, 25 8, 32 10 C 38 12, 34 32, 28 42 C 25 47, 20 48, 18 42 C 16 34, 22 18, 38 22 C 48 24, 46 36, 52 36 C 58 36, 62 26, 68 24 C 74 22, 78 30, 84 30 C 90 30, 94 20, 102 20 C 110 20, 114 34, 122 34 C 130 34, 138 18, 148 16 C 154 15, 156 22, 152 26"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_var(--pp-secondary-glow)]"
                  />
                  <path
                    d="M 22 24 C 42 22, 75 25, 110 22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── FULL-WIDTH PRODUCTION FOOTER (SPOTLIGHT WATERMARK & 4 COLUMNS) ─── */}
      <div className="w-full border-t border-border pt-12">
        <Footer />
      </div>
    </div>
  )
}
