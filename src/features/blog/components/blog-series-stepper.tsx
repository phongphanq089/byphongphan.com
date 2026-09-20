import { Link } from "@tanstack/react-router"
import { ArrowRight, Check, CheckCircle2, Clock, Layers } from "lucide-react"

import { cn } from "@/shared/lib"
import { Badge } from "@/shared/ui/core"

import type { BlogPost } from "../types"

interface BlogSeriesStepperProps {
  group: BlogPost["group"]
  currentSlug: string
  currentGroupOrder?: number
  seriesPosts: BlogPost[]
}

export function BlogSeriesStepper({
  group,
  currentSlug,
  currentGroupOrder = 1,
  seriesPosts,
}: BlogSeriesStepperProps) {
  if (!group || seriesPosts.length <= 1) return null

  return (
    <div className="mt-12 overflow-hidden rounded-xl border border-border/80 bg-card/40 p-5 backdrop-blur-xs sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg border border-pp-primary/40 bg-pp-primary/10 text-pp-primary">
            <Layers className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase">
              <span className="font-semibold text-pp-primary">
                SERIES ROADMAP
              </span>
              <span>•</span>
              <span>
                PART {currentGroupOrder} OF {seriesPosts.length}
              </span>
            </div>
            <h3 className="text-sm font-bold text-foreground sm:text-base">
              {group.title}
            </h3>
          </div>
        </div>

        <Badge
          variant="outline"
          className={cn(
            "text-[10px]",
            group.isCompleted
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          )}
        >
          {group.isCompleted ? (
            <>
              <CheckCircle2 className="mr-1 size-2.5" />
              <span>COMPLETED</span>
            </>
          ) : (
            <>
              <Clock className="mr-1 size-2.5" />
              <span>ONGOING SERIES</span>
            </>
          )}
        </Badge>
      </div>

      {/* Stepper Node Rail */}
      <div className="relative mt-5 flex flex-col gap-3 pl-1">
        {seriesPosts.map((sp, idx) => {
          const isCurrent = sp.slug.current === currentSlug
          const isPast = (sp.groupOrder ?? 0) < currentGroupOrder

          return (
            <div
              key={sp._id}
              className="group relative flex items-start gap-3.5"
            >
              {/* Vertical connecting rail line */}
              {idx < seriesPosts.length - 1 && (
                <span
                  className={cn(
                    "pointer-events-none absolute top-8 left-[17px] h-[calc(100%+0.5rem)] w-[1.5px]",
                    isPast ? "bg-pp-primary/60" : "bg-border/60"
                  )}
                />
              )}

              {/* Step Status Node */}
              <div
                className={cn(
                  "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all",
                  isCurrent
                    ? "border-pp-primary bg-pp-primary text-primary-foreground shadow-md ring-4 ring-pp-primary/20"
                    : isPast
                      ? "border-pp-primary/60 bg-pp-primary/10 text-pp-primary"
                      : "border-border/80 bg-background text-muted-foreground group-hover:border-pp-primary/50 group-hover:text-foreground"
                )}
              >
                {isPast ? (
                  <Check className="size-3.5" />
                ) : (
                  <span>{sp.groupOrder ?? idx + 1}</span>
                )}
              </div>

              {/* Step Item Link */}
              <Link
                to="/blog/$slug"
                params={{ slug: sp.slug.current }}
                className={cn(
                  "flex flex-1 items-center justify-between rounded-lg border p-3 transition-all",
                  isCurrent
                    ? "border-pp-primary/50 bg-pp-primary/[0.07] shadow-xs"
                    : "border-border/50 bg-background/50 hover:border-pp-primary/40 hover:bg-muted/30"
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      Part {sp.groupOrder ?? idx + 1}
                    </span>
                    {isCurrent && (
                      <Badge
                        variant="outline"
                        className="border-pp-primary/40 bg-pp-primary/10 px-1 py-0 text-[9px] text-pp-primary"
                      >
                        CURRENT
                      </Badge>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium sm:text-sm",
                      isCurrent
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {sp.title}
                  </span>
                </div>

                <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
                  <span>{sp.readTime}m read</span>
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
