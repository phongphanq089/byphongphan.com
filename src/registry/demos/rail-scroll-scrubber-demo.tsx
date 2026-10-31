"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useMotionValueEvent, useScroll } from "motion/react"
import { Pause, Play, RotateCcw, Sliders, Sparkles } from "lucide-react"

import {
  DEFAULT_RAIL_SECTIONS,
  RailScrollScrubber,
} from "@/registry/animated/rail-scroll-scrubber"
import { Button } from "@/registry/ui/button"
import { Skeleton } from "@/registry/ui/skeleton"

export function RailScrollScrubberDemo() {
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
        el.scrollTo({
          top: targetTop,
          behavior: "smooth",
        })
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
    }, 120)
    return () => clearTimeout(timer)
  }, [scrubToProgress])

  return (
    <div className="relative flex h-[680px] w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-background text-foreground shadow-2xl">
      {/* ── Top Interactive Toolbar ── */}
      <div className="z-30 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-card/70 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
          <span className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase">
            Rail Scrubber
          </span>
          <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
            {String(livePct).padStart(3, "0")}%
          </span>
        </div>

        {/* Quick Snapshot Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="hidden font-mono text-[10px] text-muted-foreground uppercase sm:inline">
            Snapshots:
          </span>
          <Button
            type="button"
            variant={livePct >= 44 && livePct <= 50 ? "secondary" : "outline"}
            size="sm"
            onClick={() => animateScrollTo(0.47)}
            className="h-6 px-2 font-mono text-[11px]"
          >
            047%
          </Button>
          <Button
            type="button"
            variant={livePct === 67 ? "secondary" : "outline"}
            size="sm"
            onClick={() => animateScrollTo(0.67)}
            className="h-6 px-2 font-mono text-[11px]"
          >
            067%
          </Button>
          <Button
            type="button"
            variant={livePct >= 68 && livePct <= 71 ? "secondary" : "outline"}
            size="sm"
            onClick={() => animateScrollTo(0.685)}
            className="h-6 px-2 font-mono text-[11px]"
          >
            068%
          </Button>
          <Button
            type="button"
            variant={autoScroll ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setAutoScroll(!autoScroll)}
            className="h-6 gap-1 px-2 text-[11px]"
          >
            {autoScroll ? (
              <Pause className="size-3 text-primary" />
            ) : (
              <Play className="size-3" />
            )}
            <span>{autoScroll ? "Pause" : "Cruise"}</span>
          </Button>
        </div>
      </div>

      {/* ── Main Viewport Container ── */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Scrollable Content Area with Skeleton Sections */}
        <div
          ref={scrollContainerRef}
          className="relative no-scrollbar flex-1 overflow-x-hidden overflow-y-scroll pr-[22px] pl-3 sm:pr-[64px] sm:pl-6 md:pr-[280px]"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="mx-auto max-w-2xl py-8">
            {DEFAULT_RAIL_SECTIONS.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                className="flex flex-col justify-center border-b border-border/40 py-16"
                style={{
                  minHeight: idx === 1 || idx === 2 ? "90vh" : "75vh",
                }}
              >
                {/* Coordinate badge skeleton */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">
                    {String(Math.round(section.start * 100)).padStart(3, "0")}%
                  </span>
                  <div className="h-px w-8 bg-border" />
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    {section.subtitle}
                  </span>
                </div>

                {/* Section Display Title */}
                <h3 className="mb-4 font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {section.title}
                </h3>

                {/* Skeleton description lines */}
                <div className="mb-6 space-y-2">
                  <Skeleton className="h-3.5 w-full max-w-lg" />
                  <Skeleton className="h-3.5 w-4/5 max-w-md" />
                  <Skeleton className="h-3.5 w-2/3 max-w-sm" />
                </div>

                {/* Skeleton metric cards */}
                <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[1, 2, 3].map((cardIdx) => (
                    <div
                      key={cardIdx}
                      className="rounded-xl border border-border/60 bg-card/60 p-4"
                    >
                      <Skeleton className="mb-2 h-2.5 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>

                {/* Skeleton visual canvas showcase */}
                <div className="flex h-36 w-full items-center justify-center rounded-xl border border-dashed border-border/80 bg-accent/20 p-4">
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* ── Standalone Rail Scroll Scrubber Component ── */}
        <RailScrollScrubber
          sections={DEFAULT_RAIL_SECTIONS}
          scrollProgressMV={scrollYProgress}
          onScrubToProgress={scrubToProgress}
          springConfig={springConfig}
          zoomScale={zoomScale}
          curveIntensity={curveIntensity}
          className="absolute inset-y-0 right-0 z-40 h-full w-[18px] sm:w-[56px] md:w-[260px]"
        />
      </div>
    </div>
  )
}
