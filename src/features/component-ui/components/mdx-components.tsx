import React from "react"

import {
  CodeBlock as CoreCodeBlock,
  CodeBlockCopyButton,
  markdownCodeProps,
} from "@/registry/ui/code-block"
import { siteConfig } from "@/shared/config"
import { cn, extractTextFromNode, slugify } from "@/shared/lib"
import { CodeBlockCommand } from "@/shared/ui/core"

import { ApiReference } from "./api-reference"
import { InstallationGuide } from "./installation-guide"
import {
  CodeTabs,
  ComponentPreview,
  ComponentSource,
  Step,
  Steps,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./mdx-custom-components"
import { UsageGuide } from "./usage-guide"
import { VariantsGrid } from "./variants-grid"

export function SiteUrl({
  path = "",
  className,
}: {
  path?: string
  className?: string
}) {
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : ""
  const fullUrl = `${siteConfig.url}${cleanPath}`
  return (
    <span className={cn("font-mono text-xs text-primary", className)}>
      {fullUrl}
    </span>
  )
}

function MdxCodeBlock(
  props: React.HTMLAttributes<HTMLPreElement> & { "data-code"?: string }
) {
  const { code, language } = markdownCodeProps(props)
  const rawCode = (code || props["data-code"] || "").trim()

  if (!rawCode) {
    return (
      <pre
        className={cn(
          "overflow-x-auto p-4 text-xs leading-relaxed text-foreground",
          props.className
        )}
        {...props}
      />
    )
  }

  // Normalize site url placeholders like @site or {siteUrl}
  const finalCode = rawCode
    .replaceAll("@site", siteConfig.url)
    .replaceAll("{{siteUrl}}", siteConfig.url)
    .replaceAll("{siteUrl}", siteConfig.url)

  // Automatically render single-line package/CLI commands with CodeBlockCommand
  const isCliCommand =
    (language === "bash" || language === "sh" || language === "shell") &&
    !finalCode.includes("\n") &&
    /^(npx|npm\s+(install|i|create|run)|pnpm\s+(add|dlx|create)|yarn\s+(add|dlx|create)|bun\s+(add|x))\b/.test(
      finalCode
    )

  if (isCliCommand) {
    return <CodeBlockCommand command={finalCode} className="my-4" />
  }

  return (
    <CoreCodeBlock
      code={finalCode}
      language={language}
      className={cn("my-4", props.className)}
    >
      <CodeBlockCopyButton position="pinned" />
    </CoreCodeBlock>
  )
}

export const mdxComponents = {
  h1: ({
    className,
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || slugify(extractTextFromNode(children))
    return (
      <h1
        id={headingId}
        className={cn(
          "mt-2 mb-4 scroll-m-20 text-3xl font-bold tracking-tight text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </h1>
    )
  },
  h2: ({
    className,
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || slugify(extractTextFromNode(children))
    return (
      <h2
        id={headingId}
        className={cn(
          "mt-8 mb-3 scroll-m-20 text-xl font-semibold tracking-tight text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </h2>
    )
  },
  h3: ({
    className,
    children,
    id,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const headingId = id || slugify(extractTextFromNode(children))
    return (
      <h3
        id={headingId}
        className={cn(
          "mt-6 mb-2 scroll-m-20 text-base font-semibold tracking-tight text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </h3>
    )
  },
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "text-sm leading-relaxed text-muted-foreground [&:not(:first-child)]:mt-3",
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn(
        "my-4 ml-6 list-disc text-sm text-muted-foreground [&>li]:mt-1.5",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn(
        "my-4 ml-6 list-decimal text-sm text-muted-foreground [&>li]:mt-1.5",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn(
        "mt-4 border-l-2 border-primary/60 pl-4 text-xs text-muted-foreground italic",
        className
      )}
      {...props}
    />
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-border/60" {...props} />
  ),
  pre: MdxCodeBlock,
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground",
        className
      )}
      {...props}
    />
  ),
  ApiReference,
  InstallationGuide,
  UsageGuide,
  VariantsGrid,
  ComponentPreview,
  CodeTabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Steps,
  Step,
  ComponentSource,
  CodeBlockCommand,
  SiteUrl,
}
