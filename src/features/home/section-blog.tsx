import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { GridContainer } from "@/app/layouts"
import { BlogCard, blogPostsQueryOptions } from "@/features/blog"
import { SectionHeading } from "@/shared/ui/system/section-heading"

export const SectionBlog = () => {
  const { data: posts = [] } = useQuery(blogPostsQueryOptions())

  // Select top featured posts or first 2 available posts
  const featured = posts.filter((p) => p.isFeatured)
  const displayPosts =
    featured.length > 0 ? featured.slice(0, 2) : posts.slice(0, 2)

  if (displayPosts.length === 0) {
    return null
  }

  return (
    <>
      <GridContainer className="p-0" showCrosshairs={false}>
        <SectionHeading
          id="blog"
          heading="Articles & Notes"
          action={
            <Link
              to="/blog"
              className="group flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:bg-accent/60 hover:text-foreground active:scale-98"
            >
              <span>View all articles</span>
              <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          }
        />
      </GridContainer>

      {/* 2-Column Grid of Featured Blog Posts */}
      <GridContainer
        columns={2}
        borderTop={false}
        borderBottom={true}
        showCrosshairs={true}
        className="w-full"
      >
        {displayPosts.map((post, idx) => (
          <div
            key={post._id}
            className={`flex h-full w-full ${
              idx === 0 && displayPosts.length > 1
                ? "border-b border-border md:border-r md:border-b-0"
                : ""
            }`}
          >
            <BlogCard post={post} />
          </div>
        ))}
      </GridContainer>
    </>
  )
}
