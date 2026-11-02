import { Link, useNavigate } from "@tanstack/react-router"
import { play } from "cuelume"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code2,
  ExternalLink,
} from "lucide-react"
import type { MDXComponents } from "mdx/types"
import { useMemo } from "react"

import { GridContainer } from "@/app/layouts"
import { ComponentStagePreview } from "@/features/component-ui/components/component-stage-preview"
import { mdxComponents } from "@/features/component-ui/components/mdx-components"
import { CopyButton } from "@/registry/animated/button/copy-button"
import { RailScrollScrubber } from "@/registry/animated/rail-scroll-scrubber"
import { REGISTRY_DEMOS } from "@/registry/demos"
import { siteConfig } from "@/shared/config"
import { useKeyboardShortcuts } from "@/shared/hooks/use-keyboard-shortcuts"
import { useTocRailSections } from "@/shared/hooks/use-toc-rail-sections"
import { extractTocFromMarkdown } from "@/shared/lib"
import {
  Badge,
  Button,
  Kbd,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"
import { CodeBlockCommand } from "@/shared/ui/core/code-block"

import { HOOKS_DATA } from "../hooks-data"
import type { HookItem } from "../types"
import { HookQuickNav } from "./hook-quick-nav"

export interface HookFrontmatter {
  title?: string
  description?: string
  base?: string
  component?: boolean
  links?: {
    doc?: string
    api?: string
  }
  badge?: string
}

interface MdxModuleExport {
  default: React.ComponentType<{
    components?: MDXComponents
  }>
  frontmatter?: HookFrontmatter
}

const mdxModules = import.meta.glob<MdxModuleExport>(
  "../../../content/hooks/*.mdx",
  { eager: true }
)

const rawMdxModules = import.meta.glob<string>("../../../content/hooks/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
})

interface HookDetailProps {
  hook: HookItem
}

