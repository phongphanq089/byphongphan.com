/* eslint-disable no-self-assign */
import { Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Eye,
  Laptop,
  Maximize2,
  Minimize2,
  RotateCw,
  Smartphone,
  Tablet,
} from "lucide-react"
import { useCallback, useMemo, useRef, useState } from "react"

import { GridContainer } from "@/app/layouts"
import { siteConfig } from "@/shared/config"
import { cn } from "@/shared/lib"
import {
  Button,
  CodeBlockCommand,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"

import { buildFileTree, resolveBlockFiles } from "../block-files"
import { BLOCKS_DATA } from "../blocks-data"
import type { BlockItem, ResolvedBlockFile } from "../types"
import { BlockCodeViewer } from "./block-code-viewer"
import { BlockFileTree } from "./block-file-tree"

interface BlockDetailProps {
  block: BlockItem
}

type ViewportMode = "desktop" | "tablet" | "mobile"
type TabMode = "preview" | "code"

export function BlockDetail({ block }: BlockDetailProps) {
  const [viewport, setViewport] = useState<ViewportMode>("desktop")
  const [activeTab, setActiveTab] = useState<TabMode>("preview")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Resolve block source files from the registry
  const resolvedFiles = useMemo(() => resolveBlockFiles(block), [block])
  const fileTree = useMemo(() => buildFileTree(resolvedFiles), [resolvedFiles])

  // Track which file is selected in the code view
  const [activeFilePath, setActiveFilePath] = useState<string | null>(null)

  const currentActivePath = useMemo(() => {
    if (
      activeFilePath &&
      resolvedFiles.some((f) => f.path === activeFilePath)
    ) {
      return activeFilePath
    }
    return resolvedFiles[0]?.path ?? null
  }, [activeFilePath, resolvedFiles])

  const activeFile = useMemo<ResolvedBlockFile | null>(
    () => resolvedFiles.find((f) => f.path === currentActivePath) ?? null,
    [resolvedFiles, currentActivePath]
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

  const handleReloadIframe = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }, [])

  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  const viewportWidthClass = useMemo(() => {
    switch (viewport) {
      case "mobile":
        return "max-w-[390px]"
      case "tablet":
        return "max-w-[768px]"
      default:
        return "w-full"
    }
  }, [viewport])

  const installSource = `${siteConfig.url}/r/${block.slug}.json`

  console.log(installSource, "================  installSource ============")

  return (
    <div className="w-full">
      {/* ── 1. Hero Header ── */}
      <GridContainer
        borderTop
        borderBottom
        showCrosshairs
        className="relative flex flex-col justify-between gap-6 overflow-hidden px-4 py-8 sm:px-8 md:py-12"
      >
        {/* Ambient Radial Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-pp-primary/10 blur-3xl dark:bg-pp-primary/15" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Breadcrumb */}
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

          {/* Title Row */}
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

          {/* CLI Install Command */}
          <CodeBlockCommand name={block.slug} className="mt-2" />
        </div>
      </GridContainer>

      {/* ── 2. Interactive Controls Bar ── */}
      <GridContainer
        borderBottom
        showCrosshairs
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8"
      >
        {/* Tab Switcher: Preview / Code */}
        <div className="flex items-center gap-1.5">
          <Button
            variant={activeTab === "preview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "gap-1.5 text-xs",
              activeTab === "preview" &&
                "border-pp-primary/60 bg-pp-primary/10 text-pp-primary shadow-xs hover:bg-pp-primary/15 hover:text-pp-primary"
            )}
          >
            <Eye className="size-3.5" />
            <span>Preview</span>
          </Button>

          <Button
            variant={activeTab === "code" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("code")}
            className={cn(
              "gap-1.5 text-xs",
              activeTab === "code" &&
                "border-pp-primary/60 bg-pp-primary/10 text-pp-primary shadow-xs hover:bg-pp-primary/15 hover:text-pp-primary"
            )}
          >
            <Code2 className="size-3.5" />
            <span>Code</span>
          </Button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Viewport Switcher (Preview only) */}
          {activeTab === "preview" && (
            <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-muted/30 p-1">
              {(
                [
                  { mode: "desktop" as const, icon: Laptop, title: "Desktop" },
                  { mode: "tablet" as const, icon: Tablet, title: "Tablet" },
                  {
                    mode: "mobile" as const,
                    icon: Smartphone,
                    title: "Mobile",
                  },
                ] as const
              ).map(({ mode, icon: Icon, title }) => (
                <Tooltip key={mode}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => setViewport(mode)}
                      className={cn(
                        "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-all",
                        viewport === mode
                          ? "bg-background font-bold text-foreground shadow-xs"
                          : "hover:text-foreground"
                      )}
                    >
                      <Icon className="size-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-[10px]">
                    {title}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}

          {/* Reload & Fullscreen (Preview only) */}
          {activeTab === "preview" && (
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleReloadIframe}
                    className="size-7"
                  >
                    <RotateCw className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[10px]">
                  Reload preview
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleToggleFullscreen}
                    className="size-7"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="size-3.5" />
                    ) : (
                      <Maximize2 className="size-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-[10px]">
                  {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </GridContainer>

      {/* ── 3. Tab Content ── */}
      <GridContainer borderBottom showCrosshairs className="p-0">
        {activeTab === "preview" && (
          <div
            className={cn(
              "flex items-center justify-center p-4 sm:p-8 md:p-12",
              isFullscreen && "fixed inset-0 z-50 bg-background p-0"
            )}
          >
            <div
              className={cn(
                "relative mx-auto overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-2xl transition-all duration-300",
                viewportWidthClass,
                isFullscreen
                  ? "h-full w-full rounded-none border-none"
                  : "h-[600px] sm:h-[700px] lg:h-[800px]"
              )}
            >
              <iframe
                ref={iframeRef}
                src={`/blocks-preview/${block.slug}`}
                title={`${block.title} Preview`}
                className="h-full w-full border-none bg-background"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        )}

        {activeTab === "code" && (
          <div className="flex h-[600px] sm:h-[700px] lg:h-[800px]">
            {/* File Tree Sidebar */}
            <div className="w-56 shrink-0 overflow-y-auto border-r border-border/60 bg-muted/10 lg:w-64">
              <div className="border-b border-border/60 px-4 py-2.5">
                <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                  Files
                </span>
              </div>
              <BlockFileTree
                tree={fileTree}
                activeFile={currentActivePath}
                onSelectFile={setActiveFilePath}
              />
            </div>

            {/* Code Viewer */}
            <div className="flex-1 overflow-hidden bg-background">
              <BlockCodeViewer file={activeFile} />
            </div>
          </div>
        )}
      </GridContainer>

      {/* ── 4. Prev / Next Navigation ── */}
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
