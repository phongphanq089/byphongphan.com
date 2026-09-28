import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { GridContainer } from "@/app/layouts"
import { SectionHeading } from "@/shared/ui/system/section-heading"

export const SectionResources = () => {
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
        <span></span>
      </GridContainer>
    </>
  )
}
