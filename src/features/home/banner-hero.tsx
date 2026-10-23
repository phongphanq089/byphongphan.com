import { Suspense } from "react"

import { GridContainer } from "@/app/layouts"
import { siteConfig } from "@/shared/config"
import { useIsClient } from "@/shared/hooks"
import { TextHoverEffect } from "@/shared/ui"
import { BlueprintCanvasBackground } from "@/shared/ui/animation/blueprint-canvas-background"
import { PPMarkIsometric } from "@/shared/ui/animation/pp-mark-isometric"
import { Skeleton } from "@/shared/ui/core/skeleton"

function TechTextSkeleton() {
  return (
    <div
      className="relative mx-auto flex h-[70px] w-full max-w-7xl items-center justify-center px-2 select-none sm:px-6 md:h-[150px]"

      aria-busy="true"
      aria-label="Loading interactive typography..."
    >
      <div className="flex h-full w-full items-center gap-1.5 py-3 sm:gap-2.5 md:gap-3.5">
        <div className="flex h-full flex-[5] items-center gap-1 sm:gap-2 md:gap-2.5">
          <Skeleton className="h-full flex-1 animate-pulse rounded-sm bg-accent" />

          <Skeleton className="h-full flex-1 animate-pulse rounded-sm bg-accent" />

          <Skeleton className="h-full flex-1 animate-pulse rounded-sm bg-accent" />

          <Skeleton className="h-full flex-1 animate-pulse rounded-sm bg-accent" />

          <Skeleton className="h-full flex-1 animate-pulse rounded-sm bg-accent" />
        </div>

        <div className="w-3 shrink-0 sm:w-6 md:w-8" />

        <div className="flex h-full flex-[4] items-center gap-1 sm:gap-2 md:gap-2.5">
          <Skeleton className="h-full flex-1 animate-pulse rounded-sm bg-accent" />

          <Skeleton className="h-full flex-1 animate-pulse rounded-sm bg-accent" />

          <Skeleton className="h-full flex-1 animate-pulse rounded-sm bg-accent" />

          <Skeleton className="h-full flex-1 animate-pulse rounded-sm bg-accent" />
        </div>
      </div>
    </div>
  )
}

export default function BannerHero() {
  const isClient = useIsClient()

  const NEON_PALETTE = ["#00f5d4", "#00bbf9", "#7b2cbf", "#f72585"]
  return (
    <section className="relative flex min-h-[calc(100svh-10rem)] w-full flex-col justify-between gap-2 overflow-hidden bg-background lg:h-[calc(100svh-3rem)] lg:min-h-0">
      <h1 className="sr-only">{siteConfig.title}</h1>

      <BlueprintCanvasBackground showGrid={false} />

      {/* Main visual */}
      <div className="relative z-10 flex min-h-0 w-full flex-1 items-center justify-center px-4 py-3 sm:px-8 sm:py-5 lg:py-2">
        <div className="group relative mx-auto flex w-full max-w-sm flex-col items-center justify-center sm:max-w-md md:max-w-lg lg:max-w-2xl 4xl:max-w-4xl">
          <PPMarkIsometric IsometricBlueprint={false} />
        </div>
      </div>

      {/* Bottom typography */}
      <GridContainer
        borderTop={true}
        borderBottom={false}
        showCrosshairs={false}
        className="relative z-10 w-full shrink-0 p-0 py-2 sm:py-3 lg:py-0"
      >
        <div className="relative w-full">
          {isClient ? (
            <Suspense fallback={<TechTextSkeleton />}>
              <TextHoverEffect text="PHONG PHAN" colors={NEON_PALETTE} />
            </Suspense>
          ) : (
            <TechTextSkeleton />
          )}
        </div>
      </GridContainer>
    </section>
  )
}
