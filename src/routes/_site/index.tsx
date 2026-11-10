import { createFileRoute } from "@tanstack/react-router"
import { lazy, Suspense, useEffect, useRef, useState } from "react"

import { ContainerLayout } from "@/app/layouts"
import {
  BannerHero,
  SectionAbout,
  SectionBlog,
  SectionHooks,
  SectionResources,
} from "@/features/home"
import { SectionBlocks } from "@/features/home/section-blocks"
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
      <div className="relative overflow-hidden">
        <BannerHero />
      </div>

      <ContainerLayout
        defaultWidth={1024}
        minWidth={420}
        maxWidth={1600}
        symmetric={true}
        showDimensions={true}
        hintText="pull the cord!"
        className="min-h-fit"
        contentClassName="min-h-fit"
      >
        <div className="relative flex w-full flex-col">
          {/* 2. About Section */}
          <SectionAbout />

          {/* 3. Tech Stack Section */}
          <SectionTechStack />

          {/* 4. Blocks Showcase Section */}
          <SectionBlocks />

          {/* 5. Components UI Showcase Section */}
          <UiComponentsSection />

          {/* 6. React Hooks Section */}
          <SectionHooks />

          {/* 7. Blog & Writing Section */}
          <SectionBlog />

          {/* 8. Curated Resources Section */}
          <SectionResources />

          {/* 9. Location & Vietnam Map Section */}
          <section id="vietnam-map" className="w-full">
            <VietnamMapViewportLoader />
          </section>
        </div>
      </ContainerLayout>
    </div>
  )
}
