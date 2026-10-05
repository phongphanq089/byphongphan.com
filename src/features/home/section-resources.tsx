import React from "react"

import { GridContainer } from "@/app/layouts"
import { SectionHeading } from "@/shared/ui/system/section-heading"

export const SectionResources = () => {
  return (
    <>
      <GridContainer className="p-0" showCrosshairs={false}>
        <SectionHeading
          id="resources"
          heading="Developer Resources"
          actionHref="/resources"
          actionLabel="All resources"
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
