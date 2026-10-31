"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useMotionValueEvent, useScroll } from "motion/react"
import {
  MousePointer2,
  MoveVertical,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
} from "lucide-react"

import {
  DEFAULT_RAIL_SECTIONS,
  RailScrollScrubber,
} from "@/registry/animated/rail-scroll-scrubber"
import { Button } from "@/registry/ui/button"
import { Skeleton } from "@/registry/ui/skeleton"
import { cn } from "@/shared/lib/utils"

export default function ArtcraftScrollBlockPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: scrollContainerRef })

  const [stiffness, setStiffness] = useState(140)
  const [damping, setDamping] = useState(26)
  const [zoomScale, setZoomScale] = useState(3.6)
  const [curveIntensity, setCurveIntensity] = useState(1.0)
  const [autoScroll, setAutoScroll] = useState(false)
  const [livePct, setLivePct] = useState(47)

  const springConfig = useMemo(
    () => ({ stiffness, damping, mass: 0.45 }),
    [stiffness, damping]
  )

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setLivePct(Math.round(v * 100))
  })

  const scrubToProgress = useCallback(
    (targetProgress: number, options?: { smooth?: boolean }) => {
      const el = scrollContainerRef.current
      if (!el) return
      const maxScroll = el.scrollHeight - el.clientHeight
      const targetTop = Math.min(Math.max(targetProgress, 0), 1) * maxScroll
      if (options?.smooth) {
        el.scrollTo({ top: targetTop, behavior: "smooth" })
      } else {
        el.scrollTop = targetTop
      }
    },
    []
  )

  const animateScrollTo = useCallback((targetProgress: number) => {
    const el = scrollContainerRef.current
    if (!el) return
    const maxScroll = el.scrollHeight - el.clientHeight
    el.scrollTo({
      top: Math.min(Math.max(targetProgress, 0), 1) * maxScroll,
      behavior: "smooth",
    })
  }, [])

  // Auto-scroll loop
  useEffect(() => {
    if (!autoScroll) return
    let rafId: number
    let direction = 1
    const step = () => {
      const el = scrollContainerRef.current
      if (el) {
        const maxScroll = el.scrollHeight - el.clientHeight
        el.scrollTop += direction * 2.2
        if (el.scrollTop >= maxScroll - 2) direction = -1
        if (el.scrollTop <= 2) direction = 1
      }
      rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [autoScroll])

  // Set initial scroll to 47% on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      scrubToProgress(0.47)
    }, 100)
    return () => clearTimeout(timer)
  }, [scrubToProgress])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background font-sans text-foreground selection:bg-primary/20">
      {/* Subtle blueprint background grid using semantic primary tokens */}
      <div
        className="pointer-events-none fixed inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at 40% 25%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 50%), linear-gradient(to right, color-mix(in oklch, var(--border) 45%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--border) 45%, transparent) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
        }}
      />

      {/* ── Left Fixed Inspector Controls (Desktop ≥ xl) ── */}
      <aside className="fixed top-6 bottom-6 left-6 z-40 hidden w-[310px] flex-col justify-between rounded-2xl border border-border bg-card/90 p-5 shadow-2xl backdrop-blur-xl xl:flex">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div className="flex items-center gap-2">
              <div className="size-2.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
              <span className="font-mono text-xs font-bold tracking-widest text-foreground uppercase">
                Rail Scrubber Block
              </span>
            </div>
            <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
              {String(livePct).padStart(3, "0")}%
            </span>
          </div>

          <div className="space-y-1.5">
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              Iconic Rail States
            </span>

            <button
              type="button"
              onClick={() => animateScrollTo(0.47)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition-all",
                livePct >= 44 && livePct <= 50
                  ? "border-primary/50 bg-primary/15 text-foreground"
                  : "border-border/60 bg-muted/40 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <div>
                <div className="text-xs font-semibold text-foreground">
                  047% Idle / Hover
                </div>
                <div className="text-[10px] text-muted-foreground">
                  FEATURES active • 0–100 overview
                </div>
              </div>
              <span className="font-mono text-xs text-primary">047%</span>
            </button>

            <button
              type="button"
              onClick={() => animateScrollTo(0.67)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition-all",
                livePct === 67
                  ? "border-primary/50 bg-primary/15 text-foreground"
                  : "border-border/60 bg-muted/40 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <span>067% Vertical Spine</span>
                  <span className="rounded bg-primary/20 px-1 py-0.5 font-mono text-[9px] text-primary">
                    -90°
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  OWNERSHIP flush with ticks
                </div>
              </div>
              <span className="font-mono text-xs text-primary">067%</span>
            </button>

            <button
              type="button"
              onClick={() => animateScrollTo(0.685)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition-all",
                livePct >= 68 && livePct <= 71
                  ? "border-primary/50 bg-primary/15 text-foreground"
                  : "border-border/60 bg-muted/40 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <div>
                <div className="text-xs font-semibold text-foreground">
                  068% Top Arc Peel
                </div>
                <div className="text-[10px] text-muted-foreground">
                  &quot;SHIP&quot; turns the corner
                </div>
              </div>
              <span className="font-mono text-xs text-primary">068%</span>
            </button>
          </div>

          {/* Physics Tuning Sliders */}
          <div className="space-y-3 border-t border-border/70 pt-2">
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
              <Sliders className="size-3 text-primary" />
              Physics & Arc Sliders
            </span>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Zoom Scale</span>
                <span className="font-mono text-foreground">
                  {zoomScale.toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="5.5"
                step="0.1"
                value={zoomScale}
                aria-label="Zoom Scale"
                onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                className="h-1.5 w-full cursor-pointer rounded-lg bg-muted accent-primary"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Arc Intensity</span>
                <span className="font-mono text-foreground">
                  {Math.round(curveIntensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.6"
                step="0.05"
                value={curveIntensity}
                aria-label="Arc Intensity"
                onChange={(e) => setCurveIntensity(parseFloat(e.target.value))}
                className="h-1.5 w-full cursor-pointer rounded-lg bg-muted accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 border-t border-border/70 pt-3">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={autoScroll ? "secondary" : "outline"}
              onClick={() => setAutoScroll(!autoScroll)}
              className={cn(
                "flex-1 gap-1.5 text-xs font-medium",
                autoScroll && "border-primary/40 bg-primary/15 text-primary"
              )}
            >
              {autoScroll ? (
                <Pause className="size-3.5" />
              ) : (
                <Play className="size-3.5" />
              )}
              <span>{autoScroll ? "Pause" : "Auto-Cruise"}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStiffness(140)
                setDamping(26)
                setZoomScale(3.6)
                setCurveIntensity(1.0)
                animateScrollTo(0.47)
              }}
              title="Reset Parameters"
            >
              <RotateCcw className="size-3.5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </aside>

      {/* ── Main Scrollable Viewport with Skeleton Sections ── */}
      <main
        ref={scrollContainerRef}
        className="relative no-scrollbar h-screen w-full overflow-x-hidden overflow-y-scroll pr-[22px] sm:pr-[64px] md:pr-[280px] xl:pl-[340px]"
        style={{ scrollbarWidth: "none" }}
      >
        {/* Mobile/Tablet Sticky Quick Switcher (xl:hidden) */}
        <div className="sticky top-3 z-30 mx-2 flex items-center justify-between gap-1.5 rounded-xl border border-border bg-card/95 px-2.5 py-1.5 shadow-lg backdrop-blur-md sm:mx-6 xl:hidden">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            <span className="font-mono text-xs font-bold text-foreground">
              {String(livePct).padStart(3, "0")}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={() => animateScrollTo(0.47)}
              className={cn(
                "rounded px-2 py-0.5 text-[11px] transition-colors",
                livePct >= 44 && livePct <= 50
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              047%
            </button>
            <button
              type="button"
              onClick={() => animateScrollTo(0.67)}
              className={cn(
                "rounded px-2 py-0.5 text-[11px] transition-colors",
                livePct === 67
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              067%
            </button>
            <button
              type="button"
              onClick={() => animateScrollTo(0.685)}
              className={cn(
                "rounded px-2 py-0.5 text-[11px] transition-colors",
                livePct >= 68 && livePct <= 71
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              068%
            </button>
            <Button
              type="button"
              variant={autoScroll ? "secondary" : "outline"}
              size="sm"
              onClick={() => setAutoScroll(!autoScroll)}
              className={cn(
                "h-6 px-2 text-[10px]",
                autoScroll && "border-primary/40 bg-primary/15 text-primary"
              )}
            >
              {autoScroll ? (
                <Pause className="size-3" />
              ) : (
                <Play className="size-3" />
              )}
            </Button>
          </div>
        </div>

        {/* 5 Skeleton Content Sections */}
        <div className="mx-auto max-w-3xl px-3 py-6 sm:px-8 sm:py-12">
          {DEFAULT_RAIL_SECTIONS.map((section, idx) => (
            <section
              key={section.id}
              id={section.id}
              style={{
                minHeight: idx === 1 || idx === 2 ? "125vh" : "105vh",
              }}
              className="relative flex flex-col justify-center border-b border-border/50 py-16 sm:py-20"
            >
              {/* Section Header with Percentage Coordinate Badge */}
              <div className="mb-4 flex flex-wrap items-center gap-3 sm:mb-6">
                <span className="rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 font-mono text-xs text-primary">
                  {String(Math.round(section.start * 100)).padStart(3, "0")}% —{" "}
                  {String(Math.round((section.end ?? 1) * 100)).padStart(
                    3,
                    "0"
                  )}
                  %
                </span>
                <span className="h-[1px] w-8 bg-border sm:w-12" />
                <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {section.subtitle}
                </span>
              </div>

              {/* Display Title */}
              <h2 className="mb-4 font-mono text-3xl font-extrabold tracking-tight text-foreground sm:mb-6 sm:text-5xl lg:text-6xl">
                {section.title}
              </h2>

              {/* Skeleton content lines */}
              <div className="mb-8 space-y-3 sm:mb-10">
                <Skeleton className="h-4 w-full max-w-2xl" />
                <Skeleton className="h-4 w-4/5 max-w-xl" />
                <Skeleton className="h-4 w-3/5 max-w-lg" />
              </div>

              {/* Skeleton Metrics Cards */}
              <div className="mb-8 grid grid-cols-1 gap-3 sm:mb-10 sm:grid-cols-3 sm:gap-4">
                {[1, 2, 3].map((mIdx) => (
                  <div
                    key={mIdx}
                    className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm sm:p-5"
                  >
                    <Skeleton className="mb-2 h-3 w-20" />
                    <Skeleton className="h-7 w-28" />
                  </div>
                ))}
              </div>

              {/* Skeleton Visual Showcase Box */}
              <div className="flex h-44 w-full items-center justify-center rounded-2xl border border-dashed border-border/80 bg-accent/20 p-4 sm:h-56 sm:p-6">
                <Skeleton className="h-full w-full rounded-xl" />
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* ── The Fixed Rail Scroll Scrubber Component (Responsive: compact on mobile, full on tablet/desktop) ── */}
      <RailScrollScrubber
        sections={DEFAULT_RAIL_SECTIONS}
        scrollProgressMV={scrollYProgress}
        onScrubToProgress={scrubToProgress}
        springConfig={springConfig}
        zoomScale={zoomScale}
        curveIntensity={curveIntensity}
        accentColor="var(--primary)"
      />
    </div>
  )
}
