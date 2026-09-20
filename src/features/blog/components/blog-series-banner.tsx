import { ArrowLeft, BookOpen, CheckCircle2, Clock } from "lucide-react"

import { Button } from "@/shared/ui/core"

import type { BlogGroup } from "../types"

interface BlogSeriesBannerProps {
  group: BlogGroup
  totalParts: number
  onClear: () => void
}

export const BlogSeriesBanner = ({
  group,
  totalParts,
  onClear,
}: BlogSeriesBannerProps) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-pp-primary/30 bg-gradient-to-br from-pp-primary/[0.08] via-background to-background p-5 sm:p-6 md:p-8">
      {/* Background glow accent */}
      <div className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full bg-pp-primary/15 blur-3xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-pp-primary/40 bg-pp-primary/15 px-2.5 py-0.5 text-[10px] font-semibold text-pp-primary">
              <BookOpen className="size-3" />
              <span>SERIES COLLECTION</span>
            </span>

            <span
              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                group.isCompleted
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400"
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
                  <span>Ongoing Series</span>
                </>
              )}
            </span>

            <span className="rounded-full border border-border/80 bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
              {totalParts} {totalParts === 1 ? "Part" : "Parts"}
            </span>
          </div>

          {/* Series Title */}
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl">
            {group.title}
          </h2>

          {/* Series Description */}
          {group.description && (
            <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {group.description}
            </p>
          )}
        </div>

        {/* Action Button: Back to All Articles */}
        <div className="flex shrink-0 items-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClear}
            className="gap-2 border-border/80 text-xs font-medium hover:border-pp-primary hover:text-pp-primary"
          >
            <ArrowLeft className="size-3.5" />
            <span>All Articles</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
