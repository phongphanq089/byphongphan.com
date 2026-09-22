import { Link } from "@tanstack/react-router"
import { ArrowLeft, ArrowUp } from "lucide-react"
import { useMemo, useRef, useState } from "react"

import { GridContainer } from "@/app/layouts"
import { useDomToc } from "@/shared/hooks"
import { Badge, Button } from "@/shared/ui/core"

import { useReadingProgress } from "../hooks/use-reading-progress"
import type { BlogPost } from "../types"
import { BlogContentRenderer } from "./blog-content-renderer"
import { BlogPostCover } from "./blog-post-cover"
import { BlogPostHeader } from "./blog-post-header"
import { BlogPostHud } from "./blog-post-hud"
import { BlogPostNavigation } from "./blog-post-navigation"
import { BlogSeriesStepper } from "./blog-series-stepper"

interface BlogPostDetailProps {
  post: BlogPost
  allPosts?: BlogPost[]
}

export function BlogPostDetail({ post, allPosts = [] }: BlogPostDetailProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const articleRef = useRef<HTMLElement | null>(null)

  // 1. Throttled Reading Progress
  const readingProgress = useReadingProgress(articleRef)

  const tocItems = useDomToc(articleRef, post.body)

  // 3. Find other posts in the same series
  const seriesPosts = useMemo(() => {
    if (!post.group) return []
    return allPosts
      .filter((p) => p.group?.slug.current === post.group?.slug.current)
      .sort((a, b) => (a.groupOrder ?? 0) - (b.groupOrder ?? 0))
  }, [allPosts, post.group])

  // 4. Find Previous and Next posts
  const { prevPost, nextPost } = useMemo(() => {
    if (!allPosts || allPosts.length === 0) {
      return { prevPost: null, nextPost: null }
    }
    const currentIndex = allPosts.findIndex(
      (p) => p._id === post._id || p.slug.current === post.slug.current
    )
    if (currentIndex === -1) return { prevPost: null, nextPost: null }

    const newer = currentIndex > 0 ? allPosts[currentIndex - 1] : null
    const older =
      currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null

    return { prevPost: older, nextPost: newer }
  }, [allPosts, post._id, post.slug])

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="relative w-full">
      {/* ── 1. Editorial Header Section ── */}
      <BlogPostHeader
        post={post}
        readingProgress={readingProgress}
        onOpenTOC={() => setDrawerOpen(true)}
      />

      {/* ── 2. Cinematic Technical Cover Visual ── */}
      <BlogPostCover coverImage={post.coverImage} title={post.title} />

      {/* ── 3. Main Article Reading Column ── */}
      <GridContainer
        borderBottom
        showCrosshairs
        className="relative px-4 py-8 sm:px-8 md:py-12"
      >
        <article ref={articleRef} className="mx-auto max-w-3xl">
          {/* Main Article Prose Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <BlogContentRenderer content={post.body} />
          </div>

          {/* Article Tags & Metadata Footer */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 border-t border-border/60 pt-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">TOPICS //</span>
                {post.tags.map((tag) => (
                  <Badge
                    key={tag._id}
                    variant="outline"
                    className="gap-1 rounded-md border-border/60 bg-muted/40 text-xs text-muted-foreground transition-colors hover:border-pp-primary hover:text-foreground"
                  >
                    <span>#</span>
                    <span>{tag.title}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* ── Interactive Engineering Roadmap Stepper for Series ── */}
          <BlogSeriesStepper
            group={post.group}
            currentSlug={post.slug.current}
            currentGroupOrder={post.groupOrder ?? 1}
            seriesPosts={seriesPosts}
          />

          {/* ── Split Previous / Next Article Navigation ── */}
          <BlogPostNavigation prevPost={prevPost} nextPost={nextPost} />
        </article>
      </GridContainer>

      {/* ── 4. Colophon Bottom Navigation Bar ── */}
      <GridContainer
        borderBottom
        showCrosshairs
        className="flex items-center justify-between p-4 sm:p-8"
      >
        <Link
          to="/blog"
          className="group flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-pp-primary"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
          <span>ALL WRITING & ARTICLES</span>
        </Link>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={scrollToTop}
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowUp className="size-3.5" />
          <span>Back to Top ↑</span>
        </Button>
      </GridContainer>

      {/* ── 5. Fixed Right Action Console & Slide-Over Drawer ── */}
      <BlogPostHud
        tocItems={tocItems || []}
        readingProgress={readingProgress}
        readTime={post.readTime}
        isOpen={drawerOpen}
        onOpenChange={setDrawerOpen}
        onScrollToTop={scrollToTop}
      />
    </div>
  )
}
