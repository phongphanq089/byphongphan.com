import { Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Copy,
  Eye,
  Layers,
  Sparkles,
  Terminal,
} from "lucide-react"
import type { MDXComponents } from "mdx/types"
import { useMemo, useState } from "react"

import { GridContainer } from "@/app/layouts"
import { REGISTRY_DEMO_CODES, REGISTRY_DEMOS } from "@/registry/demos"
import { siteConfig } from "@/shared/config"
import { cn } from "@/shared/lib"
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"
import { TableOfContents, type TOCItem } from "@/shared/ui/system"

import { COMPONENTS_DATA } from "../components-data"
import type { ComponentItem } from "../types"
import { mdxComponents } from "./mdx-components"
import { RenderSchematic } from "./schematics"

const mdxModules = import.meta.glob<{
  default: React.ComponentType<{
    components?: MDXComponents
  }>
}>("../../../content/components/*.mdx", { eager: true })

interface ComponentDetailProps {
  component: ComponentItem
}

const COMPONENT_TOC_ITEMS: TOCItem[] = [
  { id: "overview", title: "Overview", depth: 2 },
  { id: "installation", title: "Installation", depth: 2 },
  { id: "cli-setup", title: "CLI Command", depth: 3 },
  { id: "interactive-demo", title: "Interactive Demo", depth: 2 },
  { id: "code-implementation", title: "Code Usage", depth: 3 },
  { id: "api-props", title: "API & Props", depth: 3 },
  { id: "navigation", title: "Related Components", depth: 2 },
]

type TabMode = "doc" | "preview" | "code" | "props"

