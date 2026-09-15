import React, { useMemo } from "react"

import { REGISTRY_DEMO_CODES, REGISTRY_DEMOS } from "@/registry/demos"
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

  const sampleCode =
    REGISTRY_DEMO_CODES[name] ??
    REGISTRY_DEMO_CODES[cleanName] ??
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
    if (name) {
      // 1. Check direct file in /src/registry/ui/${name}.tsx
      const uiKey = `/src/registry/ui/${name}.tsx`
      if (REGISTRY_SOURCES[uiKey]) return REGISTRY_SOURCES[uiKey]

      // 2. Check subdirectory index in /src/registry/ui/${name}/index.ts
      const dirIndexKey = `/src/registry/ui/${name}/index.ts`
      if (REGISTRY_SOURCES[dirIndexKey]) return REGISTRY_SOURCES[dirIndexKey]

      // 3. Check subdirectory component in /src/registry/ui/${name}/${name}.tsx
      const dirComponentKey = `/src/registry/ui/${name}/${name}.tsx`
      if (REGISTRY_SOURCES[dirComponentKey])
        return REGISTRY_SOURCES[dirComponentKey]

      // 4. Check any registry file matching /${name}.tsx
      const matchedKey = Object.keys(REGISTRY_SOURCES).find(
        (key) =>
          key.endsWith(`/${name}.tsx`) || key.endsWith(`/${name}/index.ts`)
      )
      if (matchedKey && REGISTRY_SOURCES[matchedKey]) {
        return REGISTRY_SOURCES[matchedKey]
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
    if (name && REGISTRY_DEMO_CODES[name]) return REGISTRY_DEMO_CODES[name]
    return `// Source implementation for ${title ?? name ?? "component"}`
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
        showLineNumbers
        maxLines={24}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{displayTitle}</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
        <CodeBlockExpandButton />
      </CodeBlock>
    </div>
  )
}