export function HookDetail({ hook }: HookDetailProps) {
  const mdxData = useMemo(() => {
    const matchingKey = Object.keys(mdxModules).find((filePath) => {
      const cleanPath = filePath.replace(/\?.*$/, "")
      return cleanPath.endsWith(`/${hook.slug}.mdx`)
    })
    if (!matchingKey) return null
    return {
      Component: mdxModules[matchingKey].default,
      frontmatter: mdxModules[matchingKey].frontmatter,
    }
  }, [hook.slug])

  const LiveDemo = REGISTRY_DEMOS[hook.slug]

  // Find previous and next hooks
  const { prevHook, nextHook } = useMemo(() => {
    const currentIndex = HOOKS_DATA.findIndex((h) => h.id === hook.id)
    const prev = currentIndex > 0 ? HOOKS_DATA[currentIndex - 1] : undefined
    const next =
      currentIndex < HOOKS_DATA.length - 1
        ? HOOKS_DATA[currentIndex + 1]
        : undefined
    return { prevHook: prev, nextHook: next }
  }, [hook.id])

  const navigation = useNavigate()

  useKeyboardShortcuts(
    "left",
    () => {
      if (!prevHook) return
      play("attention", { direction: "back", emphasis: "subtle" })
      navigation({
        to: "/hooks/$category/$slug",
        params: {
          category: prevHook.category,
          slug: prevHook.slug,
        },
      })
    },
    {
      enabled: Boolean(prevHook),
      preventDefault: true,
    }
  )

  useKeyboardShortcuts(
    "right",
    () => {
      if (!nextHook) return
      play("attention", { direction: "forward", emphasis: "subtle" })
      navigation({
        to: "/hooks/$category/$slug",
        params: {
          category: nextHook.category,
          slug: nextHook.slug,
        },
      })
    },
    {
      enabled: Boolean(nextHook),
      preventDefault: true,
    }
  )

  const rawMdxContent = useMemo(() => {
    const matchingKey = Object.keys(rawMdxModules).find((filePath) => {
      const cleanPath = filePath.replace(/\?.*$/, "")
      return cleanPath.endsWith(`/${hook.slug}.mdx`)
    })
    if (matchingKey) {
      const moduleValue = rawMdxModules[matchingKey]
      if (typeof moduleValue === "string") return moduleValue
    }
    return null
  }, [hook.slug])

  const tocItems = useMemo(
    () =>
      rawMdxContent
        ? extractTocFromMarkdown(rawMdxContent, { includeOverview: true })
        : [],
    [rawMdxContent]
  )

  const railSections = useTocRailSections(tocItems)

  const title = mdxData?.frontmatter?.title ?? hook.name
  const description = mdxData?.frontmatter?.description ?? hook.description
  const links = mdxData?.frontmatter?.links

  return (
    <div className="relative w-full">
      <HookQuickNav
        currentCategory={hook.category}
        currentSlug={hook.slug}
        currentTitle={title}
      />

      {railSections.length > 0 && (
        <RailScrollScrubber
          sections={railSections}
          accentColor="var(--primary)"
          showDesktopSectionMenu
        />
      )}

      {/* ── Overview Section ── */}
      <GridContainer
        id="overview"
        borderBottom
        className="relative flex flex-col justify-between gap-6"
      >
        <div className="relative z-10 flex flex-col gap-4 px-4 py-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-mono text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  {title}
                </h1>

                {hook.isNew ? (
                  <Badge
                    variant="outline"
                    className="h-5 gap-1.5 rounded border-primary/30 bg-primary/10 px-2 text-[8px] font-semibold tracking-wider text-primary uppercase shadow-[0_0_10px_var(--pp-primary-glow)]"
                  >
                    New
                  </Badge>
                ) : hook.isUpdated ? (
                  <Badge
                    variant="outline"
                    className="h-5 gap-1.5 rounded border-emerald-500/30 bg-emerald-500/10 px-2 text-[8px] font-semibold tracking-wider text-emerald-600 uppercase shadow-[0_0_10px_rgba(16,185,129,0.25)] dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400"
                  >
                    Updated
                  </Badge>
                ) : null}

                {mdxData?.frontmatter?.badge && (
                  <Badge
                    variant="outline"
                    className="h-5 gap-1.5 rounded border-primary/30 bg-primary px-2 text-[8px] font-semibold tracking-wider text-white uppercase shadow-[0_0_10px_var(--pp-primary-glow)] dark:text-background"
                  >
                    {mdxData.frontmatter.badge}
                  </Badge>
                )}

                <Badge
                  variant="outline"
                  className="h-5 rounded border-emerald-500/30 bg-emerald-500/10 px-2 text-[8px] font-semibold text-emerald-400 uppercase"
                >
                  SSR SAFE
                </Badge>
              </div>

              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {description}
              </p>

              {links && (links.doc || links.api) && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {links.doc && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-7 gap-1.5 rounded-lg border-border/80 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <a href={links.doc} target="_blank" rel="noreferrer">
                        <BookOpen className="size-3 text-pp-primary" />
                        <span>Docs</span>
                        <ExternalLink className="size-2.5 opacity-60" />
                      </a>
                    </Button>
                  )}
                  {links.api && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-7 gap-1.5 rounded-lg border-border/80 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <a href={links.api} target="_blank" rel="noreferrer">
                        <Code2 className="size-3 text-pp-primary" />
                        <span>API Reference</span>
                        <ExternalLink className="size-2.5 opacity-60" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          <CodeBlockCommand name={hook.slug} />
        </div>

        <GridContainer
          borderTop
          showCrosshairs={false}
          className="relative flex flex-col justify-between gap-4 px-4 py-3 md:px-6"
        >
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link to="/hooks">
                <ArrowLeft className="size-3.5" />
                <span className="capitalize">
                  {hook.category.replace("-", " & ")}
                </span>
              </Link>
            </Button>

            <div className="flex items-center gap-2">
              {rawMdxContent && (
                <CopyButton
                  className="relative gap-1.5 bg-accent pr-2.5 pl-2"
                  variant="secondary"
                  size="lg"
                  text={rawMdxContent}
                >
                  Copy Page
                </CopyButton>
              )}

              <div className="flex items-center gap-2">
                {prevHook && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        asChild
                        onClick={() =>
                          play("attention", {
                            direction: "back",
                            emphasis: "subtle",
                          })
                        }
                      >
                        <Link
                          to="/hooks/$category/$slug"
                          params={{
                            category: prevHook.category,
                            slug: prevHook.slug,
                          }}
                        >
                          <ArrowLeft className="size-4 opacity-50" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-[10px]">
                      Previous Hook <Kbd>[</Kbd>
                    </TooltipContent>
                  </Tooltip>
                )}

                {nextHook && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        asChild
                        onClick={() =>
                          play("attention", {
                            direction: "forward",
                            emphasis: "subtle",
                          })
                        }
                      >
                        <Link
                          to="/hooks/$category/$slug"
                          params={{
                            category: nextHook.category,
                            slug: nextHook.slug,
                          }}
                        >
                          <ArrowRight className="size-4 opacity-50" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-[10px]">
                      Next Hook <Kbd>]</Kbd>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </GridContainer>
      </GridContainer>

      {/* ── MDX Render Content Section ── */}
      {mdxData?.Component ? (
        <GridContainer
          id="mdx-content"
          borderBottom
          showCrosshairs
          className="p-4 lg:p-8"
        >
          <div className="mx-auto w-full">
            <mdxData.Component components={mdxComponents} />
          </div>
        </GridContainer>
      ) : LiveDemo ? (
        <GridContainer
          id="interactive-demo"
          borderBottom
          showCrosshairs
          className="p-4 lg:p-8"
        >
          <ComponentStagePreview
            slug={hook.slug}
            liveDemo={LiveDemo}
            code={`// ${hook.name} — documentation coming soon.\n// Install via:\n// npx shadcn@latest add ${siteConfig.registry.namespace}/${hook.slug}`}
          />
        </GridContainer>
      ) : (
        <GridContainer
          id="coming-soon"
          borderBottom
          showCrosshairs
          className="flex flex-col items-center justify-center gap-4 py-20 text-center"
        >
          <p className="text-sm font-medium text-muted-foreground">
            Documentation coming soon.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Install the hook via the command above to get started.
          </p>
        </GridContainer>
      )}
    </div>
  )
}
