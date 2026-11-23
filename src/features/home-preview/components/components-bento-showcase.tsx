import { ArrowRight, ChevronDown, Moon } from "lucide-react"
import React from "react"

import { Skeleton } from "@/shared/ui/core/skeleton"

/**
 * High-Craft Bento Showcase Grid for UI Components
 * Inspired by chanhdai.com / modern Vercel-style interactive design engineering:
 * - Slide to Unlock
 * - Stacked Wallet Cards
 * - Time Scrubber Wheel
 * - Sliders (Opacity, Blur, Sat)
 * - Middle Truncation Code Block
 * - Contribution Heatmap
 * - Ambient Canvas / Shader Preview
 */
export function ComponentsBentoShowcase() {
  return (
    <div className="relative w-full select-none">
      {/* ─── Section Header (Full-width Architectural Header) ─── */}
      <div className="mb-6 flex items-center justify-between border-b border-white/[0.08] pb-6">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="font-serif text-sm font-medium text-red-500/90 italic">
            IV
          </span>
          <span className="text-[10px] font-medium tracking-widest text-slate-300 uppercase">
            UI COMPONENTS SHOWCASE
          </span>
          <span className="hidden text-slate-600 sm:inline">•</span>
          <span className="hidden text-[10px] text-slate-500 sm:inline">
            Interactive Primitives & Shaders
          </span>
        </div>

        <a
          href="/ui/base"
          className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-400 transition hover:text-red-400"
        >
          <span>ALL COMPONENTS (37+)</span>
          <span className="text-red-500/80">→</span>
        </a>
      </div>

      {/* ─── Bento Grid Matrix (3-Column Asymmetrical Grid) ─── */}
      <div className="grid w-full grid-cols-1 gap-3.5 md:grid-cols-12">
        {/* ─── Cell 1: Ambient Shader / Hello (Col 1-4, Row 1-2) ─── */}
        <div className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 md:col-span-4">
          <div className="z-10 flex items-center justify-between font-mono text-[8px] text-slate-500">
            <span>SHADER // AMBIENT</span>
            <span>GLSL</span>
          </div>

          <div className="z-10 my-auto flex items-center justify-center py-6">
            {/* Calligraphic Ambient Wireframe */}
            <div className="relative font-serif text-4xl tracking-wide text-slate-500/40 italic select-none">
              <span>hello</span>
              <div className="absolute inset-0 -z-10 rounded-full bg-red-500/10 blur-lg" />
            </div>
          </div>

          <div className="z-10 flex items-center justify-between border-t border-white/[0.05] pt-2.5 font-mono text-[9px] text-slate-500">
            <Skeleton className="h-3 w-20 rounded bg-white/[0.05]" />
            <span>01</span>
          </div>

          {/* Background Radial Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent"
          />
        </div>

        {/* ─── Cell 2: Slide to Unlock (Col 5-8, Row 1) ─── */}
        <div className="flex min-h-[140px] flex-col justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 md:col-span-4">
          <div className="flex items-center justify-between font-mono text-[8px] text-slate-500">
            <span>INTERACTION // SLIDER</span>
            <span>TOUCH_API</span>
          </div>

          {/* Slide Pill */}
          <div className="my-auto py-2">
            <div className="relative mx-auto flex h-11 w-full max-w-[240px] items-center justify-between rounded-full border border-white/[0.12] bg-white/[0.04] p-1 shadow-inner">
              <div className="flex size-9 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
                <ArrowRight className="size-4 text-slate-900" />
              </div>
              <span className="pr-4 font-mono text-[10px] tracking-wider text-slate-400">
                slide to unlock
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.05] pt-2 font-mono text-[9px] text-slate-500">
            <Skeleton className="h-2.5 w-16 rounded bg-white/[0.05]" />
            <span>02</span>
          </div>
        </div>

        {/* ─── Cell 3: Dropdown Select & Switch (Col 9-12, Row 1) ─── */}
        <div className="flex min-h-[140px] flex-col justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 md:col-span-4">
          <div className="flex items-center justify-between font-mono text-[8px] text-slate-500">
            <span>SELECT // CONTROLS</span>
            <span>BASE_UI</span>
          </div>

          <div className="my-auto flex items-center justify-center gap-3 py-2">
            {/* Dropdown Pill */}
            <div className="flex h-8 items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.04] px-3 font-mono text-[11px] text-slate-300">
              <Skeleton className="h-3 w-16 rounded bg-white/[0.08]" />
              <ChevronDown className="size-3 text-slate-500" />
            </div>

            {/* Mode Switch Button */}
            <div className="flex size-8 items-center justify-center rounded-md border border-white/[0.12] bg-white/[0.04] text-slate-400">
              <Moon className="size-3.5 text-slate-300" />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.05] pt-2 font-mono text-[9px] text-slate-500">
            <Skeleton className="h-2.5 w-16 rounded bg-white/[0.05]" />
            <span>03</span>
          </div>
        </div>

        {/* ─── Cell 4: Time Scrubber / Drum Wheel (Col 1-4, Row 2) ─── */}
        <div className="flex min-h-[180px] flex-col justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 md:col-span-4">
          <div className="flex items-center justify-between font-mono text-[8px] text-slate-500">
            <span>TIME SCRUBBER // DRUM</span>
            <span>WHEEL_PHYSICS</span>
          </div>

          {/* Vertical Drum Wheel numbers */}
          <div className="my-auto flex items-center justify-center py-2">
            <div className="space-y-1 rounded-lg border border-white/[0.1] bg-black/40 px-5 py-2.5 text-center font-mono shadow-lg">
              <div className="text-[10px] text-slate-600">07 &nbsp; 39</div>
              <div className="text-[11px] text-slate-500">08 &nbsp; 40</div>
              {/* Active Row */}
              <div className="flex items-center gap-4 rounded bg-white/[0.08] px-3 py-0.5 text-xs font-bold text-slate-100">
                <span>09</span>
                <span>41</span>
                <span className="text-[10px] text-red-400">AM</span>
              </div>
              <div className="text-[11px] text-slate-500">
                10 &nbsp; 42 &nbsp; PM
              </div>
              <div className="text-[10px] text-slate-600">11 &nbsp; 43</div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.05] pt-2 font-mono text-[9px] text-slate-500">
            <Skeleton className="h-2.5 w-24 rounded bg-white/[0.05]" />
            <span>04</span>
          </div>
        </div>

        {/* ─── Cell 5: Slider Parameters (Col 5-8, Row 2) ─── */}
        <div className="flex min-h-[180px] flex-col justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 md:col-span-4">
          <div className="flex items-center justify-between font-mono text-[8px] text-slate-500">
            <span>SLIDERS // SPRING</span>
            <span>PROPS_INPUT</span>
          </div>

          {/* 3 Slider Tracks */}
          <div className="my-auto space-y-3 py-2 font-mono text-[10px]">
            {/* Slider 1: Opacity */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>Opacity</span>
                <span className="text-slate-300">0.50</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-1/2 rounded-full bg-red-500/80" />
              </div>
            </div>

            {/* Slider 2: Blur */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>Blur</span>
                <span className="text-slate-300">20px</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-2/3 rounded-full bg-white/70" />
              </div>
            </div>

            {/* Slider 3: Saturation */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>Saturation</span>
                <span className="text-slate-300">8.0</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div className="h-full w-4/5 rounded-full bg-white/70" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.05] pt-2 font-mono text-[9px] text-slate-500">
            <Skeleton className="h-2.5 w-20 rounded bg-white/[0.05]" />
            <span>05</span>
          </div>
        </div>

        {/* ─── Cell 6: Stacked Wallet Cards (Col 9-12, Row 2-3) ─── */}
        <div className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 md:col-span-4">
          <div className="z-10 flex items-center justify-between font-mono text-[8px] text-slate-500">
            <span>STACKED CARDS // WALLET</span>
            <span>MOTION_LAYOUT</span>
          </div>

          {/* Stacked Cards Preview */}
          <div className="z-10 my-auto flex flex-col items-center justify-center py-4">
            <div className="relative w-full max-w-[200px]">
              {/* Card 1: Green (Savings) */}
              <div className="flex h-12 w-full justify-between rounded-t-lg bg-emerald-600/90 p-2 font-mono text-[8px] text-white shadow-md">
                <span>Savings</span>
                <span>•••• 8389</span>
              </div>

              {/* Card 2: Blue (Travel) */}
              <div className="-mt-7 flex h-12 w-full justify-between rounded-t-lg bg-sky-500/90 p-2 font-mono text-[8px] text-white shadow-md">
                <span>Travel</span>
                <span>•••• 1948</span>
              </div>

              {/* Card 3: Orange (Everyday) */}
              <div className="-mt-7 flex h-14 w-full justify-between rounded-t-lg bg-amber-600 p-2.5 font-mono text-[9px] font-medium text-white shadow-lg">
                <span>Everyday</span>
                <span>•••• 0290</span>
              </div>

              {/* Leather Wallet Sleeve Pocket */}
              <div className="-mt-4 w-full rounded-b-xl border border-dashed border-white/20 bg-slate-900/95 p-3 text-center shadow-2xl">
                <span className="font-mono text-[10px] font-semibold tracking-wider text-slate-300">
                  CD Wallet
                </span>
              </div>
            </div>
          </div>

          <div className="z-10 flex items-center justify-between border-t border-white/[0.05] pt-2 font-mono text-[9px] text-slate-500">
            <Skeleton className="h-2.5 w-24 rounded bg-white/[0.05]" />
            <span>06</span>
          </div>
        </div>

        {/* ─── Cell 7: GitHub Contribution Heatmap (Col 1-8, Row 3) ─── */}
        <div className="flex min-h-[160px] flex-col justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 md:col-span-8">
          <div className="flex items-center justify-between font-mono text-[8px] text-slate-500">
            <span>ACTIVITY GRAPH // HEATMAP</span>
            <span>GITHUB_API</span>
          </div>

          {/* Months header + Grid Matrix */}
          <div className="my-auto space-y-2 py-3">
            <div className="flex justify-between font-mono text-[8px] text-slate-500">
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>

            {/* Matrix of heat dots */}
            <div className="grid grid-flow-col grid-rows-5 gap-1 overflow-hidden">
              {Array.from({ length: 140 }).map((_, i) => {
                const opacities = [
                  "bg-white/[0.04]",
                  "bg-white/[0.08]",
                  "bg-white/[0.18]",
                  "bg-white/[0.35]",
                  "bg-red-500/70",
                ]
                const level = opacities[i % opacities.length]
                return (
                  <div key={i} className={`size-2.5 rounded-[2px] ${level}`} />
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-1 font-mono text-[9px] text-slate-400">
              <span>5,808 contributions in 2025 on GitHub</span>
              <div className="flex items-center gap-1 text-[8px] text-slate-500">
                <span>Less</span>
                <span className="size-2 rounded-[1px] bg-white/[0.04]" />
                <span className="size-2 rounded-[1px] bg-white/[0.15]" />
                <span className="size-2 rounded-[1px] bg-white/[0.3]" />
                <span className="size-2 rounded-[1px] bg-red-500/80" />
                <span>More</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.05] pt-2 font-mono text-[9px] text-slate-500">
            <Skeleton className="h-2.5 w-32 rounded bg-white/[0.05]" />
            <span>07</span>
          </div>
        </div>

        {/* ─── Cell 8: Middle Truncation Code Block (Col 9-12, Row 4) ─── */}
        <div className="flex min-h-[160px] flex-col justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] p-5 md:col-span-4">
          <div className="flex items-center justify-between font-mono text-[8px] text-slate-500">
            <span>MIDDLE TRUNCATION // TEXT</span>
            <span>REACT_PRIMITIVE</span>
          </div>

          {/* Monospace Code Preview */}
          <div className="my-auto space-y-1.5 py-2 font-mono text-[9px] leading-tight text-slate-400">
            <div className="text-red-400/90">&lt;MiddleTruncation&gt;</div>
            <div className="pl-2 text-slate-300">
              /Users/phong/.../components/button.tsx
            </div>
            <div className="pt-1 text-red-400/90">
              &lt;MiddleTruncation end=&#123;4&#125;&gt;
            </div>
            <div className="truncate pl-2 text-slate-300">
              https://apple.com/news/.../Statement.pdf
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.05] pt-2 font-mono text-[9px] text-slate-500">
            <Skeleton className="h-2.5 w-24 rounded bg-white/[0.05]" />
            <span>08</span>
          </div>
        </div>
      </div>
    </div>
  )
}
