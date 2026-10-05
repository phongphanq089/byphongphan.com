import React, { Suspense } from "react"

import { GridContainer } from "@/app/layouts"
import { useIsClient, useMediaQuery } from "@/shared/hooks"
import { lazyWithRetry } from "@/shared/lib"
import { BlueprintCanvasBackground } from "@/shared/ui/animation/blueprint-canvas-background"
import { PPMarkIsometric } from "@/shared/ui/animation/pp-mark-isometric"
import { Skeleton } from "@/shared/ui/core/skeleton"

const LazyTechText = lazyWithRetry(
  () => import("@/shared/ui/animation/tech-text")
)

function TechTextSkeleton() {
  return (
    <div
      className="relative mx-auto flex h-[70px] w-full max-w-7xl items-center justify-center px-2 select-none sm:px-6 md:h-[150px]"

      aria-busy="true"
      aria-label="Loading interactive typography..."
    >
      <div className="flex h-full w-full items-center gap-1.5 py-3 sm:gap-2.5 md:gap-3.5">
        <div className="flex h-full flex-[5] items-center gap-1 sm:gap-2 md:gap-2.5">
          <div className="relative flex h-full flex-1 items-center justify-center">
            <div className="relative flex h-full w-full items-center justify-center rounded-sm border border-dashed border-foreground/80 p-1 dark:border-white/80">
              <span className="absolute -top-1 -left-1 h-1.5 w-1.5 bg-foreground dark:bg-white" />
              <span className="absolute -top-1 -right-1 h-1.5 w-1.5 bg-foreground dark:bg-white" />
              <span className="absolute -bottom-1 -left-1 h-1.5 w-1.5 bg-foreground dark:bg-white" />
              <span className="absolute -right-1 -bottom-1 h-1.5 w-1.5 bg-foreground dark:bg-white" />

              <span className="absolute -top-4.5 left-0 font-mono text-[9px] tracking-tight whitespace-nowrap text-foreground/80 dark:text-white/80">
                P 72 x 106
              </span>

              <Skeleton className="h-full w-full animate-pulse rounded-sm bg-foreground/20 dark:bg-white/20" />
            </div>
          </div>

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

  const isMd = useMediaQuery("md")
  return (
    <section className="relative flex w-full flex-col justify-between gap-4 overflow-hidden bg-background lg:min-h-[calc(100vh-5rem)]">
      <BlueprintCanvasBackground />

      {/* ─── Hero Monogram Mark Section (Centered & Elevated) ─── */}
      <div className="relative z-10 flex w-full flex-1 items-center justify-center px-4 py-8 sm:py-12 md:px-8 md:py-16">
        <div className="group relative mx-auto flex w-full max-w-sm flex-col items-center justify-center sm:max-w-md md:max-w-lg lg:max-w-2xl 4xl:max-w-4xl">
          <PPMarkIsometric IsometricBlueprint={false} />
        </div>
      </div>

      <GridContainer
        borderTop={true}
        borderBottom={false}
        showCrosshairs={false}
        className="z-10 w-full p-0 py-4 md:py-8"
      >
        <div style={{ width: "100%", position: "relative" }}>
          {isClient ? (
            <Suspense fallback={<TechTextSkeleton />}>
              <LazyTechText
                text="PHONG PHAN"
                fontWeight={600}
                fontSize={400}
                height={isMd ? 170 : 70}
                reveal="area"
                dashLength={5}
                dashGap={2}
                specks={10}
                letterSpacing={-0.05}
                reach={200}
                softness={0.7}
                strokeWidth={1}
                speed={1}
                lineStyle="dashed"
                selection
                labels
                sweep
              />
            </Suspense>
          ) : (
            <TechTextSkeleton />
          )}
        </div>
      </GridContainer>
    </section>
  )
}
