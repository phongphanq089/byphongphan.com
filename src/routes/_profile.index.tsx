import { createFileRoute } from "@tanstack/react-router"

import { GridContainer } from "@/app/layouts"
import BannerHero from "@/features/home/banner-hero"
import SectionAbout from "@/features/home/section-about"
import { SectionBlocks } from "@/features/home/section-blocks"
import { SectionBookmarks } from "@/features/home/section-bookmarks"
import SectionMapVietnamese from "@/features/home/section-map-vietnammese"
import SectionTechStack from "@/features/home/section-tech-stack"
import UiComponentsSection from "@/features/home/section-ui-components"
import { createSeoMeta } from "@/shared/config"

export const Route = createFileRoute("/_profile/")({
  head: () => ({
    meta: createSeoMeta("home"),
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <div className="w-full">
      {/* 1. Banner Hero */}
      <GridContainer
        className="relative flex flex-col overflow-hidden px-4 pt-8 pb-12 sm:px-8"
        showCrosshairs={true}
        borderBottom={false}
      >
        <BannerHero />
      </GridContainer>

      {/* 2. About Me */}
      <SectionAbout />

      {/* 3. Tech Stack */}
      <SectionTechStack />

      {/* 4. Blocks Showcase Section */}
      <SectionBlocks />

      {/* 5. Components UI Showcase Section */}
      <UiComponentsSection />

      {/* 6. Blog & Writing Section */}
      {/* <SectionBlog /> */}

      {/* 7. Curated Resources Section */}
      {/* <SectionResources /> */}

      {/* 8. Bookmarks Section */}
      <SectionBookmarks />

      {/* 9. Location & Vietnam Map Section */}
      <section id="vietnam-map">
        <GridContainer showCrosshairs={true} as={"div"}>
          <SectionMapVietnamese />
        </GridContainer>
      </section>
    </div>
  )
}
