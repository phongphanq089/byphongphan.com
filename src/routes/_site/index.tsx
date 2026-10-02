import { createFileRoute } from "@tanstack/react-router"
import { lazy, Suspense, useEffect, useRef, useState } from "react"

import { GridContainer } from "@/app/layouts"
import BannerHero from "@/features/home/banner-hero"
import SectionAbout from "@/features/home/section-about"
import { SectionBlocks } from "@/features/home/section-blocks"
import { SectionBookmarks } from "@/features/home/section-bookmarks"
import SectionTechStack from "@/features/home/section-tech-stack"
import UiComponentsSection from "@/features/home/section-ui-components"
import { createSeoMeta } from "@/shared/config"

const LazySectionMapVietnamese = lazy(
  () => import("@/features/home/section-map-vietnammese")
)

function VietnamMapViewportLoader() {
  const [inView, setInView] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof IntersectionObserver === "undefined"
  )
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || inView) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "400px" }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [inView])

  return (
    <div
      ref={containerRef}
      className="min-h-[440px] w-full sm:min-h-[520px] md:min-h-[580px]"
    >
      {inView ? (
        <Suspense
          fallback={
            <div className="flex h-[440px] w-full items-center justify-center bg-background sm:h-[520px] md:h-[580px]">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="size-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                <span>Loading Vietnam map...</span>
              </div>
            </div>
          }
        >
          <LazySectionMapVietnamese />
        </Suspense>
      ) : (
        <div className="flex h-[440px] w-full items-center justify-center bg-background sm:h-[520px] md:h-[580px]">
          <span className="font-mono text-xs text-muted-foreground/60">
            Ninh Hoà, Khánh Hoà • Vietnam
          </span>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: createSeoMeta("home"),
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <div className="w-full">
      {/* 1. Banner Hero (manages its own GridContainers) */}
      <div className="relative overflow-hidden">
        <BannerHero />
      </div>

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
        <GridContainer showCrosshairs={true} borderTop={false} as={"div"}>
          <VietnamMapViewportLoader />
        </GridContainer>
      </section>
    </div>
  )
}
