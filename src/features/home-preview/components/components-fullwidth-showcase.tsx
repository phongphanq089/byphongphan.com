import {
  ArrowDown,
  ArrowUpRight,
  Minus,
  Play,
  Plus,
  SlidersHorizontal,
} from "lucide-react"
import React, { useState } from "react"

/**
 * Full-Width Asymmetrical Bento Showcase for UI Components
 * Designed to match the user's reference screenshot (media_1795234081871_68ee09ad.png)
 * Synchronized with the project's official dark mode design tokens:
 * - Surfaces: bg-card, bg-background, bg-muted
 * - Typography: text-foreground, text-muted-foreground
 * - Borders: border-border
 *
 * Expands to 100% full viewport width with mixed aspect ratios across 3 columns:
 * - Column 1:
 *   - Card 1: 4:3 Landscape (Halftone Isometric Hexagon)
 *   - Card 2: 4:3 Landscape (Traffic Analytics Chart)
 *   - Card 3: Square / 1:1 (Circle Trigger Button ↗)
 * - Column 2:
 *   - Card 4: 3:4 Tall Portrait (3D Stacked Cards "Mountain")
 *   - Card 5: 16:9 / 2:1 Slim Horizontal (Equalizer Audio Scrubber 50)
 *   - Card 6: 4:3 Landscape (Rolling Counter Stepper)
 * - Column 3:
 *   - Card 7: 3:4 Tall Portrait (Smartphone AI Frame - Sponsored)
 *   - Card 8: 4:3 Landscape (Asset Swap BTC to HYPE)
 *   - Card 9: 4:3 Landscape (Context Usage Progress Bar)
 *
 * MATHEMATICALLY FLUSH BOTTOM BASELINE:
 * All 3 columns share the exact same container height and have exactly 3 cards and 2 gaps.
 * Proportional flex weights (summing to 3.0 in each column) guarantee that the bottom
 * of Card 3, Card 6, and Card 9 align 100% flush on the exact same horizontal baseline,
 * eliminating any ragged/protruding ("thụt thò") bottom seam.
 */
