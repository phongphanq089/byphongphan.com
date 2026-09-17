import { ArrowUpRight } from "lucide-react"
import type * as React from "react"

import { siteConfig } from "@/shared/config"
import { cn } from "@/shared/lib/utils"

export interface UtmParams {
  source?: string
  medium?: string
  campaign?: string
  term?: string
  content?: string
}

export type QueryParamValue = string | number | boolean | undefined | null

export interface BuildExternalUrlOptions {
  utm?: UtmParams | boolean
  params?: Record<string, QueryParamValue>
  defaultSource?: string
}

/**
 * Derives a clean default UTM source from siteConfig (e.g. "byphongphan.com")
 */
function getDefaultUtmSource(): string {
  try {
    const url = new URL(siteConfig.url)
    return url.hostname.replace(/^www\./, "")
  } catch {
    return "byphongphan.com"
  }
}

/**
 * Builds an external URL safely with UTM parameters and custom query params.
 * Preserves existing hash fragments and existing query parameters.
 */
export function buildExternalUrl(
  href: string,
  options?: BuildExternalUrlOptions
): string {
  if (!href) return ""

  // Do not append parameters to mailto, tel, or internal fragment anchors
  if (
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#") ||
    href.startsWith("javascript:")
  ) {
    return href
  }

  const {
    utm = true,
    params,
    defaultSource = getDefaultUtmSource(),
  } = options ?? {}

  try {
    // Check if href is relative or absolute
    const isAbsolute = /^https?:\/\//i.test(href) || href.startsWith("//")
    const dummyBase = "https://placeholder-domain.local"
    const parsedUrl = new URL(href, isAbsolute ? undefined : dummyBase)

    // Handle UTM parameters
    if (utm !== false) {
      const utmConfig: UtmParams =
        typeof utm === "object" ? utm : { source: defaultSource }

      const sourceValue = utmConfig.source ?? defaultSource
      if (sourceValue && !parsedUrl.searchParams.has("utm_source")) {
        parsedUrl.searchParams.set("utm_source", sourceValue)
      }
      if (utmConfig.medium && !parsedUrl.searchParams.has("utm_medium")) {
        parsedUrl.searchParams.set("utm_medium", utmConfig.medium)
      }
      if (utmConfig.campaign && !parsedUrl.searchParams.has("utm_campaign")) {
        parsedUrl.searchParams.set("utm_campaign", utmConfig.campaign)
      }
      if (utmConfig.content && !parsedUrl.searchParams.has("utm_content")) {
        parsedUrl.searchParams.set("utm_content", utmConfig.content)
      }
      if (utmConfig.term && !parsedUrl.searchParams.has("utm_term")) {
        parsedUrl.searchParams.set("utm_term", utmConfig.term)
      }
    }

    // Handle additional custom params
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          parsedUrl.searchParams.set(key, String(value))
        }
      }
    }

    if (isAbsolute) {
      return parsedUrl.toString()
    }

    // If it was a relative path, strip the dummy base
    return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash
  } catch {
    // If URL parsing fails, return original href
    return href
  }
}

export interface ExternalLinkProps extends Omit<
  React.ComponentProps<"a">,
  "href"
> {
  href: string
  utm?: UtmParams | boolean
  params?: Record<string, QueryParamValue>
  defaultSource?: string
  showIcon?: boolean
  iconClassName?: string
  iconPosition?: "right" | "left"
}

export function ExternalLink({
  href,
  utm = true,
  params,
  defaultSource,
  showIcon = false,
  iconClassName,
  iconPosition = "right",
  target = "_blank",
  rel = "noopener noreferrer",
  className,
  children,
  ...rest
}: ExternalLinkProps) {
  const resolvedHref = buildExternalUrl(href, {
    utm,
    params,
    defaultSource,
  })

  return (
    <a
      href={resolvedHref}
      target={target}
      rel={rel}
      className={cn(
        "inline-flex items-center gap-1 transition-colors",
        className
      )}
      {...rest}
    >
      {showIcon && iconPosition === "left" && (
        <ArrowUpRight
          aria-hidden="true"
          className={cn("size-3.5 shrink-0", iconClassName)}
        />
      )}
      {children}
      {showIcon && iconPosition === "right" && (
        <ArrowUpRight
          aria-hidden="true"
          className={cn("size-3.5 shrink-0", iconClassName)}
        />
      )}
    </a>
  )
}
