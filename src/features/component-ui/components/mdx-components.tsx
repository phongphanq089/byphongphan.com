import React from "react"

import {
  CodeBlock as CoreCodeBlock,
  CodeBlockCopyButton,
  markdownCodeProps,
} from "@/registry/ui/code-block"
import { cn } from "@/shared/lib"

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

function MdxCodeBlock(
  props: React.HTMLAttributes<HTMLPreElement> & { "data-code"?: string }
) {
  const { code, language } = markdownCodeProps(props)
  const finalCode = code || props["data-code"] || ""

  if (!finalCode) {
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
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        "mt-2 mb-4 scroll-m-20 text-3xl font-bold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        "mt-8 mb-3 scroll-m-20 text-xl font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        "mt-6 mb-2 scroll-m-20 text-base font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  ),
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
}
