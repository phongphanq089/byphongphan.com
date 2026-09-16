import { Link } from "@tanstack/react-router"
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
import { REGISTRY_ITEMS } from "@/registry"
import { CopyButton } from "@/registry/animated/button/copy-button"
import { REGISTRY_DEMOS } from "@/registry/demos"
import { siteConfig } from "@/shared/config"
import { extractTocFromMarkdown } from "@/shared/lib"
import { Button } from "@/shared/ui/core"
import { CodeBlockCommand, convertNpmCommand } from "@/shared/ui/core"
import { TOCMinimap } from "@/shared/ui/system/toc-minimap"

import { COMPONENTS_DATA } from "../components-data"
import type { ComponentItem } from "../types"
import { ComponentStagePreview } from "./component-stage-preview"
import { mdxComponents } from "./mdx-components"

export interface ComponentFrontmatter {
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
  frontmatter?: ComponentFrontmatter
}

const mdxModules = import.meta.glob<MdxModuleExport>(
  "../../../content/components/*.mdx",
  { eager: true }
)

const rawMdxModules = import.meta.glob<string>(
  "../../../content/components/*.mdx",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
)

interface ComponentDetailProps {
  component: ComponentItem
}

export function ComponentDetail({ component }: ComponentDetailProps) {
  const mdxData = useMemo(() => {
    const matchingKey = Object.keys(mdxModules).find((filePath) => {
      const cleanPath = filePath.replace(/\?.*$/, "")
      return cleanPath.endsWith(`/${component.slug}.mdx`)
    })
    if (!matchingKey) return null
    return {
      Component: mdxModules[matchingKey].default,
      frontmatter: mdxModules[matchingKey].frontmatter,
    }
  }, [component.slug])

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

  // A component is in the custom registry when it has a corresponding registry entry
  const registryItem = REGISTRY_ITEMS.find((r) => r.name === component.slug)
  const source = registryItem
    ? `${siteConfig.url}/r/${component.slug}.json`
    : component.slug

  const baseCommand = `npx shadcn@latest add ${source}`

  const rawMdxContent = useMemo(() => {
    const matchingKey = Object.keys(rawMdxModules).find((filePath) => {
      const cleanPath = filePath.replace(/\?.*$/, "")
      return cleanPath.endsWith(`/${component.slug}.mdx`)
    })
    if (matchingKey) {
      const moduleValue = rawMdxModules[matchingKey]
      if (typeof moduleValue === "string") return moduleValue
    }
    return null
  }, [component.slug])

  const tocItems = useMemo(
    () =>
      rawMdxContent
        ? extractTocFromMarkdown(rawMdxContent, { includeOverview: true })
        : [],
    [rawMdxContent]
  )

  const title = mdxData?.frontmatter?.title ?? component.name
  const description = mdxData?.frontmatter?.description ?? component.description
  const links = mdxData?.frontmatter?.links

  return (
    <div className="relative w-full">
      {tocItems.length > 0 && (
        <div className="fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 lg:block">
          <TOCMinimap items={tocItems} />
        </div>
      )}

      <GridContainer
        id="overview"
        borderBottom
        className="relative flex flex-col justify-between gap-6"
      >
        <div className="relative z-10 flex flex-col gap-4 px-4 py-3 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="section-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                  {title}
                </h1>

                {(mdxData?.frontmatter?.badge ?? component.badge) && (
                  <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400">
                    {mdxData?.frontmatter?.badge ?? component.badge}
                  </span>
                )}
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

          <CodeBlockCommand {...convertNpmCommand(baseCommand)} />
        </div>

        <GridContainer
          borderTop
          showCrosshairs={false}
          className="relative flex flex-col justify-between gap-4 px-4 py-3 md:px-4"
        >
          <div className="flex items-center justify-between">
            <Button variant={"ghost"} asChild>
              <Link to={`/component-ui/${component.category}` as never}>
                <ArrowLeft className="size-3.5" />
                <span className="capitalize">{component.category}</span>
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
                {prevComponent ? (
                  <Button variant="secondary" size="icon" asChild>
                    <Link
                      to="/component-ui/$category/$slug"
                      params={{
                        category: prevComponent.category,
                        slug: prevComponent.slug,
                      }}
                    >
                      <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                ) : null}

                {nextComponent ? (
                  <Button variant="secondary" size="icon" asChild>
                    <Link
                      to="/component-ui/$category/$slug"
                      params={{
                        category: nextComponent.category,
                        slug: nextComponent.slug,
                      }}
                    >
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </GridContainer>
      </GridContainer>

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
            slug={component.slug}
            schematicType={component.schematicType}
            liveDemo={LiveDemo}
            code={`// ${component.name} — documentation coming soon.\n// Install via:\n// ${baseCommand}`}
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
            Install the component via the command above to get started.
          </p>
        </GridContainer>
      )}
    </div>
  )
}
