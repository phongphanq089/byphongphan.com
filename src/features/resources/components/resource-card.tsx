import { ArrowUpRight, Check, Copy, ExternalLink } from "lucide-react"
import React, { useState } from "react"

import { cn } from "@/shared/lib"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/core"

import type { PricingBadge, Resource } from "../types"

interface ResourceCardProps {
  resource: Resource
  onSelectCategory?: (categorySlug: string) => void
}

const PRICING_STYLES: Record<
  PricingBadge,
  { bg: string; text: string; border: string }
> = {
  Free: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
  },
  MIT: {
    bg: "bg-blue-500/10 dark:bg-blue-500/15",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
  },
  Freemium: {
    bg: "bg-amber-500/10 dark:bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
  },
  Paid: {
    bg: "bg-purple-500/10 dark:bg-purple-500/15",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
  },
}

export const ResourceCard = ({
  resource,
  onSelectCategory,
}: ResourceCardProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(resource.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const pricingStyle = PRICING_STYLES[resource.pricing] || PRICING_STYLES.Free
  const categoryColor =
    typeof resource.category.color === "object"
      ? resource.category.color?.hex
      : (resource.category.color ?? "var(--pp-primary)")

  return (
    <div
      className={cn(
        "group relative isolate flex h-full w-full flex-col overflow-hidden rounded-2xl p-1.5 transition-all duration-300",
        "bg-white/5 dark:bg-black/90",
        "bg-gradient-to-br from-black/5 to-black/[0.02] dark:from-white/5 dark:to-white/[0.02]",
        "backdrop-blur-xl backdrop-saturate-[180%]",
        "border border-black/10 dark:border-white/10",
        "shadow-[0_8px_16px_rgb(0_0_0_/_0.15)] dark:shadow-[0_8px_20px_rgb(0_0_0_/_0.3)]",
        "hover:border-pp-primary/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.35)] dark:hover:border-pp-primary/40",
        "translate-z-0 will-change-transform"
      )}
    >
      {/* Inner Container: Gradient Backdrop Glass */}
      <div
        className={cn(
          "relative flex h-full w-full flex-col justify-between rounded-xl p-4 sm:p-5",
          "bg-gradient-to-br from-black/[0.04] to-transparent dark:from-white/[0.07] dark:to-transparent",
          "backdrop-blur-md backdrop-saturate-150",
          "border border-black/[0.05] dark:border-white/[0.08]",
          "text-foreground",
          "shadow-xs",
          "translate-z-0 will-change-transform",
          "before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-pp-primary/[0.04] before:to-transparent before:opacity-0 before:transition-opacity",
          "group-hover:before:opacity-100"
        )}
      >
        {/* Top Half: Cover Image & Badges */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-black/10 bg-muted/40 dark:border-white/10">
            <img
              src={resource.coverImage.url}
              alt={resource.coverImage.alt || resource.title}
              className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
              loading="lazy"
            />

            {/* Vignette Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/30 opacity-70 transition-opacity group-hover:opacity-50" />

            {/* Top Left: Category Tag */}
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectCategory?.(resource.category.slug.current)
                }}
                className="flex items-center gap-1.5 rounded-md border border-white/20 bg-black/75 px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs backdrop-blur-md transition-colors hover:border-white/40 hover:bg-black/90"
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: categoryColor }}
                />
                <span>{resource.category.title}</span>
              </button>
            </div>

            {/* Top Right: Pricing Badge */}
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
              <span
                className={cn(
                  "rounded-md border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md",
                  pricingStyle.bg,
                  pricingStyle.text,
                  pricingStyle.border
                )}
              >
                {resource.pricing}
              </span>
            </div>
          </div>

          {/* Title and External URL Link */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/title flex items-center gap-1.5 focus:outline-none"
              >
                <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-pp-primary group-hover/title:text-pp-primary sm:text-xl">
                  {resource.title}
                </h3>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 group-hover/title:text-pp-primary" />
              </a>

              {/* Quick Copy Link Tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex size-7 items-center justify-center rounded-md border border-border/60 bg-muted/30 text-muted-foreground transition-colors hover:border-pp-primary/50 hover:bg-pp-primary/10 hover:text-pp-primary active:scale-95"
                    aria-label="Copy website URL"
                  >
                    {copied ? (
                      <Check className="size-3 text-pp-primary" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={4}
                  className="text-[10px]"
                >
                  {copied ? "Copied to clipboard!" : "Copy Link"}
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Description */}
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:line-clamp-3 sm:text-sm">
              {resource.description}
            </p>
          </div>
        </div>

        {/* Bottom Half: Footer Actions */}
        <div className="mt-4 flex flex-col gap-3 border-t border-black/[0.08] pt-3 dark:border-white/[0.08]">
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {resource.logo ? (
                <img
                  src={resource.logo.url}
                  alt={resource.logo.alt || resource.title}
                  className="size-4.5 rounded-sm object-contain"
                />
              ) : (
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: categoryColor }}
                />
              )}
              <span className="max-w-[150px] truncate text-[11px] text-muted-foreground/70 sm:max-w-[200px]">
                {resource.url.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
            </div>

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-black/5 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-pp-primary/60 hover:bg-pp-primary/10 hover:text-pp-primary focus:outline-none active:scale-98 dark:border-white/10 dark:bg-white/5"
            >
              <span>Visit</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
