import { Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  Copy,
  Eye,
  Laptop,
  Smartphone,
  Tablet,
  Terminal,
} from "lucide-react"
import { useMemo, useState } from "react"

import { GridContainer } from "@/app/layouts"
import { cn } from "@/shared/lib"
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"

import { BLOCKS_DATA } from "../blocks-data"
import type { BlockItem } from "../types"
import { RenderBlockSchematic } from "./schematics"

interface BlockDetailProps {
  block: BlockItem
}

type ViewportMode = "desktop" | "tablet" | "mobile"
type TabMode = "preview" | "code"

export const BlockDetail = ({ block }: BlockDetailProps) => {
  const [viewport, setViewport] = useState<ViewportMode>("desktop")
  const [activeTab, setActiveTab] = useState<TabMode>("preview")
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [packageManager, setPackageManager] = useState<"pnpm" | "npm" | "bun">(
    "pnpm"
  )

  // Find previous and next blocks
  const { prevBlock, nextBlock } = useMemo(() => {
    const currentIndex = BLOCKS_DATA.findIndex((b) => b.id === block.id)
    const prev = currentIndex > 0 ? BLOCKS_DATA[currentIndex - 1] : undefined
    const next =
      currentIndex < BLOCKS_DATA.length - 1
        ? BLOCKS_DATA[currentIndex + 1]
        : undefined
    return { prevBlock: prev, nextBlock: next }
  }, [block.id])

  const installCommand = useMemo(() => {
    switch (packageManager) {
      case "pnpm":
        return `pnpm dlx shadcn@latest add @shadcn-blocks/${block.slug}`
      case "npm":
        return `npx shadcn@latest add @shadcn-blocks/${block.slug}`
      case "bun":
        return `bunx --bun shadcn@latest add @shadcn-blocks/${block.slug}`
      default:
        return `npx shadcn@latest add @shadcn-blocks/${block.slug}`
    }
  }, [packageManager, block.slug])

  const handleCopyInstall = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(installCommand)
      setCopiedInstall(true)
      setTimeout(() => setCopiedInstall(false), 2000)
    }
  }

  const sampleCode = useMemo(() => {
    const pascalTitle = block.title.replace(/[^a-zA-Z0-9]/g, "")
    return `import React from "react"

export function ${pascalTitle}Block() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-16 text-foreground md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Block Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className=" text-xs font-semibold text-primary uppercase">
            ${block.category}
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            ${block.title}
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            ${block.description}
          </p>
        </div>

        {/* Content Container */}
        <div className="mt-12">
          {/* ${block.title} component layout */}
        </div>
      </div>
    </section>
  )
}
`
  }, [block.title, block.category, block.description])

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sampleCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const viewportWidthClass = useMemo(() => {
    switch (viewport) {
      case "mobile":
        return "max-w-[390px]"
      case "tablet":
        return "max-w-[768px]"
      default:
        return "w-full max-w-6xl 2xl:max-w-7xl"
    }
  }, [viewport])

  return (
    <div className="w-full">
      {/* 1. Header Hero Section */}
      <GridContainer
        borderTop
        borderBottom
        showCrosshairs
        className="relative flex flex-col justify-between gap-6 overflow-hidden px-4 py-8 sm:px-8 md:py-12"
      >
        {/* Ambient Radial Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-pp-primary/10 blur-3xl dark:bg-pp-primary/15" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/blocks"
              className="transition-colors hover:text-foreground"
            >
              Blocks
            </Link>
            <span>/</span>
            <Link
              to="/blocks/$category"
              params={{ category: block.category }}
              className="capitalize transition-colors hover:text-foreground"
            >
              {block.category}
            </Link>
            <span>/</span>
            <span className="font-semibold text-pp-primary">{block.title}</span>
          </div>

          {/* Title & Pro Badge Row (Image 2) */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {block.isPro && (
                  <span className="flex items-center rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
                    Pro
                  </span>
                )}
                <h1 className="section-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                  {block.title}
                </h1>
                <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                  {block.category}
                </span>
              </div>

              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {block.description}
              </p>
            </div>

            {/* Back Button */}
            <Link
              to="/blocks"
              className="flex items-center gap-2 rounded-lg border border-border/80 bg-background/80 px-3.5 py-2 text-xs font-medium text-foreground transition-all hover:border-pp-primary/60 hover:bg-pp-primary/10 hover:text-pp-primary active:scale-98"
            >
              <ArrowLeft className="size-3.5" />
              <span>All Blocks</span>
            </Link>
          </div>

          {/* CLI Install Snippet Box */}
          <div className="mt-2 flex flex-col gap-2 rounded-xl border border-black/10 bg-black/60 p-3 shadow-md backdrop-blur-md sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1">
                <Terminal className="size-3.5 text-white/60" />
                <div className="flex items-center gap-1 text-[11px] text-white/60">
                  {(["pnpm", "npm", "bun"] as const).map((pm) => (
                    <button
                      key={pm}
                      type="button"
                      onClick={() => setPackageManager(pm)}
                      className={cn(
                        "rounded px-1.5 py-0.5 transition-colors",
                        packageManager === pm
                          ? "bg-white/20 font-bold text-white"
                          : "hover:text-white"
                      )}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>

              <code className="max-w-[280px] truncate text-xs text-white/90 sm:max-w-md">
                {installCommand}
              </code>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={handleCopyInstall}
                  className="flex h-7 items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 text-xs text-white transition-colors hover:bg-white/20 active:scale-95"
                >
                  {copiedInstall ? (
                    <>
                      <Check className="size-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} className="text-[10px]">
                {copiedInstall
                  ? "Copied command!"
                  : "Copy installation command"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </GridContainer>

      {/* 2. Interactive Controls & Viewport Switcher */}
      <GridContainer
        borderBottom
        showCrosshairs
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8"
      >
        {/* Tab Switcher: Preview / Code */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
              activeTab === "preview"
                ? "border-pp-primary/60 bg-pp-primary/10 text-pp-primary shadow-xs"
                : "border-border/60 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Eye className="size-3.5" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
              activeTab === "code"
                ? "border-pp-primary/60 bg-pp-primary/10 text-pp-primary shadow-xs"
                : "border-border/60 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Code2 className="size-3.5" />
            <span>Code</span>
          </button>
        </div>

        {/* Viewport Width Switcher (Desktop, Tablet, Mobile) */}
        {activeTab === "preview" && (
          <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={cn(
                "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-all",
                viewport === "desktop"
                  ? "bg-background font-bold text-foreground shadow-xs"
                  : "hover:text-foreground"
              )}
              title="Desktop View"
            >
              <Laptop className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport("tablet")}
              className={cn(
                "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-all",
                viewport === "tablet"
                  ? "bg-background font-bold text-foreground shadow-xs"
                  : "hover:text-foreground"
              )}
              title="Tablet View"
            >
              <Tablet className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={cn(
                "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-all",
                viewport === "mobile"
                  ? "bg-background font-bold text-foreground shadow-xs"
                  : "hover:text-foreground"
              )}
              title="Mobile View"
            >
              <Smartphone className="size-3.5" />
            </button>
          </div>
        )}
      </GridContainer>

      {/* 3. Tab Content Viewport */}
      <GridContainer
        borderBottom
        showCrosshairs
        className="flex items-center justify-center p-4 sm:p-8 md:p-12"
      >
        {activeTab === "preview" && (
          <div
            className={cn(
              "relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-black/60 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-[#0c0c0f]",
              viewportWidthClass
            )}
          >
            {/* Ambient Radial Spotlight */}
            <div className="pointer-events-none absolute inset-0 bg-radial from-white/[0.05] to-transparent" />

            {/* Schematic Render */}
            <div className="relative z-10 flex h-full w-full max-w-4xl scale-110 items-center justify-center sm:scale-125">
              <RenderBlockSchematic type={block.schematicType} />
            </div>
          </div>
        )}

        {activeTab === "code" && (
          <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/90 p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-amber-500/80" />
                <div className="size-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs text-white/50">
                  {block.slug}.tsx
                </span>
              </div>

              <Button
                type="button"
                onClick={handleCopyCode}
                className="flex h-7 items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-2.5 text-xs text-white hover:bg-white/20 active:scale-95"
              >
                {copiedCode ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </Button>
            </div>

            <pre className="mt-4 overflow-x-auto text-xs leading-relaxed text-white/90">
              <code>{sampleCode}</code>
            </pre>
          </div>
        )}
      </GridContainer>

      {/* 4. Pagination / Next & Previous Navigation */}
      <GridContainer
        borderBottom
        showCrosshairs
        className="flex flex-col gap-4 p-4 sm:p-8 md:flex-row md:items-center md:justify-between"
      >
        {prevBlock ? (
          <Link
            to="/blocks/$category/$slug"
            params={{ category: prevBlock.category, slug: prevBlock.slug }}
            className="group flex items-center gap-3 rounded-xl border border-border/80 bg-background/60 p-4 transition-all hover:border-pp-primary/60 hover:bg-pp-primary/10"
          >
            <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground transition-transform group-hover:-translate-x-0.5 group-hover:text-foreground">
              <ArrowLeft className="size-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-muted-foreground uppercase">
                Previous Block
              </span>
              <span className="font-bold text-foreground transition-colors group-hover:text-pp-primary">
                {prevBlock.title}
              </span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextBlock ? (
          <Link
            to="/blocks/$category/$slug"
            params={{ category: nextBlock.category, slug: nextBlock.slug }}
            className="group flex items-center justify-end gap-3 rounded-xl border border-border/80 bg-background/60 p-4 text-right transition-all hover:border-pp-primary/60 hover:bg-pp-primary/10"
          >
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-muted-foreground uppercase">
                Next Block
              </span>
              <span className="font-bold text-foreground transition-colors group-hover:text-pp-primary">
                {nextBlock.title}
              </span>
            </div>
            <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground">
              <ArrowRight className="size-4" />
            </div>
          </Link>
        ) : (
          <div />
        )}
      </GridContainer>
    </div>
  )
}
