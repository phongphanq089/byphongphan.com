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
import { PropsTable } from "./props-table"
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

/**
 * Automatically appends ?utm_source=<hostname> to external URLs
 * so external project owners and authors recognize referrals from byphongphan.com.
 */
export function withUtmSource(url?: string): string | undefined {
  if (!url) return url
  if (!url.startsWith("http://") && !url.startsWith("https://")) return url

  try {
    const parsed = new URL(url)
    const currentHost = new URL(siteConfig.url).hostname

    // Skip internal site domains, subdomains, and local dev
    if (
      parsed.hostname === currentHost ||
      parsed.hostname.endsWith(`.${currentHost}`) ||
      parsed.hostname === "localhost"
    ) {
      return url
    }

    // Append utm_source if not already present
    if (!parsed.searchParams.has("utm_source")) {
      parsed.searchParams.set("utm_source", currentHost)
    }

    return parsed.toString()
  } catch {
    return url
  }
}

export const mdxComponents = {
  a: ({
    href,
    className,
    children,
    target,
    rel,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const finalHref = withUtmSource(href)
    const isExternal =
      typeof href === "string" &&
      (href.startsWith("http://") || href.startsWith("https://"))

    return (
      <a
        href={finalHref}
        target={target ?? (isExternal ? "_blank" : undefined)}
        rel={rel ?? (isExternal ? "noreferrer noopener" : undefined)}
        className={cn(
          "font-medium text-foreground underline decoration-border/60 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary",
          className
        )}
        {...props}
      >
        {children}
      </a>
    )
  },
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
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-hidden overflow-x-auto rounded-xl border border-border/80 bg-card/40 shadow-xs backdrop-blur-xs dark:border-white/10 dark:bg-[#0c0c0e]">
      <table
        className={cn("w-full border-collapse text-left text-xs", className)}
        {...props}
      />
    </div>
  ),
  thead: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
      className={cn(
        "border-b border-border/80 bg-muted/20 dark:border-white/10 dark:bg-white/[0.02]",
        className
      )}
      {...props}
    />
  ),
  tbody: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody
      className={cn(
        "divide-y divide-border/40 dark:divide-white/10",
        className
      )}
      {...props}
    />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn(
        "transition-colors hover:bg-muted/15 dark:hover:bg-white/[0.015]",
        className
      )}
      {...props}
    />
  ),
  th: ({
    className,
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "border-r border-border/60 px-4 py-3 text-xs font-semibold tracking-tight text-foreground last:border-r-0 dark:border-white/10",
        className
      )}
      {...props}
    />
  ),
  td: ({
    className,
    children,
    ...props
  }: React.TdHTMLAttributes<HTMLTableCellElement>) => {
    const isDash =
      typeof children === "string" &&
      (children.trim() === "-" || children.trim() === "—")

    return (
      <td
        className={cn(
          "border-r border-border/40 px-4 py-3 align-middle text-xs text-foreground/90 last:border-r-0 dark:border-white/10",
          "[&_code]:inline-block [&_code]:max-w-full [&_code]:rounded-md [&_code]:border [&_code]:border-border/80 [&_code]:bg-muted/40 [&_code]:px-2.5 [&_code]:py-1 [&_code]:font-mono [&_code]:text-xs [&_code]:leading-relaxed [&_code]:break-all [&_code]:text-foreground/90 dark:[&_code]:border-white/15 dark:[&_code]:bg-white/[0.04]",
          className
        )}
        {...props}
      >
        {isDash ? (
          <span className="font-mono text-xs text-muted-foreground/60">-</span>
        ) : (
          children
        )}
      </td>
    )
  },
  PropsTable,
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