export function ComponentsFullWidthShowcase() {
  const [counter, setCounter] = useState(95)
  const [activeTrafficTab, setActiveTrafficTab] = useState<"day" | "week">(
    "day"
  )

  return (
    <section className="relative w-full select-none">
      {/* ─── Top Showcase Header Bar ─── */}
      <div className="mb-8 flex w-full items-center justify-between border-b border-border pb-6">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="font-serif text-sm font-medium text-pp-secondary italic">
            III
          </span>
          <span className="text-[11px] font-semibold tracking-widest text-foreground uppercase">
            UI COMPONENTS SHOWCASE
          </span>
          <span className="hidden text-muted-foreground/40 sm:inline">•</span>
          <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
            FULL-BLEED ASYMMETRICAL BENTO (4:3 • 3:4 • 1:1 • 16:9)
          </span>
        </div>

        <a
          href="/ui/base"
          className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground transition hover:text-pp-secondary"
        >
          <span>EXPLORE CATALOG (37+)</span>
          <span className="text-pp-secondary/80">→</span>
        </a>
      </div>

      {/* ─── Bento Grid across 3 Columns with Harmonized Bottom Baseline ─── */}
      <div className="grid w-full grid-cols-1 items-stretch gap-4 lg:aspect-[16/8.4] lg:max-h-[1050px] lg:min-h-[760px] lg:grid-cols-3 lg:gap-6">
        {/* ════════════════════════════════════════════════════════════════════
            COLUMN 1 (Total flex weight: 1.05 + 1.05 + 0.90 = 3.00)
        ════════════════════════════════════════════════════════════════════ */}
        <div className="flex h-full flex-col gap-4 lg:gap-6">
          {/* ─── CARD 1: 4:3 Landscape — 3D Halftone Hexagon Dot Matrix ─── */}
          <div
            style={{ flex: "1.05 1 0%" }}
            className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl transition hover:border-foreground/20 sm:p-8 md:rounded-3xl lg:aspect-auto lg:h-full lg:min-h-0"
          >
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-white/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:rounded-3xl" />

            <div className="relative flex size-36 items-center justify-center sm:size-44">
              <svg
                viewBox="0 0 100 100"
                className="size-full text-foreground/85 transition-transform duration-700 ease-out group-hover:scale-105"
                aria-label="Halftone isometric hexagon matrix"
              >
                {Array.from({ length: 9 }).map((_, r) => {
                  const count = r < 5 ? 5 + r : 13 - r
                  const y = 14 + r * 8.5
                  return Array.from({ length: count }).map((__, c) => {
                    const x = 50 - ((count - 1) * 7.5) / 2 + c * 7.5
                    const dist = Math.hypot(x - 50, y - 50)
                    const radius = Math.max(1, 2.3 - dist * 0.035)
                    return (
                      <circle
                        key={`${r}-${c}`}
                        cx={x}
                        cy={y}
                        r={radius}
                        fill="currentColor"
                        opacity={0.2 + (1 - dist / 50) * 0.8}
                      />
                    )
                  })
                })}
              </svg>
            </div>

            <span className="absolute bottom-3 left-4 font-mono text-[8px] tracking-wider text-muted-foreground/60 uppercase">
              GLSL // HALFTONE_MATRIX
            </span>
          </div>

          {/* ─── CARD 2: 4:3 Landscape — Traffic Analytics Multi-Color Bar Chart ─── */}
          <div
            style={{ flex: "1.05 1 0%" }}
            className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-2xl transition hover:border-foreground/20 sm:p-6 md:rounded-3xl lg:aspect-auto lg:h-full lg:min-h-0"
          >
            <div className="w-full max-w-[280px] rounded-2xl border border-border bg-background/80 p-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
                <span className="font-medium text-foreground">Traffic</span>
                <div className="flex items-center gap-1 rounded-md bg-muted/50 p-0.5 text-[9px]">
                  <button
                    type="button"
                    onClick={() => setActiveTrafficTab("day")}
                    className={`rounded px-2 py-0.5 transition ${
                      activeTrafficTab === "day"
                        ? "bg-foreground/15 font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTrafficTab("week")}
                    className={`rounded px-2 py-0.5 transition ${
                      activeTrafficTab === "week"
                        ? "bg-foreground/15 font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Week
                  </button>
                </div>
              </div>

              <div className="mt-2 flex items-baseline gap-1.5 font-mono text-xl font-bold tracking-tight text-foreground">
                <span>146,206</span>
                <span className="text-[10px] font-normal text-muted-foreground">
                  visits
                </span>
              </div>

              {/* Multi-tier Stacked Colored Bar Chart */}
              <div className="mt-3.5 flex h-16 w-full items-end gap-1.5">
                {[
                  { h1: "28%", h2: "42%", h3: "20%" },
                  { h1: "18%", h2: "52%", h3: "15%" },
                  { h1: "42%", h2: "32%", h3: "20%" },
                  { h1: "32%", h2: "48%", h3: "14%" },
                  { h1: "24%", h2: "54%", h3: "18%" },
                  { h1: "38%", h2: "40%", h3: "16%" },
                  { h1: "48%", h2: "32%", h3: "14%" },
                  { h1: "30%", h2: "48%", h3: "18%" },
                  { h1: "44%", h2: "38%", h3: "12%" },
                  { h1: "34%", h2: "44%", h3: "16%" },
                  { h1: "42%", h2: "38%", h3: "14%" },
                  { h1: "22%", h2: "52%", h3: "20%" },
                ].map((bar, i) => (
                  <div
                    key={i}
                    className="group/bar flex h-full flex-1 flex-col justify-end gap-0.5"
                  >
                    <div
                      style={{ height: bar.h1 }}
                      className="w-full rounded-t-sm bg-amber-400 transition-opacity group-hover/bar:opacity-90"
                    />
                    <div
                      style={{ height: bar.h2 }}
                      className="w-full bg-fuchsia-500 transition-opacity group-hover/bar:opacity-90"
                    />
                    <div
                      style={{ height: bar.h3 }}
                      className="w-full rounded-b-sm bg-sky-400 transition-opacity group-hover/bar:opacity-90"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-2 flex justify-between font-mono text-[8px] text-muted-foreground/70">
                <span>May 25</span>
                <span>Oct 15</span>
              </div>
            </div>

            <span className="absolute bottom-3 left-4 font-mono text-[8px] tracking-wider text-muted-foreground/60 uppercase">
              CHART // DATA_VIZ
            </span>
          </div>

          {/* ─── CARD 3: 1:1 Square / Flush Bottom — Circle Trigger Button ↗ ─── */}
          <div
            style={{ flex: "0.9 1 0%" }}
            className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl transition hover:border-foreground/20 sm:p-8 md:rounded-3xl lg:aspect-auto lg:h-full lg:min-h-0"
          >
            <button
              type="button"
              className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-[0_0_25px_rgba(255,255,255,0.12)] transition-transform duration-300 hover:scale-110 active:scale-95 sm:size-20"
              aria-label="Expand component showcase"
            >
              <ArrowUpRight className="size-7 stroke-[2.5] text-background sm:size-8" />
            </button>

            <span className="absolute bottom-3 left-4 font-mono text-[8px] tracking-wider text-muted-foreground/60 uppercase">
              TRIGGER // BUTTON
            </span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            COLUMN 2 (Total flex weight: 1.45 + 0.55 + 1.00 = 3.00)
        ════════════════════════════════════════════════════════════════════ */}
        <div className="flex h-full flex-col gap-4 lg:gap-6">
          {/* ─── CARD 4: 3:4 Tall Portrait — 3D Stacked Cards (Mountain) ─── */}
          <div
            style={{ flex: "1.45 1 0%" }}
            className="group relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl transition hover:border-foreground/20 sm:p-8 md:rounded-3xl lg:aspect-auto lg:h-full lg:min-h-0"
          >
            <div className="relative flex h-60 w-48 items-center justify-center sm:h-72 sm:w-56">
              {/* Back Card 3 (Cyan / Emerald gradient) */}
              <div className="absolute h-52 w-40 translate-x-10 -translate-y-4 rotate-12 rounded-2xl border border-white/20 bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 opacity-50 shadow-2xl transition-transform duration-500 group-hover:translate-x-12 group-hover:rotate-14 sm:h-64 sm:w-48" />

              {/* Middle Card 2 (Purple / Magenta / Amber gradient) */}
              <div className="absolute h-52 w-40 translate-x-5 -translate-y-2 rotate-6 rounded-2xl border border-white/20 bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 opacity-75 shadow-2xl transition-transform duration-500 group-hover:translate-x-6 group-hover:rotate-8 sm:h-64 sm:w-48" />

              {/* Front Card 1 (Mountain Vivid Topographical Gradient) */}
              <div className="relative flex h-52 w-40 -rotate-2 flex-col justify-end rounded-2xl border border-white/30 bg-gradient-to-tr from-rose-500 via-orange-400 to-sky-400 p-3.5 shadow-2xl transition-transform duration-500 group-hover:rotate-0 sm:h-64 sm:w-48">
                <span className="inline-block self-start rounded-full border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-[9px] font-semibold text-white backdrop-blur-md">
                  Mountain
                </span>
              </div>
            </div>

            <span className="absolute bottom-3 left-4 font-mono text-[8px] tracking-wider text-muted-foreground/60 uppercase">
              3D STACK // PERSPECTIVE
            </span>
          </div>

          {/* ─── CARD 5: 16:9 Slim Horizontal — Equalizer Audio Scrubber ─── */}
          <div
            style={{ flex: "0.55 1 0%" }}
            className="group relative flex aspect-[16/9] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl transition hover:border-foreground/20 md:aspect-[2/1] md:rounded-3xl lg:aspect-auto lg:h-full lg:min-h-0"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex h-7 items-center gap-[3px]">
                {Array.from({ length: 32 }).map((_, i) => {
                  const isFilled = i < 16
                  return (
                    <span
                      key={i}
                      className={`h-full w-[2px] rounded-full transition-colors ${
                        isFilled ? "bg-foreground" : "bg-muted-foreground/20"
                      }`}
                    />
                  )
                })}
              </div>
              <span className="font-mono text-xs font-semibold text-foreground">
                50
              </span>
            </div>

            <span className="absolute bottom-3 left-4 font-mono text-[8px] tracking-wider text-muted-foreground/60 uppercase">
              SCRUBBER // EQUALIZER
            </span>
          </div>

          {/* ─── CARD 6: 4:3 Landscape / Flush Bottom — Rolling Counter Stepper (- 95 +) ─── */}
          <div
            style={{ flex: "1.0 1 0%" }}
            className="group relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xl transition hover:border-foreground/20 sm:p-6 md:rounded-3xl lg:aspect-auto lg:h-full lg:min-h-0"
          >
            <div className="mx-auto my-auto flex items-center justify-center">
              <div className="flex items-center gap-3 rounded-full border border-border bg-background/80 px-4 py-2 font-mono text-sm shadow-xl backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => setCounter((c) => Math.max(0, c - 1))}
                  className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Decrease counter"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="min-w-[36px] px-3 text-center text-base font-bold tracking-wider text-foreground">
                  {counter}
                </span>
                <button
                  type="button"
                  onClick={() => setCounter((c) => c + 1)}
                  className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  aria-label="Increase counter"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground">
              <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-muted-foreground">
                Rolling counter
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1 text-muted-foreground transition hover:text-foreground"
                  aria-label="Play animation"
                >
                  <Play className="size-3" />
                </button>
                <button
                  type="button"
                  className="p-1 text-muted-foreground transition hover:text-foreground"
                  aria-label="Adjust settings"
                >
                  <SlidersHorizontal className="size-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            COLUMN 3 (Total flex weight: 1.45 + 0.80 + 0.75 = 3.00)
        ════════════════════════════════════════════════════════════════════ */}
        <div className="flex h-full flex-col gap-4 lg:gap-6">
          {/* ─── CARD 7: 3:4 Tall Portrait — Smartphone Mobile AI Frame (Sponsored) ─── */}
          <div
            style={{ flex: "1.45 1 0%" }}
            className="group relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xl transition hover:border-foreground/20 sm:p-6 md:rounded-3xl lg:aspect-auto lg:h-full lg:min-h-0"
          >
            <span className="self-start rounded-full border border-border bg-muted/40 px-2.5 py-0.5 font-mono text-[8px] text-muted-foreground">
              Sponsored
            </span>

            <div className="mx-auto my-auto w-full max-w-[220px] rounded-3xl border border-border bg-neutral-100 p-4 text-foreground shadow-2xl dark:bg-neutral-900">
              <div className="mb-2 flex items-center gap-1.5 font-mono text-[8px] font-bold text-muted-foreground">
                <span className="size-2 rounded-full bg-foreground" />
                <span>MCP</span>
              </div>
              <h4 className="text-xs leading-snug font-bold tracking-tight text-foreground">
                The design references your AI agents are missing.
              </h4>
              <p className="mt-1 text-[9px] leading-tight text-muted-foreground">
                Works with Claude, ChatGPT, Cursor and more.
              </p>
              <div className="mt-3.5 grid grid-cols-4 gap-1.5 border-t border-border pt-2.5">
                {[
                  { bg: "bg-emerald-500/15 border-emerald-500/30" },
                  { bg: "bg-purple-500/15 border-purple-500/30" },
                  { bg: "bg-amber-500/15 border-amber-500/30" },
                  { bg: "bg-sky-500/15 border-sky-500/30" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg ${item.bg} flex items-center justify-center border text-[8px] font-bold text-foreground/80`}
                  />
                ))}
              </div>
            </div>

            <span className="font-mono text-[8px] tracking-wider text-muted-foreground/60 uppercase">
              APP FRAME // MOBILE
            </span>
          </div>

          {/* ─── CARD 8: 4:3 Landscape — Asset Swap Crypto Exchange (BTC to HYPE) ─── */}
          <div
            style={{ flex: "0.8 1 0%" }}
            className="group relative flex aspect-[4/3] w-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xl transition hover:border-foreground/20 sm:p-6 md:rounded-3xl lg:aspect-auto lg:h-full lg:min-h-0"
          >
            <div className="mx-auto my-auto w-full max-w-[260px] space-y-2">
              <div className="flex items-center justify-between rounded-xl border border-border bg-background/80 p-2.5 sm:p-3">
                <div>
                  <span className="block font-mono text-[9px] text-muted-foreground">
                    You pay
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    0.05
                  </span>
                  <span className="block font-mono text-[8px] text-muted-foreground/70">
                    $4,985.00
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 font-mono text-[10px] text-foreground">
                  <span className="flex size-3.5 items-center justify-center rounded-full bg-amber-500 text-[8px] font-bold text-black">
                    ₿
                  </span>
                  <span>BTC</span>
                </div>
              </div>

              <div className="relative z-10 -my-3 flex justify-center">
                <button
                  type="button"
                  className="flex size-6 cursor-pointer items-center justify-center rounded-full border border-border bg-secondary text-foreground shadow-lg transition hover:scale-110 active:scale-95 sm:size-7"
                  aria-label="Swap currencies"
                >
                  <ArrowDown className="size-3 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-border bg-background/80 p-2.5 sm:p-3">
                <div>
                  <span className="block font-mono text-[9px] text-muted-foreground">
                    You receive
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    127.496
                  </span>
                  <span className="block font-mono text-[8px] text-muted-foreground/70">
                    $4,970.35
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 font-mono text-[10px] text-foreground">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  <span>HYPE</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground">
              <span className="rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-muted-foreground">
                Asset swap
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1 text-muted-foreground transition hover:text-foreground"
                  aria-label="Preview swap"
                >
                  <Play className="size-3" />
                </button>
                <button
                  type="button"
                  className="p-1 text-muted-foreground transition hover:text-foreground"
                  aria-label="Swap settings"
                >
                  <SlidersHorizontal className="size-3" />
                </button>
              </div>
            </div>
          </div>

          {/* ─── CARD 9: 4:3 Landscape / Flush Bottom — AI Context Usage Progress Bar ─── */}
          <div
            style={{ flex: "0.75 1 0%" }}
            className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xl transition hover:border-foreground/20 sm:p-6 md:rounded-3xl lg:aspect-auto lg:h-full lg:min-h-0"
          >
            <div className="w-full max-w-[270px] space-y-3 rounded-2xl border border-border bg-background/80 p-4 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between font-mono text-[9px] text-muted-foreground">
                <span className="font-medium text-foreground">Context</span>
                <span className="rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[8px] text-foreground">
                  Compact
                </span>
              </div>

              <div className="font-mono text-base font-bold tracking-tight text-foreground">
                175.6K{" "}
                <span className="text-[10px] font-normal text-muted-foreground">
                  of 200K
                </span>
              </div>

              {/* Segmented Color Bar */}
              <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-md">
                <div className="w-[35%] bg-blue-500" />
                <div className="w-[25%] bg-purple-500" />
                <div className="w-[18%] bg-amber-400" />
                <div className="w-[12%] bg-emerald-400" />
                <div className="w-[10%] bg-rose-500" />
              </div>

              {/* Legend pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[8px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-blue-500" /> Chat
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-purple-500" /> Files
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-amber-400" /> Tools
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400" />{" "}
                  System
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-rose-500" /> Memory
                </span>
              </div>
            </div>

            <span className="absolute bottom-3 left-4 font-mono text-[8px] tracking-wider text-muted-foreground/60 uppercase">
              PROGRESS // SEGMENT_BAR
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