export function ComponentDetail({ component }: ComponentDetailProps) {
  const MdxComponent = useMemo(() => {
    const matchingKey = Object.keys(mdxModules).find((filePath) =>
      filePath.endsWith(`/${component.slug}.mdx`)
    )
    return matchingKey ? mdxModules[matchingKey].default : null
  }, [component.slug])

  const [activeTab, setActiveTab] = useState<TabMode>(
    MdxComponent ? "doc" : "preview"
  )
  const [copiedInstall, setCopiedInstall] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [packageManager, setPackageManager] = useState<"pnpm" | "npm" | "bun">(
    "pnpm"
  )

  const LiveDemo = REGISTRY_DEMOS[component.slug]

  // Find previous and next components
  const { prevComponent, nextComponent } = useMemo(() => {
    const currentIndex = COMPONENTS_DATA.findIndex((c) => c.id === component.id)
    const prev =
      currentIndex > 0 ? COMPONENTS_DATA[currentIndex - 1] : undefined
    const next =
      currentIndex < COMPONENTS_DATA.length - 1
        ? COMPONENTS_DATA[currentIndex + 1]
        : undefined
    return { prevComponent: prev, nextComponent: next }
  }, [component.id])

  const installCommand = useMemo(() => {
    const isCustomRegistry = Boolean(REGISTRY_DEMOS[component.slug])
    const source = isCustomRegistry
      ? `${siteConfig.url}/r/${component.slug}.json`
      : component.slug

    switch (packageManager) {
      case "pnpm":
        return `pnpm dlx shadcn@latest add ${source}`
      case "npm":
        return `npx shadcn@latest add ${source}`
      case "bun":
        return `bunx --bun shadcn@latest add ${source}`
      default:
        return `npx shadcn@latest add ${source}`
    }
  }, [packageManager, component.slug])

  const handleCopyInstall = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(installCommand)
      setCopiedInstall(true)
      setTimeout(() => setCopiedInstall(false), 2000)
    }
  }

  const sampleCode = useMemo(() => {
    if (REGISTRY_DEMO_CODES[component.slug]) {
      return REGISTRY_DEMO_CODES[component.slug]
    }
    const pascalName = component.name.replace(/[^a-zA-Z0-9]/g, "")
    return `import * as React from "react"
import { ${pascalName} } from "@/components/ui/${component.slug}"

export function ${pascalName}Demo() {
  return (
    <div className="flex items-center justify-center p-8">
      <${pascalName}>
        {/* Component content */}
      </${pascalName}>
    </div>
  )
}
`
  }, [component.name, component.slug])

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sampleCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const tocItems = useMemo<TOCItem[]>(() => {
    if (MdxComponent) {
      return [
        { id: "overview", title: "Overview", depth: 2 },
        { id: "variants-showcase", title: "Variants", depth: 2 },
        { id: "installation", title: "Installation", depth: 2 },
        { id: "usage", title: "Usage", depth: 2 },
        { id: "anatomy", title: "Anatomy", depth: 2 },
        { id: "api-reference", title: "API reference", depth: 2 },
        { id: "navigation", title: "Related Components", depth: 2 },
      ]
    }
    return COMPONENT_TOC_ITEMS
  }, [MdxComponent])

  const handleTocItemClick = (id: string) => {
    if (id === "code-implementation") {
      setActiveTab("code")
    } else if (id === "api-props") {
      setActiveTab("props")
    } else if (id === "interactive-demo") {
      setActiveTab("preview")
    }
  }

  return (
    <div className="relative w-full">
      {/* Fixed Table of Contents on Desktop Screens (outside container) */}
      <aside className="pointer-events-auto fixed top-28 right-4 z-30 hidden w-52 xl:block min-[1400px]:right-auto min-[1400px]:left-[calc(50%+33rem)] 2xl:right-12">
        <TableOfContents
          items={tocItems}
          title="ON THIS PAGE"
          icon={<BookOpen className="size-3.5 opacity-80" />}
          onItemClick={handleTocItemClick}
        />
      </aside>

      {/* 1. Header Hero Section */}
      <GridContainer
        id="overview"
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
              to="/component-ui"
              className="transition-colors hover:text-foreground"
            >
              Components
            </Link>
            <span>/</span>
            <span className="font-semibold text-pp-primary">
              {component.name}
            </span>
          </div>

          {/* Title & Category Badge Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="section-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                  {component.name}
                </h1>
                {component.count !== undefined && (
                  <span className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white shadow-xs">
                    {component.count}
                  </span>
                )}
                {component.badge && (
                  <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400">
                    {component.badge}
                  </span>
                )}
              </div>

              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {component.description}
              </p>
            </div>

            {/* Back Button */}
            <Link
              to="/component-ui"
              className="flex items-center gap-2 rounded-lg border border-border/80 bg-background/80 px-3.5 py-2 text-xs font-medium text-foreground transition-all hover:border-pp-primary/60 hover:bg-pp-primary/10 hover:text-pp-primary active:scale-98"
            >
              <ArrowLeft className="size-3.5" />
              <span>All Components</span>
            </Link>
          </div>

          {/* CLI Install Snippet Box */}
          <div
            id="installation"
            className="mt-2 flex flex-col gap-2 rounded-xl border border-black/10 bg-black/60 p-3 shadow-md backdrop-blur-md sm:flex-row sm:items-center sm:justify-between dark:border-white/10"
          >
            <div id="cli-setup" className="flex items-center gap-3">
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

      {/* 2. Interactive Showcase Tabs & Preview Stage */}
      <GridContainer
        id="interactive-demo"
        borderBottom
        showCrosshairs
        className="px-4 py-3 sm:px-8"
      >
        <div className="flex items-center gap-1.5">
          {MdxComponent && (
            <button
              type="button"
              onClick={() => setActiveTab("doc")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                activeTab === "doc"
                  ? "border-pp-primary/60 bg-pp-primary/10 text-pp-primary shadow-xs"
                  : "border-border/60 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <BookOpen className="size-3.5" />
              <span>Documentation</span>
            </button>
          )}

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
            <span>{MdxComponent ? "Sandbox" : "Preview"}</span>
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

          {!MdxComponent && (
            <button
              type="button"
              onClick={() => setActiveTab("props")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                activeTab === "props"
                  ? "border-pp-primary/60 bg-pp-primary/10 text-pp-primary shadow-xs"
                  : "border-border/60 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Layers className="size-3.5" />
              <span>API & Props</span>
            </button>
          )}
        </div>
      </GridContainer>

      {/* 3. Tab Content Viewport */}
      <GridContainer borderBottom showCrosshairs className="p-4 sm:p-8 md:p-12">
        {activeTab === "doc" && MdxComponent && (
          <div className="mx-auto w-full max-w-4xl py-2">
            <MdxComponent components={mdxComponents} />
          </div>
        )}
        {activeTab === "preview" && (
          <div className="relative flex min-h-[380px] w-full items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-black/60 p-8 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#0c0c0f]">
            {/* Ambient Radial Spotlight */}
            <div className="pointer-events-none absolute inset-0 bg-radial from-white/[0.05] to-transparent" />

            {/* Live Interactive Demo or Schematic Fallback */}
            <div className="relative z-10 flex items-center justify-center">
              {LiveDemo ? (
                <div className="flex items-center justify-center p-6">
                  <LiveDemo />
                </div>
              ) : (
                <div className="scale-110 sm:scale-125">
                  <RenderSchematic type={component.schematicType} />
                </div>
              )}
            </div>

            {/* Stage Footer Note */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[10px] text-muted-foreground/60">
              <Sparkles className="size-3 text-pp-primary" />
              <span>
                {LiveDemo
                  ? "Interactive live component stage"
                  : "Pixel-perfect dark schematic stage"}
              </span>
            </div>
          </div>
        )}

        {activeTab === "code" && (
          <div
            id="code-implementation"
            className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/90 p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-amber-500/80" />
                <div className="size-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs text-white/50">
                  {component.slug}.tsx
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

        {activeTab === "props" && (
          <div
            id="api-props"
            className="flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 shadow-xl backdrop-blur-md"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/60">
                    <th className="pb-3 font-semibold">Prop</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Default</th>
                    <th className="pb-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  <tr>
                    <td className="py-3 font-bold text-pp-primary">
                      className
                    </td>
                    <td className="py-3 text-muted-foreground">string</td>
                    <td className="py-3 text-muted-foreground">undefined</td>
                    <td className="py-3">
                      Custom CSS classes merged via cn utility.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-pp-primary">children</td>
                    <td className="py-3 text-muted-foreground">
                      React.ReactNode
                    </td>
                    <td className="py-3 text-muted-foreground">undefined</td>
                    <td className="py-3">
                      Component children and interactive nodes.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-pp-primary">asChild</td>
                    <td className="py-3 text-muted-foreground">boolean</td>
                    <td className="py-3 text-muted-foreground">false</td>
                    <td className="py-3">
                      Change the default rendered element for a passed child.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-bold text-pp-primary">disabled</td>
                    <td className="py-3 text-muted-foreground">boolean</td>
                    <td className="py-3 text-muted-foreground">false</td>
                    <td className="py-3">
                      When true, prevents user interaction and applies muted
                      opacity.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </GridContainer>

      {/* 4. Pagination / Next & Previous Navigation */}
      <GridContainer
        id="navigation"
        borderBottom
        showCrosshairs
        className="flex flex-col gap-4 p-4 sm:p-8 md:flex-row md:items-center md:justify-between"
      >
        {prevComponent ? (
          <Link
            to="/component-ui/$slug"
            params={{ slug: prevComponent.slug }}
            className="group flex items-center gap-3 rounded-xl border border-border/80 bg-background/60 p-4 transition-all hover:border-pp-primary/60 hover:bg-pp-primary/10"
          >
            <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground transition-transform group-hover:-translate-x-0.5 group-hover:text-foreground">
              <ArrowLeft className="size-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-muted-foreground uppercase">
                Previous Component
              </span>
              <span className="font-bold text-foreground transition-colors group-hover:text-pp-primary">
                {prevComponent.name}
              </span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextComponent ? (
          <Link
            to="/component-ui/$slug"
            params={{ slug: nextComponent.slug }}
            className="group flex items-center justify-end gap-3 rounded-xl border border-border/80 bg-background/60 p-4 text-right transition-all hover:border-pp-primary/60 hover:bg-pp-primary/10"
          >
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-muted-foreground uppercase">
                Next Component
              </span>
              <span className="font-bold text-foreground transition-colors group-hover:text-pp-primary">
                {nextComponent.name}
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
