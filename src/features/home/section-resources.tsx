import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { GridContainer } from "@/app/layouts"
import { ResourceCard, resourcesQueryOptions } from "@/features/resources"
import { SectionHeading } from "@/shared/ui/system/section-heading"

export const SectionResources = () => {
  const { data: resources = [] } = useQuery(resourcesQueryOptions())

  // Select top featured resources or first 4
  const featured = resources.filter((r) => r.isFeatured)
  const displayList = featured.length > 0 ? featured : resources

  if (displayList.length === 0) {
    return null
  }

  const row1 = displayList.slice(0, 2)
  const row2 = displayList.slice(2, 4)

  return (
    <>
      <GridContainer className="p-0" showCrosshairs={false}>
        <SectionHeading
          id="resources"
          heading="Developer Resources"
          action={
            <Link
              to="/resources"
              className="group flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:bg-accent/60 hover:text-foreground active:scale-98"
            >
              <span>Explore all resources</span>
              <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          }
        />
      </GridContainer>

      {/* Row 1: 2-Column Grid of Resources */}
      <GridContainer
        columns={2}
        borderTop={false}
        borderBottom={true}
        showCrosshairs={true}
        className="w-full"
      >
        {row1.map((resource, idx) => (
          <div
            key={resource._id}
            className={`flex h-full w-full p-4 sm:p-5 md:p-6 ${
              idx === 0 && row1.length > 1
                ? "border-b border-border md:border-r md:border-b-0"
                : ""
            }`}
          >
            <ResourceCard resource={resource} />
          </div>
        ))}
      </GridContainer>

      {/* Row 2: 2-Column Grid of Resources (only if 3+ items exist) */}
      {row2.length > 0 && (
        <GridContainer
          columns={2}
          borderTop={false}
          borderBottom={true}
          showCrosshairs={true}
          className="w-full"
        >
          {row2.map((resource, idx) => (
            <div
              key={resource._id}
              className={`flex h-full w-full p-4 sm:p-5 md:p-6 ${
                idx === 0
                  ? "border-b border-border md:border-r md:border-b-0"
                  : ""
              }`}
            >
              <ResourceCard resource={resource} />
            </div>
          ))}
        </GridContainer>
      )}
    </>
  )
}
