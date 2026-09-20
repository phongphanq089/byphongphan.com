import { ArrowRight, BookOpen, CheckCircle2, Clock } from "lucide-react"

import { Button } from "@/shared/ui/core"

import type { BlogGroup } from "../types"

interface BlogSeriesCardProps {
  group: BlogGroup
  postCount: number
  onSelect: (groupSlug: string) => void
}

export const BlogSeriesCard = ({
  group,
  postCount,
  onSelect,
}: BlogSeriesCardProps) => {
  return (
    <div
      onClick={() => onSelect(group.slug.current)}
      className="group relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-card/90 via-card/60 to-background p-5 transition-all duration-300 hover:border-pp-primary/60 hover:shadow-lg sm:p-6"
    >
      {/* Top Section: Cover + Badges */}
      <div className="flex flex-col gap-4">
        {group.coverImage?.url && (
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border/50 bg-muted/40">
            <img
              src={group.coverImage.url}
              alt={group.coverImage.alt || group.title}
              className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-105"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-70 transition-opacity group-hover:opacity-50" />

            {/* Top Left: Category Badge */}
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
              <span className="flex items-center gap-1 rounded-md border border-white/20 bg-black/75 px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs backdrop-blur-md">
                <BookOpen className="size-2.5 text-pp-primary" />
                <span>SERIES</span>
              </span>
            </div>

            {/* Top Right: Status Badge */}
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
              <span
                className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md ${
                  group.isCompleted
                    ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-400"
                    : "border-amber-500/40 bg-amber-950/80 text-amber-400"
                }`}
              >
                {group.isCompleted ? (
                  <>
                    <CheckCircle2 className="size-2.5" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Clock className="size-2.5" />
                    <span>Ongoing</span>
                  </>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-pp-primary sm:text-xl">
              {group.title}
            </h3>
          </div>

          {group.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {group.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Section: Part Count + Action Button */}
      <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-3">
        <span className="text-xs font-medium text-muted-foreground">
          {postCount} {postCount === 1 ? "Article" : "Articles"} published
        </span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs text-pp-primary transition-transform group-hover:translate-x-1"
        >
          <span>Explore Series</span>
          <ArrowRight className="size-3" />
        </Button>
      </div>
    </div>
  )
}
