/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Check,
  Copy,
  Grid3X3,
  Layers,
  Layout,
  Palette,
  Sparkles,
  Terminal,
  Type,
} from "lucide-react"
import React, { useState } from "react"

import { Crosshair, GridContainer } from "@/app/layouts"
import { cn } from "@/shared/lib"
import {
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"
import { PPPixelMark } from "@/shared/ui/icons"
import { StripedPattern } from "@/shared/ui/system"

interface ColorToken {
  name: string
  cssVar: string
  value: string
  bgClass: string
  borderClass?: string
  description: string
  textClass?: string
}

const COLOR_TOKENS: ColorToken[] = [
  {
    name: "Brand Accent",
    cssVar: "--pp-primary",
    value: "#dc2626 / oklch(0.55 0.22 27)",
    bgClass: "bg-pp-primary",
    description: "Main signature brand red accent",
  },
  {
    name: "Canvas Backdrop",
    cssVar: "--background",
    value: "#09090b / oklch(0.12 0 0)",
    bgClass: "bg-background",
    borderClass: "border border-border",
    description: "Default page background color",
  },
  {
    name: "Surface Card",
    cssVar: "--card",
    value: "#121215 / oklch(0.15 0 0)",
    bgClass: "bg-card",
    borderClass: "border border-border",
    description: "Surface card container level",
  },
  {
    name: "Muted Background",
    cssVar: "--muted",
    value: "#18181b / oklch(0.20 0 0)",
    bgClass: "bg-muted",
    borderClass: "border border-border/40",
    textClass: "text-muted-foreground",
    description: "Secondary subdued panels and chips",
  },
  {
    name: "Accent Hover",
    cssVar: "--accent",
    value: "#27272a / oklch(0.25 0 0)",
    bgClass: "bg-accent",
    borderClass: "border border-border/60",
    description: "Interactive hover surfaces",
  },
  {
    name: "Dividing Border",
    cssVar: "--border",
    value: "oklch(1 0 0 / 12%)",
    bgClass: "bg-border",
    description: "Grid lines, dividers, and card borders",
  },
  {
    name: "Destructive Alert",
    cssVar: "--destructive",
    value: "#ef4444 / oklch(0.60 0.20 25)",
    bgClass: "bg-destructive",
    description: "Error states, destructive actions",
  },
  {
    name: "Online / Success",
    cssVar: "--success",
    value: "#10b981 / oklch(0.65 0.17 160)",
    bgClass: "bg-emerald-500",
    description: "Status indicators, active telemetry",
  },
]

const TYPOGRAPHY_SCALES = [
  {
    token: "Display / Hero",
    classKey: "text-4xl sm:text-5xl font-extrabold",
    size: "48px / 3rem",
    weight: "800 ExtraBold",
    sample: "Pixel-perfect Craft & Architecture",
  },
  {
    token: "Section Heading (H2)",
    classKey: "text-2xl sm:text-3xl font-bold",
    size: "30px / 1.875rem",
    weight: "700 Bold",
    sample: "Fluid Motion & Primitives",
  },
  {
    token: "Component Title (H3)",
    classKey: "text-lg sm:text-xl font-semibold",
    size: "20px / 1.25rem",
    weight: "600 SemiBold",
    sample: "Unboxing Bucket Animation",
  },
  {
    token: "Body Regular",
    classKey: "text-sm leading-relaxed",
    size: "14px / 0.875rem",
    weight: "400 Regular",
    sample:
      "A modern, high-craft personal developer portfolio and interactive UI component blocks showcase.",
  },
  {
    token: "Telemetry / Eyebrow",
    classKey: "text-[11px]  tracking-widest uppercase",
    size: "11px / 0.6875rem",
    weight: "600 SemiBold Mono",
    sample: "// 01. CORE DESIGN SPECIFICATION",
  },
  {
    token: "Micro Monospace",
    classKey: "text-[10px]  text-muted-foreground",
    size: "10px / 0.625rem",
    weight: "500 Medium Mono",
    sample: "SHA-256: 7dfa1830 · 60FPS · REACT 19",
  },
]

const RADIUS_TOKENS = [
  { name: "rounded-xs", px: "2px", classKey: "rounded-xs" },
  { name: "rounded-sm", px: "4px", classKey: "rounded-sm" },
  { name: "rounded-md", px: "6px", classKey: "rounded-md" },
  { name: "rounded-lg", px: "8px", classKey: "rounded-lg", isDefault: true },
  { name: "rounded-xl", px: "12px", classKey: "rounded-xl" },
  { name: "rounded-2xl", px: "16px", classKey: "rounded-2xl" },
  { name: "rounded-full", px: "9999px", classKey: "rounded-full" },
]

export function FoundationsView() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [customSpecimenText, setCustomSpecimenText] = useState(
    "Design engineering with 60fps fluid physics & Radix UI primitives"
  )
  const [activeTab, setActiveTab] = useState<
    "colors" | "typography" | "containers" | "radius" | "brand"
  >("colors")

  const handleCopy = (key: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    }
  }

  const rawLogoSvg = `<svg viewBox="0 0 96 64" width="96" height="64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 8H34V16H44V34H34V42H18V56H8V8ZM18 20H34V30H18V20Z" fill="currentColor" fill-rule="evenodd"/>
  <path d="M52 8H78V16H88V34H78V42H62V56H52V8ZM62 20H78V30H62V20Z" fill="currentColor" fill-rule="evenodd"/>
</svg>`

  return (
    <div className="w-full">
      {/* ── Sub-Navigation Pill Bar ──────────────────────────────────────── */}
      <GridContainer borderBottom showCrosshairs className="p-0">
        <div className="no-scrollbar flex w-full items-stretch overflow-x-auto">
          {[
            { id: "colors", label: "01. COLORS & PALETTE", icon: Palette },
            { id: "typography", label: "02. TYPOGRAPHY", icon: Type },
            { id: "containers", label: "03. GRID & CONTAINERS", icon: Layout },
            { id: "radius", label: "04. RADIUS & ELEVATION", icon: Layers },
            { id: "brand", label: "05. BRAND ASSETS", icon: Sparkles },
          ].map((tab) => {
            const isSelected = activeTab === tab.id
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex shrink-0 items-center gap-2 border-r border-border px-4 py-3 text-xs font-bold tracking-wider uppercase transition-colors sm:px-5",
                  isSelected
                    ? "bg-muted font-extrabold text-foreground dark:bg-white/10 dark:text-white"
                    : "text-muted-foreground/70 hover:bg-white/[0.04] hover:text-foreground"
                )}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
          <StripedPattern />
        </div>
      </GridContainer>

      {/* ── SECTION 01: Color Tokens & Theme Palettes ────────────────────── */}
      {activeTab === "colors" && (
        <>
          <GridContainer
            borderBottom
            showCrosshairs
            className="flex flex-col gap-2 p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-pp-primary uppercase">
              <Palette className="size-4" />
              <span>Theme Color Tokens</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Semantic Palette & CSS Variables
            </h2>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Standardized semantic tokens adhering strictly to OKLCH perceptual
              color fidelity. Hover any swatch to inspect and copy variable
              names directly.
            </p>
          </GridContainer>

          <GridContainer
            columns={2}
            borderBottom
            showCrosshairs
            className="w-full"
          >
            {COLOR_TOKENS.map((token, idx) => (
              <div
                key={token.name}
                className={cn(
                  "flex flex-col justify-between p-4 sm:p-6",
                  idx % 2 === 0 ? "border-b border-border md:border-b-0" : "",
                  idx < COLOR_TOKENS.length - 2
                    ? "md:border-b md:border-border"
                    : ""
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground">
                      {token.name}
                    </h3>
                    <code className="text-xs text-pp-primary">
                      var({token.cssVar})
                    </code>
                    <p className="text-xs text-muted-foreground">
                      {token.description}
                    </p>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(token.cssVar, `var(${token.cssVar})`)
                        }
                        className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/30 text-muted-foreground transition-all hover:border-pp-primary/60 hover:bg-pp-primary/10 hover:text-pp-primary"
                      >
                        {copiedKey === token.cssVar ? (
                          <Check className="size-3 text-emerald-400" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-[10px]">
                      {copiedKey === token.cssVar
                        ? "Copied variable!"
                        : "Copy var() string"}
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div
                  className={cn(
                    "mt-4 flex h-20 w-full items-center justify-between rounded-lg p-3 shadow-inner sm:h-24 sm:p-4",
                    token.bgClass,
                    token.borderClass
                  )}
                >
                  <span className="rounded bg-black/40 px-2 py-1 text-[10px] text-white/90 backdrop-blur-md">
                    {token.value}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-full bg-black/30 px-2 py-0.5 text-[10px] text-white/80">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    <span>Active Token</span>
                  </div>
                </div>
              </div>
            ))}
          </GridContainer>
        </>
      )}

      {/* ── SECTION 02: Typography & Font System ─────────────────────────── */}
      {activeTab === "typography" && (
        <>
          <GridContainer
            borderBottom
            showCrosshairs
            className="flex flex-col gap-2 p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-pp-primary uppercase">
              <Type className="size-4" />
              <span>Typography Hierarchy</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Geist Sans & Geist Mono System
            </h2>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Typecraft featuring primary UI typography by Vercel's Geist
              Variable font, paired with technical monospace telemetry font
              Geist Mono for numbers and code markers.
            </p>
          </GridContainer>

          {/* Interactive Live Font Tester */}
          <GridContainer borderBottom showCrosshairs className="p-4 sm:p-6">
            <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-card p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Interactive Specimen Playground
                </span>
                <span className="text-[11px] text-muted-foreground/60">
                  Live Preview • Type below to test
                </span>
              </div>
              <Input
                type="text"
                value={customSpecimenText}
                onChange={(e) => setCustomSpecimenText(e.target.value)}
                placeholder="Type any test sentence..."
                className="h-10 text-sm font-medium"
              />
              <div className="mt-2 rounded-lg border border-border/40 bg-muted/20 p-4">
                <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {customSpecimenText || "Type text above to test"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {customSpecimenText || "Type text above to test"}
                </p>
              </div>
            </div>
          </GridContainer>

          {/* Typography Scale Table */}
          <GridContainer borderBottom showCrosshairs className="p-0">
            <div className="divide-y divide-border">
              {TYPOGRAPHY_SCALES.map((scale) => (
                <div
                  key={scale.token}
                  className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-6"
                >
                  <div className="flex min-w-[200px] flex-col gap-1">
                    <span className="text-xs font-bold text-foreground">
                      {scale.token}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{scale.size}</span>
                      <span>•</span>
                      <span>{scale.weight}</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <p
                      className={cn(
                        "truncate text-foreground transition-colors",
                        scale.classKey
                      )}
                    >
                      {scale.sample}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GridContainer>
        </>
      )}

      {/* ── SECTION 03: Grid & Containers Architecture ───────────────────── */}
      {activeTab === "containers" && (
        <>
          <GridContainer
            borderBottom
            showCrosshairs
            className="flex flex-col gap-2 p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-pp-primary uppercase">
              <Grid3X3 className="size-4" />
              <span>Container System</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              GridContainer & Blueprint Mathematics
            </h2>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              The architectural scaffolding powering every page. Features
              standard compact container vs expanded wide block container,
              reticle crosshairs (+), and dividing border vectors.
            </p>
          </GridContainer>

          {/* Container Width Specimen */}
          <GridContainer
            columns={2}
            borderBottom
            showCrosshairs
            className="w-full"
          >
            {/* 1. Default Container */}
            <div className="flex flex-col gap-3 border-b border-border p-6 md:border-b-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  Default Container
                </h3>
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                  max-w-5xl (1024px)
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Optimized reading and browsing width applied across Home,
                Components, Blog, and Resources pages.
              </p>
              <div className="mt-3 rounded-lg border border-dashed border-border/80 bg-muted/20 p-4">
                <div className="h-10 rounded-sm border border-border bg-card p-2 text-center text-xs text-foreground">
                  Content Width = 1024px
                </div>
              </div>
            </div>

            {/* 2. Wide Container for Blocks */}
            <div className="flex flex-col gap-3 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  Wide Blocks Container
                </h3>
                <span className="rounded bg-pp-primary/10 px-2 py-0.5 text-[10px] font-bold text-pp-primary">
                  max-w-7xl 2xl:max-w-[1400px]
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Expanded wide canvas applied exclusively across Blocks catalog
                and detail pages for desktop mockups.
              </p>
              <div className="mt-3 rounded-lg border border-dashed border-pp-primary/40 bg-pp-primary/5 p-4">
                <div className="h-10 rounded-sm border border-pp-primary/30 bg-card p-2 text-center text-xs text-pp-primary">
                  Content Width = 1280px - 1400px
                </div>
              </div>
            </div>
          </GridContainer>

          {/* Blueprint Column Matrix Visualization */}
          <GridContainer borderBottom showCrosshairs className="p-6">
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Column Division Archetypes (1, 2, 3 Columns)
            </h3>
            <div className="space-y-4">
              {/* 1-Col */}
              <div className="relative flex h-12 items-center justify-center rounded-lg border border-border bg-card text-xs text-muted-foreground">
                <Crosshair className="top-[-6px] left-[-6px]" />
                <Crosshair className="top-[-6px] right-[-6px]" />
                <span>columns = 1 (Full Width Blueprint)</span>
              </div>

              {/* 2-Col */}
              <div className="relative grid grid-cols-2 rounded-lg border border-border bg-card">
                <div className="flex h-12 items-center justify-center border-r border-border text-xs text-muted-foreground">
                  Col 1 (50%)
                </div>
                <div className="flex h-12 items-center justify-center text-xs text-muted-foreground">
                  Col 2 (50%)
                </div>
              </div>

              {/* 3-Col */}
              <div className="relative grid grid-cols-3 rounded-lg border border-border bg-card">
                <div className="flex h-12 items-center justify-center border-r border-border text-xs text-muted-foreground">
                  Col 1 (33.3%)
                </div>
                <div className="flex h-12 items-center justify-center border-r border-border text-xs text-muted-foreground">
                  Col 2 (33.3%)
                </div>
                <div className="flex h-12 items-center justify-center text-xs text-muted-foreground">
                  Col 3 (33.3%)
                </div>
              </div>
            </div>
          </GridContainer>
        </>
      )}

      {/* ── SECTION 04: Radius & Elevation Tokens ────────────────────────── */}
      {activeTab === "radius" && (
        <>
          <GridContainer
            borderBottom
            showCrosshairs
            className="flex flex-col gap-2 p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-pp-primary uppercase">
              <Layers className="size-4" />
              <span>Corner Radius Tokens</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Strict Design System Radii
            </h2>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Per strict project rules, arbitrary border radius values (e.g.
              rounded-[13px]) are strictly forbidden. All primitives map to
              standardized token scales below.
            </p>
          </GridContainer>

          <GridContainer
            columns={3}
            borderBottom
            showCrosshairs
            className="w-full"
          >
            {RADIUS_TOKENS.map((token, idx) => (
              <div
                key={token.name}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-6 text-center",
                  idx % 3 !== 2 ? "border-b border-border md:border-b-0" : ""
                )}
              >
                <div
                  className={cn(
                    "flex size-20 items-center justify-center border border-border bg-muted/60 shadow-md transition-all hover:border-pp-primary hover:bg-pp-primary/10",
                    token.classKey
                  )}
                >
                  <span className="text-[10px] font-bold text-foreground">
                    {token.px}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground">
                    {token.name}
                  </span>
                  {token.isDefault && (
                    <span className="block text-[10px] font-semibold text-pp-primary">
                      (Default Card Radius)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </GridContainer>
        </>
      )}

      {/* ── SECTION 05: Brand Assets & Monogram ──────────────────────────── */}
      {activeTab === "brand" && (
        <>
          <GridContainer
            borderBottom
            showCrosshairs
            className="flex flex-col gap-2 p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-pp-primary uppercase">
              <Sparkles className="size-4" />
              <span>Brand Monogram</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Official PP Pixel Mark
            </h2>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Geometric 8-bit stepped pixel monogram for Phong Phan. Features
              chamfered corners, hollow inner counters, and neon glow variants.
            </p>
          </GridContainer>

          <GridContainer
            columns={3}
            borderBottom
            showCrosshairs
            className="w-full"
          >
            {/* Solid */}
            <div className="flex flex-col items-center gap-4 border-b border-border p-6 md:border-b-0">
              <div className="flex h-28 items-center justify-center">
                <PPPixelMark size={56} className="text-foreground" />
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-foreground">
                  Solid Monochrome
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Default text-foreground
                </p>
              </div>
            </div>

            {/* Brand Primary */}
            <div className="flex flex-col items-center gap-4 border-b border-border p-6 md:border-b-0">
              <div className="flex h-28 items-center justify-center">
                <PPPixelMark size={56} className="text-pp-primary" />
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-pp-primary">
                  PP Primary Red
                </span>
                <p className="text-[11px] text-muted-foreground">
                  var(--pp-primary)
                </p>
              </div>
            </div>

            {/* Glow */}
            <div className="flex flex-col items-center gap-4 p-6">
              <div className="flex h-28 items-center justify-center">
                <PPPixelMark
                  size={56}
                  variant="glow"
                  className="text-pp-primary"
                />
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-pp-primary">
                  Neon Glow
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Interactive state & hero
                </p>
              </div>
            </div>
          </GridContainer>

          {/* Quick Copy Snippet */}
          <GridContainer borderBottom showCrosshairs className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Terminal className="size-4 text-pp-primary" />
                <span>Import:</span>
                <code className="rounded bg-muted px-2 py-0.5 text-foreground">
                  {`import { PPPixelMark } from "@/shared/ui/icons"`}
                </code>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy("raw-logo", rawLogoSvg)}
                className="gap-1.5 text-xs"
              >
                {copiedKey === "raw-logo" ? (
                  <Check className="size-3 text-emerald-400" />
                ) : (
                  <Copy className="size-3" />
                )}
                <span>
                  {copiedKey === "raw-logo" ? "Copied SVG!" : "Copy SVG Code"}
                </span>
              </Button>
            </div>
          </GridContainer>
        </>
      )}
    </div>
  )
}
