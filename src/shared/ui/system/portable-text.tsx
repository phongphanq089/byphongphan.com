import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
  type PortableTextTypeComponentProps,
} from "@portabletext/react"
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Info,
} from "lucide-react"
import React, { useMemo, useState } from "react"

import { cn } from "@/shared/lib"
import { getSanityImageUrl } from "@/shared/lib/sanity"
import { Button } from "@/shared/ui/core"
import type { TOCItem } from "@/shared/ui/system/table-of-contents"

/**
 * Slugifies text into an HTML-safe element ID
 */
export function getHeadingId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove Vietnamese accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/**
 * Extracts TOCItems from Sanity Portable Text blocks array
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractTOCFromBlocks(blocks: any[]): TOCItem[] {
  if (!Array.isArray(blocks)) return []
  const items: TOCItem[] = []

  for (const block of blocks) {
    if (block._type === "block" && ["h2", "h3", "h4"].includes(block.style)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const text = block.children?.map((c: any) => c.text).join("") || ""
      if (text.trim()) {
        const id = getHeadingId(text)
        const depth = block.style === "h2" ? 2 : block.style === "h3" ? 3 : 4
        items.push({ id, title: text, depth })
      }
    }
  }

  return items
}

// ---------------------------------------------------------------------------
// 1. Code Block with Filename, Language badge & Copy Button
// ---------------------------------------------------------------------------
interface CodeBlockValue {
  code: string
  language?: string
  filename?: string
}

export const PortableTextCodeBlock = ({
  value,
}: PortableTextTypeComponentProps<CodeBlockValue>) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!value?.code) return
    navigator.clipboard.writeText(value.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!value?.code) return null

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2">
          {/* Terminal Dots */}
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-red-500/70" />
            <div className="size-2.5 rounded-full bg-amber-500/70" />
            <div className="size-2.5 rounded-full bg-emerald-500/70" />
          </div>
          {value.filename ? (
            <span className="ml-2 text-xs text-white/70">{value.filename}</span>
          ) : value.language ? (
            <span className="ml-2 text-xs text-white/40 uppercase">
              {value.language}
            </span>
          ) : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 gap-1.5 rounded px-2 text-[11px] text-white/70 hover:bg-white/10 hover:text-white"
        >
          {copied ? (
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
      </div>

      {/* Code viewport */}
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-white/90">
        <code>{value.code}</code>
      </pre>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 2. Callout / Alert Box
// ---------------------------------------------------------------------------
interface CalloutValue {
  tone?: "info" | "success" | "warning" | "caution"
  title?: string
  text?: string
}

export const PortableTextCallout = ({
  value,
}: PortableTextTypeComponentProps<CalloutValue>) => {
  const tone = value?.tone || "info"

  const config = useMemo(() => {
    switch (tone) {
      case "success":
        return {
          icon: <CheckCircle2 className="size-4 text-emerald-500" />,
          border:
            "border-emerald-500/30 bg-emerald-500/[0.06] text-emerald-300",
        }
      case "warning":
        return {
          icon: <AlertTriangle className="size-4 text-amber-500" />,
          border: "border-amber-500/30 bg-amber-500/[0.06] text-amber-300",
        }
      case "caution":
        return {
          icon: <AlertCircle className="size-4 text-rose-500" />,
          border: "border-rose-500/30 bg-rose-500/[0.06] text-rose-300",
        }
      case "info":
      default:
        return {
          icon: <Info className="size-4 text-pp-primary" />,
          border: "border-pp-primary/30 bg-pp-primary/[0.06] text-foreground",
        }
    }
  }, [tone])

  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-xl border p-4 text-xs leading-relaxed",
        config.border
      )}
    >
      <div className="mt-0.5 shrink-0">{config.icon}</div>
      <div className="flex flex-col gap-1">
        {value?.title && (
          <h5 className="text-[13px] font-semibold text-foreground">
            {value.title}
          </h5>
        )}
        {value?.text && <p className="text-muted-foreground">{value.text}</p>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 3. Image Embed
// ---------------------------------------------------------------------------
interface ImageValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asset?: any
  alt?: string
  caption?: string
}

export const PortableTextImage = ({
  value,
}: PortableTextTypeComponentProps<ImageValue>) => {
  const imageUrl = useMemo(() => {
    if (!value) return ""
    try {
      return getSanityImageUrl(value, { width: 1200 })
    } catch {
      return ""
    }
  }, [value])

  if (!imageUrl) return null

  return (
    <figure className="my-8 flex flex-col items-center gap-2">
      <div className="relative w-full overflow-hidden rounded-xl border border-border/80 bg-muted/30 shadow-lg">
        <img
          src={imageUrl}
          alt={value.alt || "Blog article image"}
          className="h-auto w-full object-cover"
          loading="lazy"
        />
      </div>
      {value.caption && (
        <figcaption className="text-center text-xs text-muted-foreground italic">
          {value.caption}
        </figcaption>
      )}
    </figure>
  )
}

// ---------------------------------------------------------------------------
// 4. Default Custom PortableText Components Map
// ---------------------------------------------------------------------------
export const defaultPortableTextComponents: PortableTextComponents = {
  types: {
    code: PortableTextCodeBlock,
    callout: PortableTextCallout,
    image: PortableTextImage,
  },
  block: {
    h1: ({ children }) => {
      const text = React.Children.toArray(children).join("")
      const id = getHeadingId(text)
      return (
        <h1
          id={id}
          className="mt-10 mb-4 scroll-mt-24 text-2xl font-black tracking-tight text-foreground first:mt-0 sm:text-3xl md:text-4xl"
        >
          {children}
        </h1>
      )
    },
    h2: ({ children }) => {
      const text = React.Children.toArray(children).join("")
      const id = getHeadingId(text)
      return (
        <h2
          id={id}
          className="group mt-10 mb-3 flex scroll-mt-24 items-center border-b border-border/40 pb-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl"
        >
          <span>{children}</span>
          <a
            href={`#${id}`}
            className="ml-2 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-pp-primary"
            aria-label={`Link to ${text}`}
          >
            #
          </a>
        </h2>
      )
    },
    h3: ({ children }) => {
      const text = React.Children.toArray(children).join("")
      const id = getHeadingId(text)
      return (
        <h3
          id={id}
          className="group mt-7 mb-2 flex scroll-mt-24 items-center text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          <span>{children}</span>
          <a
            href={`#${id}`}
            className="ml-2 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-pp-primary"
            aria-label={`Link to ${text}`}
          >
            #
          </a>
        </h3>
      )
    },
    h4: ({ children }) => {
      const text = React.Children.toArray(children).join("")
      const id = getHeadingId(text)
      return (
        <h4
          id={id}
          className="mt-5 mb-2 scroll-mt-24 text-base font-semibold text-foreground"
        >
          {children}
        </h4>
      )
    },
    normal: ({ children }) => {
      return (
        <p className="my-3 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px] sm:leading-7">
          {children}
        </p>
      )
    },
    blockquote: ({ children }) => {
      return (
        <blockquote className="my-5 rounded-r-xl border-l-2 border-pp-primary bg-pp-primary/[0.04] py-2 pr-4 pl-4 text-[13px] text-foreground/90 italic sm:text-sm">
          {children}
        </blockquote>
      )
    },
  },
  list: {
    bullet: ({ children }) => {
      return (
        <ul className="my-4 list-disc space-y-2 pl-6 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
          {children}
        </ul>
      )
    },
    number: ({ children }) => {
      return (
        <ol className="my-4 list-decimal space-y-2 pl-6 text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
          {children}
        </ol>
      )
    },
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded-md border border-border/80 bg-muted/60 px-1.5 py-0.5 text-[12px] font-medium text-foreground">
        {children}
      </code>
    ),
    underline: ({ children }) => <span className="underline">{children}</span>,
    "strike-through": ({ children }) => (
      <span className="line-through opacity-70">{children}</span>
    ),
    link: ({
      value,
      children,
    }: PortableTextMarkComponentProps<{
      _type: string
      href?: string
      blank?: boolean
    }>) => {
      const isExternal =
        value?.blank ||
        (value?.href &&
          (value.href.startsWith("http") || value.href.startsWith("//")))

      return (
        <a
          href={value?.href || "#"}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="inline-flex items-center gap-0.5 font-medium text-pp-primary underline decoration-pp-primary/40 underline-offset-3 transition-colors hover:text-pp-primary/80 hover:decoration-pp-primary"
        >
          <span>{children}</span>
          {isExternal && <ArrowUpRight className="size-3 opacity-70" />}
        </a>
      )
    },
  },
}

// ---------------------------------------------------------------------------
// 5. Reusable PortableTextRenderer Component
// ---------------------------------------------------------------------------
export interface PortableTextRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  components?: Partial<PortableTextComponents>
  className?: string
}

export const PortableTextRenderer = ({
  value,
  components,
  className,
}: PortableTextRendererProps) => {
  const mergedComponents = useMemo(() => {
    if (!components) return defaultPortableTextComponents
    return {
      ...defaultPortableTextComponents,
      ...components,
      types: { ...defaultPortableTextComponents.types, ...components.types },
      block: { ...defaultPortableTextComponents.block, ...components.block },
      marks: { ...defaultPortableTextComponents.marks, ...components.marks },
      list: { ...defaultPortableTextComponents.list, ...components.list },
    }
  }, [components])

  if (!value) return null

  return (
    <div
      className={cn(
        "portable-text w-full max-w-none text-foreground",
        className
      )}
    >
      <PortableText value={value} components={mergedComponents} />
    </div>
  )
}
