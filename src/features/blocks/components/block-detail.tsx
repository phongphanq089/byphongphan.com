/* eslint-disable no-self-assign */
import { Link, useNavigate } from "@tanstack/react-router"
import {
  AppWindowIcon,
  ArrowLeft,
  ArrowRight,
  CodeIcon,
  Laptop,
  Maximize2,
  RotateCw,
  Smartphone,
  Tablet,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { PanelImperativeHandle } from "react-resizable-panels"

import { GridContainer } from "@/app/layouts"
import { cn } from "@/shared/lib"
import {
  Button,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"
import { CodeBlockCommand } from "@/shared/ui/core/code-block"

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
  const initialTab = "preview"
  const [viewport, setViewport] = useState<ViewportMode>("desktop")
  const [activeTab, setActiveTab] = useState<TabMode>(initialTab)
  const navigation = useNavigate()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleTabChange = (value: string) => {
    const nextTab = value as TabMode
    setActiveTab(nextTab)
  }

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
    return (
      resolvedFiles.find((f) => f.path === "app/page.tsx")?.path ??
      resolvedFiles.find((f) => f.path === "editor.tsx")?.path ??
      resolvedFiles.find((f) => f.path === "app/not-found.tsx")?.path ??
      resolvedFiles[0]?.path ??
      null
    )
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

  const panelRef = useRef<PanelImperativeHandle | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleSetViewport = useCallback((mode: ViewportMode) => {
    setViewport(mode)
    if (panelRef.current) {
      switch (mode) {
        case "desktop":
          panelRef.current.resize("100%")
          break
        case "tablet":
          panelRef.current.resize("60%")
          break
        case "mobile":
          panelRef.current.resize("32%")
          break
      }
    }
  }, [])

  useEffect(() => {
    const handlePointerUp = () => {
      setIsDragging(false)
    }
    window.addEventListener("pointerup", handlePointerUp)
    return () => {
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [])

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
                <span className="rounded-sm border border-border bg-muted/60 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                  {block.category}
                </span>
              </div>

              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {block.description}
              </p>
            </div>

            <Button variant="outline" asChild>
              <Link to="/blocks">
                <ArrowLeft className="size-3.5" />
                <span>All Blocks</span>
              </Link>
            </Button>
          </div>

          {/* CLI Install Command */}
          <CodeBlockCommand name={block.slug} className="mt-2" />
        </div>
      </GridContainer>

      <GridContainer
        borderBottom
        borderTop={false}
        className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4"
      >
        <Button
          variant="link"
          onClick={() => navigation({ to: `/blocks/${block.category}` })}
          className="capitalize"
        >
          <ArrowLeft className="size-3.5" />
          <span> {block.category}</span>
        </Button>

        <div className="flex items-center gap-2">
          {prevBlock && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" asChild>
                  <Link
                    to="/blocks/$category/$slug"
                    params={{
                      category: prevBlock.category,
                      slug: prevBlock.slug,
                    }}
                  >
                    <ArrowLeft className="size-4 opacity-50" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px]">
                Previous Block
              </TooltipContent>
            </Tooltip>
          )}

          {nextBlock && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" asChild>
                  <Link
                    to="/blocks/$category/$slug"
                    params={{
                      category: nextBlock.category,
                      slug: nextBlock.slug,
                    }}
                  >
                    <ArrowRight className="size-4 opacity-50" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px]">
                Next Block
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </GridContainer>

      {/* ── 2. Interactive Controls Bar ── */}
      <GridContainer
        borderBottom
        showCrosshairs
        className="flex flex-wrap items-center justify-between gap-3"
      >
        <Tabs
          defaultValue="preview"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="flex w-full items-center justify-between gap-2 border-b px-3 py-3 max-md:hidden sm:px-4">
            <TabsList>
              <TabsTrigger value="preview">
                <AppWindowIcon className="max-sm:hidden" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code">
                <CodeIcon className="max-sm:hidden" />
                Code
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              {activeTab === "preview" && (
                <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-muted/30 p-1">
                  {(
                    [
                      {
                        mode: "desktop" as const,
                        icon: Laptop,
                        title: "Desktop",
                      },
                      {
                        mode: "tablet" as const,
                        icon: Tablet,
                        title: "Tablet",
                      },
                      {
                        mode: "mobile" as const,
                        icon: Smartphone,
                        title: "Mobile",
                      },
                    ] as const
                  ).map(({ mode, icon: Icon, title }) => (
                    <Tooltip key={mode}>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className={cn(
                            "transition-all",
                            viewport === mode
                              ? "bg-primary! text-background"
                              : ""
                          )}
                          onClick={() => handleSetViewport(mode)}
                        >
                          <Icon className="size-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-[10px]">
                        {title}
                      </TooltipContent>
                    </Tooltip>
                  ))}

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
                      <TooltipContent side="top" className="text-[10px]">
                        Reload preview
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          asChild
                          className="size-7"
                        >
                          <Link
                            to="/blocks-preview/$slug"
                            params={{ slug: block.slug }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Maximize2 className="size-3.5" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-[10px]">
                        Fullscreen
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </div>

          <TabsContent value="preview">
            <div
              className={cn(
                "flex w-full items-center justify-center px-3 py-3 sm:px-4"
              )}
            >
              <div className="w-full">
                <ResizablePanelGroup
                  direction="horizontal"
                  className="relative min-h-[600px] w-full rounded-md border border-border/60 bg-accent shadow-2xl sm:min-h-[700px] md:rounded-xl lg:min-h-[800px] lg:rounded-2xl"
                >
                  <ResizablePanel
                    panelRef={panelRef}
                    defaultSize="100%"
                    minSize="25%"
                    className="relative overflow-hidden bg-background"
                  >
                    <div className="relative h-full w-full">
                      {isDragging && (
                        <div className="absolute inset-0 z-50 bg-transparent" />
                      )}
                      <iframe
                        ref={iframeRef}
                        src={`/blocks-preview/${block.slug}`}
                        title={`${block.title} Preview`}
                        className="h-full w-full border-none bg-background"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  </ResizablePanel>

                  <ResizableHandle
                    withHandle
                    className="z-20 bg-border/60"
                    onPointerDown={() => setIsDragging(true)}
                  />

                  <ResizablePanel defaultSize="0%" minSize="0%" />
                </ResizablePanelGroup>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="code" className="mt-0 pt-0">
            <div className="flex h-[600px] gap-2 p-4 sm:h-[700px] lg:h-[800px]">
              <div className="w-56 overflow-y-auto rounded-md border-r border-border/60 bg-accent p-1.5 lg:w-64">
                <div className="border-b border-border/60 px-2 py-2">
                  <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                    Files
                  </span>
                </div>
                <div className="w-full rounded bg-transparent">
                  <BlockFileTree
                    key={block.slug}
                    files={resolvedFiles}
                    tree={fileTree}
                    activeFile={currentActivePath}
                    onSelectFile={setActiveFilePath}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-hidden rounded bg-accent p-1.5">
                <div className="h-full w-full rounded bg-background">
                  <BlockCodeViewer file={activeFile} />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </GridContainer>
    </div>
  )
}
