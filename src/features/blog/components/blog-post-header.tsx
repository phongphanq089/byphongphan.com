import { Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  Share2,
  Tag,
} from "lucide-react"
import { useMemo, useState } from "react"

import { GridContainer } from "@/app/layouts"
import { Badge, Button } from "@/shared/ui/core"

import type { BlogPost } from "../types"

interface BlogPostHeaderProps {
  post: BlogPost
  readingProgress: number
  onOpenTOC?: () => void
}

export function BlogPostHeader({
  post,
  readingProgress,
  onOpenTOC,
}: BlogPostHeaderProps) {
  const [copiedLink, setCopiedLink] = useState(false)

  const formattedDate = useMemo(() => {
    try {
      const d = new Date(post.publishedAt)
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return post.publishedAt
    }
  }, [post.publishedAt])

  const handleShare = async () => {
    if (typeof window === "undefined") return
    const currentUrl = window.location.href

    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      /mobile|android|iphone/i.test(navigator.userAgent)
    ) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: currentUrl,
        })
        return
      } catch {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(currentUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2200)
    }
  }

  const primaryCategory = post.categories[0]

  return (
    <GridContainer
      borderTop
      borderBottom
      showCrosshairs
      className="relative flex flex-col justify-between gap-6 overflow-hidden px-4 py-8 sm:px-8 md:py-12"
    >
      {/* Ambient Radial Spotlight */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-pp-primary/10 blur-3xl dark:bg-pp-primary/15" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Architectural Monospace Telemetry Ribbon */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-muted-foreground">
          <Link
            to="/"
            className="transition-colors hover:text-foreground hover:underline"
          >
            HOME
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <Link
            to="/blog"
            className="transition-colors hover:text-foreground hover:underline"
          >
            WRITING
          </Link>
          {primaryCategory && (
            <>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-foreground uppercase">
                {primaryCategory.title}
              </span>
            </>
          )}
          <span className="text-muted-foreground/40">/</span>
          <span className="font-semibold text-pp-primary uppercase">
            SPEC-{post.slug.current.slice(0, 6).toUpperCase()}
          </span>
        </div>

        {/* Category & Series Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {post.categories.map((category) => (
            <Badge
              key={category._id}
              variant="outline"
              className="gap-1.5 border-pp-primary/30 bg-pp-primary/5 text-xs font-semibold text-pp-primary backdrop-blur-xs"
            >
              <Tag className="size-3" />
              <span>{category.title}</span>
            </Badge>
          ))}

          {post.group && (
            <Badge
              variant="outline"
              className="gap-1.5 border-border/80 bg-muted/40 text-xs text-muted-foreground"
            >
              <Layers className="size-3 text-pp-primary" />
              <span>Series: {post.group.title}</span>
              {post.groupOrder && <span>(Part {post.groupOrder})</span>}
            </Badge>
          )}
        </div>

        {/* Main Title Typography Display */}
        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          {post.title}
        </h1>

        {/* Lead Excerpt */}
        {post.excerpt && (
          <p className="border-l-2 border-pp-primary/40 py-1 pl-4 text-base leading-relaxed text-muted-foreground/90 sm:text-lg">
            {post.excerpt}
          </p>
        )}

        {/* Author Identification & Console Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
          <div className="flex items-center gap-3">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="size-11 rounded-full border-2 border-background object-cover shadow-md ring-2 ring-border/80"
              />
            ) : (
              <div className="flex size-11 items-center justify-center rounded-full border-2 border-background bg-pp-primary/10 font-bold text-pp-primary ring-2 ring-border/80">
                {post.author.name[0]}
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <span>{post.author.name}</span>
                <CheckCircle2 className="size-3.5 fill-blue-500/20 text-blue-500" />
                <span className="text-[10px] text-muted-foreground uppercase">
                  [UI ARCHITECT]
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>{post.readTime} min read</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>{formattedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Action Console */}
          <div className="flex items-center gap-2">
            {/* Telemetry Reading Pill (Desktop, Click to open TOC) */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenTOC}
              className="hidden items-center gap-2 border-border/60 bg-muted/30 px-2.5 text-xs text-muted-foreground hover:border-pp-primary/60 hover:text-foreground sm:flex"
              aria-label="Open Table of Contents and Reading Telemetry"
            >
              <span className="size-2 animate-pulse rounded-full bg-pp-primary" />
              <span>{readingProgress}% READ</span>
            </Button>

            {/* Share / Copy Link Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 border-border/80 text-xs font-medium hover:border-pp-primary hover:text-pp-primary"
            >
              {copiedLink ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span>Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="size-3" />
                  <span>Share</span>
                </>
              )}
            </Button>

            {/* Back to All Articles */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-1.5 border-border/80 text-xs font-medium hover:border-pp-primary hover:text-pp-primary"
            >
              <Link to="/blog">
                <ArrowLeft className="size-3" />
                <span>All Articles</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </GridContainer>
  )
}
