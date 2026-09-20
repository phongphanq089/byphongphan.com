import { Link } from "@tanstack/react-router"
import { CheckCircle2 } from "lucide-react"
import React from "react"

import { cn } from "@/shared/lib"

import type { BlogPost } from "../types"

interface BlogCardProps {
  post: BlogPost
  onSelectTag?: (tagSlug: string) => void
  onSelectGroup?: (groupSlug: string) => void
}

export const BlogCard = ({
  post,
  onSelectTag,
  onSelectGroup,
}: BlogCardProps) => {
  const primaryCategory = post.categories[0]?.title || "Article"

  const formattedDate = React.useMemo(() => {
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

  return (
    <article className="group relative flex h-full w-full flex-col justify-between p-5 transition-colors duration-300 hover:bg-accent/40 sm:p-6 md:p-8 dark:hover:bg-white/[0.02]">
      {/* Top Half: Cover Image */}
      <div className="flex flex-col gap-4">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border/60 bg-muted/40">
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug.current }}
            className="block h-full w-full"
          >
            <img
              src={post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
              loading="lazy"
            />
            {/* Subtle Cyber Vignette & Gradient Overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-60 transition-opacity group-hover:opacity-40" />
          </Link>

          {/* Group / Series Badge if present */}
          {post.group && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectGroup?.(post.group!.slug.current)
                }}
                className={cn(
                  "rounded-md border border-white/20 bg-black/70 px-2 py-0.5 text-[9px] font-semibold text-white shadow-xs backdrop-blur-md transition-all",
                  onSelectGroup &&
                    "cursor-pointer hover:border-pp-primary hover:bg-pp-primary/90"
                )}
                title={`Filter series: ${post.group.title}`}
              >
                {post.group.title}{" "}
                {post.groupOrder ? `• #${post.groupOrder}` : ""}
              </button>
            </div>
          )}

          {/* Featured Ribbon */}
          {post.isFeatured && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <span className="rounded-md border border-pp-primary/40 bg-pp-primary/90 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs backdrop-blur-md">
                FEATURED
              </span>
            </div>
          )}
        </div>

        {/* Category & Read Time Row (Matching Image 1) */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold tracking-wide text-foreground">
            {primaryCategory}
          </span>
          <span className="text-xs text-muted-foreground/80">
            {post.readTime} min read
          </span>
        </div>

        {/* Title (Matching Image 1) */}
        <Link to="/blog/$slug" params={{ slug: post.slug.current }}>
          <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-pp-primary hover:text-pp-primary sm:text-xl">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt / Summary (Matching Image 1) */}
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:line-clamp-3 sm:text-sm">
          {post.excerpt}
        </p>
      </div>

      {/* Bottom Half: Tags & Author Footer (Matching Image 1) */}
      <div className="mt-4 flex flex-col gap-3 border-t border-border/50 pt-3">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <button
                key={tag._id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectTag?.(tag.slug.current)
                }}
                className="rounded border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[9px] text-muted-foreground/80 transition-colors hover:border-pp-primary/50 hover:text-foreground"
              >
                #{tag.title}
              </button>
            ))}
          </div>
        )}

        {/* Author Section with Avatar + Verified Badge + Date */}
        <div className="flex items-center gap-3">
          <div className="size-9 shrink-0 overflow-hidden rounded-full border border-border/80 bg-muted/80">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground sm:text-sm">
                {post.author.name}
              </span>
              {post.author.verified && (
                <CheckCircle2
                  className="size-3.5 fill-blue-500 text-background"
                  aria-label="Verified author"
                />
              )}
            </div>
            <span className="text-[11px] text-muted-foreground/80">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
