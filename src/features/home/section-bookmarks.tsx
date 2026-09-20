import {
  ArrowUpRight,
  BookOpen,
  Code2,
  FileText,
  Flame,
  GraduationCap,
  Triangle,
} from "lucide-react"
import { useMemo, useState } from "react"

import { GridContainer } from "@/app/layouts"
import { type BookmarkItem, BOOKMARKS } from "@/shared/config"
import { cn } from "@/shared/lib/utils"
import { SectionHeading } from "@/shared/ui/system/section-heading"
import { StripedPattern } from "@/shared/ui/system/striped-pattern"

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

function renderBookmarkIcon(type: BookmarkItem["iconType"]) {
  const iconClass =
    "size-3.5 text-muted-foreground transition-colors group-hover:text-foreground"

  switch (type) {
    case "copper":
      return (
        <span className="text-xs font-bold tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
          C_
        </span>
      )
    case "vercel":
      return <Triangle className={cn(iconClass, "fill-current")} />
    case "book":
      return <BookOpen className={iconClass} />
    case "article":
      return <FileText className={iconClass} />
    case "shader":
      return <Flame className={iconClass} />
    case "code":
      return <Code2 className={iconClass} />
    case "course":
    default:
      return <GraduationCap className={iconClass} />
  }
}

const CATEGORY_TABS: Array<{
  label: string
  value: "All" | BookmarkItem["type"]
}> = [
  { label: "All", value: "All" },
  { label: "Courses", value: "Course" },
  { label: "References", value: "Reference" },
  { label: "Articles", value: "Article" },
  { label: "Software", value: "Software" },
  { label: "Books", value: "Book" },
]

export const SectionBookmarks = () => {
  const [activeCategory, setActiveCategory] = useState<
    "All" | BookmarkItem["type"]
  >("All")

  const countsByType = useMemo(() => {
    const counts: Record<string, number> = { All: BOOKMARKS.length }
    BOOKMARKS.forEach((item) => {
      counts[item.type] = (counts[item.type] || 0) + 1
    })
    return counts
  }, [])

  const filteredBookmarks = useMemo(() => {
    if (activeCategory === "All") return BOOKMARKS
    return BOOKMARKS.filter((item) => item.type === activeCategory)
  }, [activeCategory])

  return (
    <>
      {/* Heading Section */}
      <GridContainer className="p-0" showCrosshairs={false}>
        <SectionHeading
          id="bookmarks"
          heading="Bookmarks"
          count={BOOKMARKS.length}
        />
      </GridContainer>

      {/* Filter Category Toolbar */}
      <GridContainer
        borderTop={false}
        borderBottom={true}
        showCrosshairs={false}
        className="bg-card/20 p-3 sm:px-8"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORY_TABS.map((tab) => {
            const count = countsByType[tab.value] ?? 0
            if (tab.value !== "All" && !count) return null
            const isActive = activeCategory === tab.value

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveCategory(tab.value)}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-all duration-200",
                  isActive
                    ? "bg-foreground font-semibold text-background shadow-xs"
                    : "border border-border/80 bg-background/60 text-muted-foreground hover:border-border hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] opacity-70",
                    isActive ? "text-background" : "text-muted-foreground"
                  )}
                >
                  ({count})
                </span>
              </button>
            )
          })}
        </div>
      </GridContainer>

      {/* 2-Column Responsive Blueprint Grid */}
      <GridContainer
        borderTop={false}
        borderBottom={false}
        showCrosshairs={true}
        className="p-0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {filteredBookmarks.map((item, idx) => {
            const domain = getHostname(item.url)
            const isLeftColumn = idx % 2 === 0

            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group relative flex flex-col justify-between gap-3.5 p-4 transition-all duration-200 sm:p-5",
                  "bg-card/20 hover:bg-accent/40 dark:bg-card/5 dark:hover:bg-white/[0.03]",
                  "border-b border-border",
                  isLeftColumn && "border-border md:border-r"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    {/* Icon Box */}
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-background shadow-xs transition-all duration-200 group-hover:border-border group-hover:bg-accent sm:size-10">
                      {renderBookmarkIcon(item.iconType)}
                    </div>

                    {/* Title, Badge & Domain */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground sm:text-base">
                          {item.title}
                        </h3>
                        <span className="inline-flex items-center rounded-xs border border-border/70 bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium tracking-tight text-muted-foreground transition-colors group-hover:text-foreground">
                          {item.type}
                        </span>
                      </div>
                      <span className="mt-0.5 truncate text-[11px] text-muted-foreground/70 transition-colors group-hover:text-muted-foreground">
                        {domain}
                      </span>
                    </div>
                  </div>

                  {/* Top-Right: Arrow Action */}
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background text-muted-foreground shadow-xs transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-border group-hover:bg-accent group-hover:text-foreground">
                    <ArrowUpRight className="size-3.5 transition-transform" />
                  </div>
                </div>

                {/* Bottom Row: Author & Date Meta */}
                <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-2.5 text-[11px] text-muted-foreground/80">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/40 transition-colors group-hover:bg-muted-foreground/70" />
                    <span className="truncate">by {item.author}</span>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground/60">
                    {item.date}
                  </span>
                </div>
              </a>
            )
          })}

          {filteredBookmarks.length % 2 !== 0 && (
            <div className="relative hidden min-h-[110px] flex-col items-center justify-center gap-1.5 border-b border-border bg-card/[0.03] p-4 text-center select-none sm:p-5 md:flex">
              <StripedPattern
                variant="absolute"
                size={12}
                className="pointer-events-none opacity-35 dark:opacity-15"
              />
              <div className="relative z-10 flex items-center gap-2 text-[11px] tracking-wider text-muted-foreground/60 uppercase">
                <span>More Bookmarks Coming Soon</span>
              </div>
              <p className="relative z-10 text-[10px] text-muted-foreground/40">
                Curating additional design & engineering references
              </p>
            </div>
          )}
        </div>
      </GridContainer>
    </>
  )
}
