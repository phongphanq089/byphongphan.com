import { format, parseISO } from "date-fns"
import { use, useMemo } from "react"

import { cn } from "@/shared/lib/utils"
import { Spinner } from "@/shared/ui/core/spinner"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core/tooltip"
import type { Activity } from "@/shared/ui/system/contribution-graph"
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/shared/ui/system/contribution-graph"

export type GitHubContributionsProps = {
  contributions: Promise<Activity[]>
  githubProfileUrl: string
  year?: number | string
  fullWidth?: boolean
  className?: string
}

export function GitHubContributions({
  contributions,
  githubProfileUrl,
  year,
  fullWidth = true,
  className,
}: GitHubContributionsProps) {
  const rawData = use(contributions)

  const data = useMemo(() => {
    if (!rawData || rawData.length === 0) return []

    // When viewing the rolling last year, ensure the calendar includes today
    if (!year || year === "last") {
      const todayStr = format(new Date(), "yyyy-MM-dd")
      const lastDate = rawData.at(-1)?.date

      if (lastDate && lastDate < todayStr) {
        return [
          ...rawData,
          {
            date: todayStr,
            count: 0,
            level: 0,
          },
        ]
      }
    }

    return rawData
  }, [rawData, year])

  const dateRangeLabel = useMemo(() => {
    if (data.length === 0) return null

    const firstDate = data[0]?.date
    const lastDate = data.at(-1)?.date

    if (!firstDate || !lastDate) return null

    const startFormatted = format(parseISO(firstDate), "dd.MM.yyyy")
    const endFormatted = format(parseISO(lastDate), "dd.MM.yyyy")

    return `${startFormatted} \u2013 ${endFormatted}`
  }, [data])

  return (
    <ContributionGraph
      className={cn(fullWidth ? "w-full" : "mx-auto", "py-2", className)}
      data={data}
      year={year}
      blockSize={11}
      blockMargin={3}
      blockRadius={2}
      fullWidth={fullWidth}
    >
      <ContributionGraphCalendar
        className="no-scrollbar px-1"
        fullWidth={fullWidth}
        title="GitHub Contributions"
      >
        {({ activity, dayIndex, weekIndex }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <g>
                <ContributionGraphBlock
                  activity={activity}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                />
              </g>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {activity.count} contribution{activity.count === 1 ? "" : "s"}{" "}
                on {format(parseISO(activity.date), "dd.MM.yyyy")}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </ContributionGraphCalendar>

      <ContributionGraphFooter
        className={cn("px-1 text-xs", fullWidth && "w-full justify-between")}
      >
        <ContributionGraphTotalCount>
          {({ totalCount }) => {
            const formattedTotal = totalCount.toLocaleString("en")

            return (
              <div className="text-xs text-muted-foreground">
                {formattedTotal} contribution{totalCount === 1 ? "" : "s"}
                {dateRangeLabel ? `, ${dateRangeLabel}` : null}
                {". Source: "}
                <a
                  className="text-foreground link-underline"
                  href={githubProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                .
              </div>
            )
          }}
        </ContributionGraphTotalCount>

        <ContributionGraphLegend />
      </ContributionGraphFooter>
    </ContributionGraph>
  )
}

export function GitHubContributionsFallback() {
  return (
    <div className="flex h-40.5 w-full items-center justify-center">
      <Spinner className="text-muted-foreground" />
    </div>
  )
}
