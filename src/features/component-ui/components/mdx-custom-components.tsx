import React, { useMemo } from "react"

import { REGISTRY_DEMOS } from "@/registry/demos"
import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockExpandButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
} from "@/registry/ui/code-block"
import { SELECT_VARIANTS } from "@/registry/variants/select-variants"
import { cn } from "@/shared/lib"
import {
  Tabs,
  TabsContent as TabsContentPrimitive,
  TabsList as TabsListPrimitive,
  TabsTrigger as TabsTriggerPrimitive,
} from "@/shared/ui/core/tabs"

import { ComponentStagePreview } from "./component-stage-preview"

const REGISTRY_SOURCES = import.meta.glob<string>(
  "/src/registry/**/*.{tsx,ts}",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
)

/**
 * Resolves raw source code directly from files in /src/registry.
 * Prioritizes live demo files (e.g. select-demo.tsx) so demos are 100% single-source-of-truth.
 */
function resolveRegistrySource(
  name?: string,
  title?: string
): string | undefined {
  if (!name && !title) return undefined

  if (name) {
    const cleanName = name.replace(/-demo$/, "")
    const candidates = [
      `/demos/${name}.tsx`,
      `/demos/${cleanName}-demo.tsx`,
      `/demos/${cleanName}.tsx`,
      `/ui/${name}.tsx`,
      `/ui/${cleanName}.tsx`,
      `/ui/${name}/index.ts`,
      `/ui/${name}/${name}.tsx`,
      `/ui/${cleanName}/index.ts`,
      `/ui/${cleanName}/${cleanName}.tsx`,
      `/animated/${name}.tsx`,
      `/animated/${cleanName}.tsx`,
      `/${name}.tsx`,
      `/${cleanName}.tsx`,
    ]

    for (const suffix of candidates) {
      const matchedKey = Object.keys(REGISTRY_SOURCES).find((key) =>
        key.endsWith(suffix)
      )
      if (matchedKey && REGISTRY_SOURCES[matchedKey]) {
        return REGISTRY_SOURCES[matchedKey]
      }
    }
  }

  if (title) {
    const normalizedTitle = title.replace(/^components\//, "")
    const matchedTitleKey = Object.keys(REGISTRY_SOURCES).find((key) =>
      key.endsWith(normalizedTitle)
    )
    if (matchedTitleKey && REGISTRY_SOURCES[matchedTitleKey]) {
      return REGISTRY_SOURCES[matchedTitleKey]
    }
  }

  return undefined
}

// Map of all variants for ComponentPreview lookup
const VARIANTS_MAP = new Map(SELECT_VARIANTS.map((v) => [v.id, v]))

export interface ComponentPreviewProps {
  name: string
  styleName?: string
  previewClassName?: string
  direction?: "ltr" | "rtl"
  className?: string
}

export function ComponentPreview({
  name,
  previewClassName,
  direction,
  className,
}: ComponentPreviewProps) {
  // 1. Check direct REGISTRY_DEMOS
  const cleanName = name.replace(/-demo$/, "")
  const LiveDemo =
    REGISTRY_DEMOS[name] ??
    REGISTRY_DEMOS[cleanName] ??
    VARIANTS_MAP.get(name)?.component ??
    VARIANTS_MAP.get(cleanName)?.component

  // 2. Resolve code: First directly from the actual source file in REGISTRY_SOURCES, then VARIANTS_MAP
  const sampleCode =
    resolveRegistrySource(name) ??
    resolveRegistrySource(cleanName) ??
    VARIANTS_MAP.get(name)?.code ??
    VARIANTS_MAP.get(cleanName)?.code ??
    `// Code preview for ${name}`

  return (
    <div
      dir={direction}
      className={cn("my-6 w-full", previewClassName, className)}
    >
      <ComponentStagePreview
        slug={cleanName}
        liveDemo={LiveDemo}
        code={sampleCode}
      />
    </div>
  )
}

export function CodeTabs({
  children,
  defaultValue = "cli",
  className,
  ...props
}: React.ComponentProps<typeof Tabs>) {
  return (
    <Tabs
      defaultValue={defaultValue}
      className={cn("my-6 flex w-full flex-col gap-3", className)}
      {...props}
    >
      {children}
    </Tabs>
  )
}

export function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsListPrimitive>) {
  return (
    <TabsListPrimitive
      className={cn(
        "min-h-10 items-center justify-start rounded-lg border border-border/60 bg-muted px-1 py-3 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsTriggerPrimitive>) {
  return (
    <TabsTriggerPrimitive
      className={cn(
        "h-7 rounded-sm px-3 text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs",
        className
      )}
      {...props}
    />
  )
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsContentPrimitive>) {
  return (
    <TabsContentPrimitive
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
}

export function Steps({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "steps mb-8 ml-4 space-y-4 border-l border-border/80 pl-6 [counter-reset:step]",
        className
      )}
      {...props}
    />
  )
}

export function Step({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "relative text-sm font-medium text-foreground [counter-increment:step] before:absolute before:top-0 before:-left-[36px] before:flex before:size-6 before:items-center before:justify-center before:rounded-full before:border before:border-border before:bg-accent before:text-xs before:font-bold before:text-muted-foreground before:content-[counter(step)]",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export interface ComponentSourceProps {
  name?: string
  title?: string
  src?: string
  code?: string
  className?: string
}

export function ComponentSource({
  name,
  title,
  code: explicitCode,
  className,
}: ComponentSourceProps) {
  const resolvedCode = useMemo(() => {
    if (explicitCode) return explicitCode
    return (
      resolveRegistrySource(name, title) ??
      `// Source implementation for ${title ?? name ?? "component"}`
    )
  }, [explicitCode, name, title])

  const displayTitle = title ?? (name ? `${name}.tsx` : "component.tsx")
  const language =
    displayTitle.endsWith(".ts") || displayTitle.endsWith(".tsx")
      ? "tsx"
      : displayTitle.endsWith(".css")
        ? "css"
        : "bash"

  return (
    <div className={cn("my-4 w-full", className)}>
      <CodeBlock
        code={resolvedCode}
        language={language}
        maxLines={18}
        showLineNumbers
        className="rounded-lg"
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{displayTitle}</CodeBlockTitle>
          <CodeBlockLanguage />
          <div className="ml-auto flex items-center gap-1">
            <CodeBlockCopyButton />
            <CodeBlockExpandButton />
          </div>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}
