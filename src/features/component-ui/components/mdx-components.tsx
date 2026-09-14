import { Check, Copy } from "lucide-react"
import React, { useState } from "react"

import { cn } from "@/shared/lib"
import { Button } from "@/shared/ui/core"

import { ApiReference } from "./api-reference"
import { InstallationGuide } from "./installation-guide"
import { UsageGuide } from "./usage-guide"
import { VariantsGrid } from "./variants-grid"

function CodeBlock({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & { "data-code"?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    let text = ""
    if (typeof children === "string") {
      text = children
    } else if (props["data-code"]) {
      text = props["data-code"]
    } else if (
      React.isValidElement(children) &&
      typeof children.props === "object" &&
      children.props !== null &&
      "children" in children.props
    ) {
      text = String((children.props as { children?: unknown }).children ?? "")
    }

    if (text && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="group relative my-4 overflow-hidden rounded-xl border border-border/80 bg-card/60">
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={handleCopy}
        className="absolute top-2.5 right-2.5 size-6 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
      >
        {copied ? (
          <Check className="size-3.5 text-emerald-400" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </Button>

      <pre
        className={cn(
          "overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
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
  pre: CodeBlock,
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground",
        className
      )}
      {...props}
    />
  ),
  ApiReference,
  InstallationGuide,
  UsageGuide,
  VariantsGrid,
}
