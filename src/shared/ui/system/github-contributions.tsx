import { format } from "date-fns"
import { use } from "react"

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

export function GitHubContributions({
  contributions,
  githubProfileUrl,
  year,
  className,
}: {
  contributions: Promise<Activity[]>
  githubProfileUrl: string
  year?: number | string
  className?: string
}) {
  const data = use(contributions)

  return (
    <ContributionGraph
      className={cn("mx-auto py-2", className)}
      data={data}
      year={year}
      blockSize={11}
      blockMargin={3}
      blockRadius={2}
    >
      <ContributionGraphCalendar
        className="no-scrollbar px-2"
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
            <TooltipContent className="">
              <p>
                {activity.count} contribution{activity.count > 1 ? "s" : null}{" "}
                on {format(new Date(activity.date), "dd.MM.yyyy")}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </ContributionGraphCalendar>

      <ContributionGraphFooter className="px-2">
        <ContributionGraphTotalCount>
          {({ totalCount }) => {
            const timeLabel = year ? `in ${year}` : "in the last year"
            return (
              <div className="text-muted-foreground">
                {totalCount.toLocaleString("en")} contributions {timeLabel} on{" "}
                <a
                  className="text-foreground link-underline"
                  href={githubProfileUrl}
                  target="_blank"
                  rel="noopener"
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
