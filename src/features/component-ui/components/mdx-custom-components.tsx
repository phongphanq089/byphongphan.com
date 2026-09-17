import React, { useMemo } from "react"

import { REGISTRY_ITEMS } from "@/registry"
import { REGISTRY_DEMOS } from "@/registry/demos"
import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockExpandButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
} from "@/registry/ui/code-block"
import { VARIANTS_MAP } from "@/registry/variants"
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

const DYNAMIC_VARIANT_MODULES = import.meta.glob<{
  default?: React.ComponentType
  [key: string]: unknown
}>("/src/registry/variants/**/*.{tsx,ts}", { eager: true })

/**
 * Resolves demo/example source code for ComponentPreview and VariantModal.
 * Checks demos first, then any variant subfolder dynamically.
 */
export function resolveDemoSource(name?: string): string | undefined {
  if (!name) return undefined
  const cleanName = name.replace(/-demo$/, "")

  // 1. Check direct demo candidates
  const candidates = [
    `/demos/${name}.tsx`,
    `/demos/${cleanName}-demo.tsx`,
    `/demos/${cleanName}.tsx`,
    `/${name}.tsx`,
  ]

  for (const suffix of candidates) {
    const matchedKey = Object.keys(REGISTRY_SOURCES).find((key) =>
      key.endsWith(suffix)
    )
    if (matchedKey && REGISTRY_SOURCES[matchedKey]) {
      return REGISTRY_SOURCES[matchedKey]
    }
  }

  // 2. Dynamic lookup in /variants/ across any component subfolder (e.g. /variants/card/card-with-image.tsx, /variants/select/icon-select.tsx)
  const matchedVariantKey = Object.keys(REGISTRY_SOURCES).find(
    (key) =>
      key.includes("/variants/") &&
      (key.endsWith(`/${name}.tsx`) || key.endsWith(`/${cleanName}.tsx`))
  )
  if (matchedVariantKey && REGISTRY_SOURCES[matchedVariantKey]) {
    return REGISTRY_SOURCES[matchedVariantKey]
  }

  // 3. Check VARIANTS_MAP code property
  return VARIANTS_MAP.get(name)?.code ?? VARIANTS_MAP.get(cleanName)?.code
}

/** Backward compatibility alias */
export const resolveRegistrySource = resolveDemoSource

/**
 * Resolves actual UI component source code for ComponentSource ("Copy and paste into your project").
 * Always targets the real component in /src/registry/ui/ or /src/registry/animated/, NEVER the demo file.
 */
export function resolveComponentSource(
  name?: string,
  title?: string
): string | undefined {
  if (!name && !title) return undefined

  // 1. If name matches a registry item, look up its target file path directly
  if (name) {
    const registryItem = REGISTRY_ITEMS.find((item) => item.name === name)
    if (registryItem && registryItem.files.length > 0) {
      const primaryPath = registryItem.files[0].path
      const foundKey = Object.keys(REGISTRY_SOURCES).find((k) =>
        k.endsWith(primaryPath.replace(/^src\//, ""))
      )
      if (foundKey && REGISTRY_SOURCES[foundKey]) {
        return REGISTRY_SOURCES[foundKey]
      }
    }
  }

  // 2. If title is given (e.g. "components/ui/select.tsx"), match by filename
  if (title) {
    const normalizedTitle = title
      .replace(/^components\//, "")
      .replace(/^\/?/, "/")
    const matchedKey = Object.keys(REGISTRY_SOURCES).find(
      (key) => !key.includes("/demos/") && key.endsWith(normalizedTitle)
    )
    if (matchedKey && REGISTRY_SOURCES[matchedKey]) {
      return REGISTRY_SOURCES[matchedKey]
    }
  }

  // 3. Fallback candidates strictly within /ui/ or /animated/
  if (name) {
    const candidates = [
      `/ui/${name}.tsx`,
      `/ui/${name}/index.ts`,
      `/ui/${name}/${name}.tsx`,
      `/animated/${name}.tsx`,
      `/animated/${name}/index.ts`,
      `/animated/${name}/${name}.tsx`,
      `/hooks/${name}.ts`,
      `/hooks/${name}.tsx`,
      `/ui/${name.replace(/-demo$/, "")}.tsx`,
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

  return undefined
}

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
  // 1. Check direct REGISTRY_DEMOS, then registered VARIANTS_MAP, then dynamic VARIANT_MODULES
  const cleanName = name.replace(/-demo$/, "")

  let LiveDemo: React.ComponentType | undefined =
    REGISTRY_DEMOS[name] ??
    REGISTRY_DEMOS[cleanName] ??
    VARIANTS_MAP.get(name)?.component ??
    VARIANTS_MAP.get(cleanName)?.component

  if (!LiveDemo) {
    const matchedModuleKey = Object.keys(DYNAMIC_VARIANT_MODULES).find(
      (key) =>
        !key.endsWith("-variants.tsx") &&
        !key.endsWith("/index.ts") &&
        (key.endsWith(`/${name}.tsx`) || key.endsWith(`/${cleanName}.tsx`))
    )
    if (matchedModuleKey) {
      const mod = DYNAMIC_VARIANT_MODULES[matchedModuleKey]
      LiveDemo = (mod.default ??
        Object.values(mod).find((val) => typeof val === "function")) as
        React.ComponentType | undefined
    }
  }

  // 2. Resolve demo code: First from live demo/variant files, then VARIANTS_MAP
  const sampleCode =
    resolveDemoSource(name) ??
    resolveDemoSource(cleanName) ??
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
      resolveComponentSource(name, title) ??
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
