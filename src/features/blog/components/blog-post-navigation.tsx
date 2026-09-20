import { Link } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"

import { cn } from "@/shared/lib"

import type { BlogPost } from "../types"

interface BlogPostNavigationProps {
  prevPost: BlogPost | null
  nextPost: BlogPost | null
}

export function BlogPostNavigation({
  prevPost,
  nextPost,
}: BlogPostNavigationProps) {
  if (!prevPost && !nextPost) return null

  const formatDateShort = (dateStr?: string) => {
    if (!dateStr) return ""
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {prevPost ? (
        <Link
          to="/blog/$slug"
          params={{ slug: prevPost.slug.current }}
          className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-card/40 p-4 transition-all duration-200 hover:border-pp-primary/60 hover:bg-card/70 hover:shadow-md"
        >
          <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-pp-primary">
            <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" />
            <span>PREVIOUS ARTICLE</span>
          </div>
          <h4 className="mt-2 line-clamp-2 text-sm leading-snug font-bold text-foreground transition-colors group-hover:text-pp-primary">
            {prevPost.title}
          </h4>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              <span>{prevPost.readTime}m read</span>
            </span>
            <span>•</span>
            <span>{formatDateShort(prevPost.publishedAt)}</span>
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {nextPost ? (
        <Link
          to="/blog/$slug"
          params={{ slug: nextPost.slug.current }}
          className={cn(
            "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-card/40 p-4 text-left transition-all duration-200 hover:border-pp-primary/60 hover:bg-card/70 hover:shadow-md sm:text-right",
            !prevPost && "sm:col-start-2"
          )}
        >
          <div className="flex items-center justify-start gap-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase transition-colors group-hover:text-pp-primary sm:justify-end">
            <span>NEXT ARTICLE</span>
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
          </div>
          <h4 className="mt-2 line-clamp-2 text-sm leading-snug font-bold text-foreground transition-colors group-hover:text-pp-primary">
            {nextPost.title}
          </h4>
          <div className="mt-3 flex items-center justify-start gap-3 text-[11px] text-muted-foreground sm:justify-end">
            <span>{formatDateShort(nextPost.publishedAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              <span>{nextPost.readTime}m read</span>
            </span>
          </div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  )
}
