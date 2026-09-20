import { useQuery } from "@tanstack/react-query"
import { FileSearch } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { GridContainer } from "@/app/layouts"
import { useApiInspector } from "@/shared/tools/api-inspector"
import { Button } from "@/shared/ui/core"
import { SectionEmptyState } from "@/shared/ui/system"

import {
  BLOG_CATEGORIES_QUERY,
  BLOG_GROUPS_QUERY,
  BLOG_POSTS_QUERY,
  blogCategoriesQueryOptions,
  blogGroupsQueryOptions,
  blogPostsQueryOptions,
  blogTagsQueryOptions,
  getBlogCategories,
  getBlogGroups,
  getBlogPosts,
} from "../api/blog"
import type { BlogCategory, BlogGroup, BlogPost, BlogTag } from "../types"
import { BlogCard } from "./blog-card"
import { BlogFilterBar } from "./blog-filter-bar"
import { BlogHero } from "./blog-hero"
import { BlogSeriesBanner } from "./blog-series-banner"
import { BlogSeriesShelf } from "./blog-series-shelf"

interface BlogGridProps {
  initialPosts?: BlogPost[]
  initialCategories?: BlogCategory[]
  initialTags?: BlogTag[]
  initialGroups?: BlogGroup[]
}

export function BlogGrid({
  initialPosts,
  initialCategories,
  initialTags,
  initialGroups,
}: BlogGridProps = {}) {
  const { data: posts = initialPosts ?? [] } = useQuery({
    ...blogPostsQueryOptions(),
    initialData: initialPosts,
  })

  const { data: categories = initialCategories ?? [] } = useQuery({
    ...blogCategoriesQueryOptions(),
    initialData: initialCategories,
  })

  const { data: availableTags = initialTags ?? [] } = useQuery({
    ...blogTagsQueryOptions(),
    initialData: initialTags,
  })

  const { data: groups = initialGroups ?? [] } = useQuery({
    ...blogGroupsQueryOptions(),
    initialData: initialGroups,
  })

  // Register with API Inspector for live monitoring and refetching
  const { register } = useApiInspector()
  useEffect(() => {
    register({
      id: "sanity-blog-posts",
      title: "Sanity Blog Posts",
      endpoint: BLOG_POSTS_QUERY,
      method: "GROQ",
      data: posts,
      fetcher: () => getBlogPosts(),
      description:
        "Full list of articles and engineering writeups fetched from Sanity CMS",
      autoExecute: false,
    })

    register({
      id: "sanity-blog-categories",
      title: "Sanity Blog Categories",
      endpoint: BLOG_CATEGORIES_QUERY,
      method: "GROQ",
      data: categories,
      fetcher: () => getBlogCategories(),
      description: "Blog categories for filtering posts fetched via GROQ",
      autoExecute: false,
    })

    register({
      id: "sanity-blog-groups",
      title: "Sanity Blog Series",
      endpoint: BLOG_GROUPS_QUERY,
      method: "GROQ",
      data: groups,
      fetcher: () => getBlogGroups(),
      description:
        "Curated multi-part engineering series and learning collections fetched via GROQ",
      autoExecute: false,
    })
  }, [register, posts, categories, groups])

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Active group object
  const activeGroup = useMemo(
    () => groups.find((g) => g.slug.current === selectedGroup),
    [groups, selectedGroup]
  )

  // Filter posts based on group/series, category, tag, and search query
  const filteredPosts = useMemo(() => {
    let result = posts.filter((post) => {
      // Group / Series filter
      if (selectedGroup && post.group?.slug.current !== selectedGroup) {
        return false
      }

      // Category filter
      if (
        selectedCategory &&
        !post.categories.some((c) => c.slug.current === selectedCategory)
      ) {
        return false
      }

      // Tag filter
      if (
        selectedTag &&
        !post.tags?.some((t) => t.slug.current === selectedTag)
      ) {
        return false
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchTitle = post.title.toLowerCase().includes(query)
        const matchExcerpt = post.excerpt.toLowerCase().includes(query)
        const matchCategory = post.categories.some((c) =>
          c.title.toLowerCase().includes(query)
        )
        const matchTag = post.tags?.some((t) =>
          t.title.toLowerCase().includes(query)
        )
        const matchAuthor = post.author.name.toLowerCase().includes(query)

        if (
          !matchTitle &&
          !matchExcerpt &&
          !matchCategory &&
          !matchTag &&
          !matchAuthor
        ) {
          return false
        }
      }

      return true
    })

    // If viewing a specific series, sort articles in chronological order (#1, #2...)
    if (selectedGroup) {
      result = [...result].sort(
        (a, b) => (a.groupOrder ?? 0) - (b.groupOrder ?? 0)
      )
    }

    return result
  }, [posts, selectedGroup, selectedCategory, selectedTag, searchQuery])

  // Group filtered posts in pairs of 2 for 2-column GridContainer rows
  const postPairs = useMemo(() => {
    const pairs: BlogPost[][] = []
    for (let i = 0; i < filteredPosts.length; i += 2) {
      pairs.push(filteredPosts.slice(i, i + 2))
    }
    return pairs
  }, [filteredPosts])

  // Whether user has any active filter applied
  const hasFilterActive = Boolean(
    selectedGroup || selectedCategory || selectedTag || searchQuery.trim()
  )

  return (
    <div className="w-full">
      {/* 1. Blog Hero */}
      <BlogHero totalCount={posts.length} />

      {/* 2. Active Series Banner (if a series is currently selected) */}
      {selectedGroup && activeGroup && (
        <GridContainer
          borderBottom
          showCrosshairs
          className="p-4 sm:p-6 md:p-8"
        >
          <BlogSeriesBanner
            group={activeGroup}
            totalParts={filteredPosts.length}
            onClear={() => setSelectedGroup(null)}
          />
        </GridContainer>
      )}

      {/* 3. Filter Bar with GridContainer wrapper */}
      <GridContainer borderBottom showCrosshairs className="px-4 py-2 sm:px-8">
        <BlogFilterBar
          categories={categories}
          posts={posts}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          groups={groups}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
          availableTags={availableTags}
          filteredCount={filteredPosts.length}
          totalCount={posts.length}
        />
      </GridContainer>

      {/* 4. Curated Series Shelf (shown on all articles view when not filtering) */}
      {!hasFilterActive && groups.length > 0 && (
        <GridContainer borderBottom showCrosshairs className="px-4 sm:px-8">
          <BlogSeriesShelf
            groups={groups}
            posts={posts}
            onSelectGroup={setSelectedGroup}
          />
        </GridContainer>
      )}

      {/* 5. 2-Column Grid Container Rows */}
      {postPairs.length > 0 ? (
        postPairs.map((pair, rowIndex) => (
          <GridContainer
            key={`row-${rowIndex}`}
            columns={2}
            borderBottom
            showCrosshairs
            className="w-full"
          >
            {/* Column 1 (Left Cell) */}
            <div className="flex h-full w-full border-b border-border md:border-b-0">
              <BlogCard
                post={pair[0]}
                onSelectTag={setSelectedTag}
                onSelectGroup={setSelectedGroup}
              />
            </div>

            {/* Column 2 (Right Cell) */}
            <div className="flex h-full w-full p-4 sm:p-5 md:p-6">
              {pair[1] ? (
                <BlogCard
                  post={pair[1]}
                  onSelectTag={setSelectedTag}
                  onSelectGroup={setSelectedGroup}
                />
              ) : (
                /* Empty placeholder cell for odd number of articles */
                <div className="hidden h-full w-full md:flex">
                  <SectionEmptyState
                    variant="cell"
                    title="More Articles Coming Soon"
                    description="New engineering notes in draft."
                  />
                </div>
              )}
            </div>
          </GridContainer>
        ))
      ) : (
        /* Empty State when 0 posts match filters */
        <GridContainer
          borderBottom
          showCrosshairs
          className="p-6 sm:p-10 md:p-12"
        >
          <SectionEmptyState
            icon={<FileSearch className="size-6" />}
            badge="WRITING & INSIGHTS"
            title="No articles found"
            description="We couldn't find any articles matching your search query or filters. Try resetting your criteria."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory(null)
                  setSelectedGroup(null)
                  setSelectedTag(null)
                  setSearchQuery("")
                }}
                className="border-pp-primary/40 bg-pp-primary/10 text-pp-primary hover:bg-pp-primary hover:text-white"
              >
                Clear all filters
              </Button>
            }
          />
        </GridContainer>
      )}
    </div>
  )
}
