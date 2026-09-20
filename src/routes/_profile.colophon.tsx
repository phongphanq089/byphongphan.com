import { createFileRoute } from "@tanstack/react-router"

import { GridContainer } from "@/app/layouts"
import {
  ColophonDesign,
  ColophonHero,
  ColophonInspirations,
  ColophonSpecs,
  ColophonTechnology,
} from "@/features/colophon"
import { createSeoMeta } from "@/shared/config"

export const Route = createFileRoute("/_profile/colophon")({
  head: () => ({
    meta: createSeoMeta("colophon"),
  }),
  component: ColophonPage,
})

function ColophonPage() {
  return (
    <div className="w-full">
      {/* 01. Hero & Philosophy */}
      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="px-6 sm:px-10"
      >
        <ColophonHero />
      </GridContainer>

      {/* 02. Architecture & Technology */}
      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="px-6 sm:px-10"
      >
        <ColophonTechnology />
      </GridContainer>

      {/* 03. Design & Typography */}
      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="px-6 sm:px-10"
      >
        <ColophonDesign />
      </GridContainer>

      {/* 04. Inspirations */}
      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="px-6 sm:px-10"
      >
        <ColophonInspirations />
      </GridContainer>

      {/* 05. Technical Manifest & Specs */}
      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="px-6 sm:px-10"
      >
        <ColophonSpecs />
      </GridContainer>
    </div>
  )
}
