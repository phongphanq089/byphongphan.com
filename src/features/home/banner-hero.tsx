import { Suspense } from "react"

import { GridContainer } from "@/app/layouts"
import { useIsClient } from "@/shared/hooks"
import { lazyWithRetry } from "@/shared/lib"
import { PPMarkIsometric, Skeleton } from "@/shared/ui"

const LazyTechText = lazyWithRetry(
  () => import("@/shared/ui/animation/tech-text")
)

function TechTextSkeleton() {
  return (
    <div
      className="relative flex h-[150px] w-full items-center justify-center px-2 select-none sm:px-6"

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
  return (
    <>
      <GridContainer
        borderTop={true}
        borderBottom={true}
        borderLeft={true}
        borderRight={true}
        showCrosshairs={false}
        className="relative z-10"
      >
        <div className="w-fulL mx-automax-w-[1400px] relative z-10 px-4 md:px-8">
          <div className="group relative mx-auto flex flex-col items-center justify-center">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl">
              <PPMarkIsometric />
            </div>
          </div>
        </div>
      </GridContainer>

      <GridContainer
        borderTop={false}
        borderBottom={false}
        borderLeft={true}
        borderRight={true}
        showCrosshairs={false}
        className="relative z-10"
      >
        <div className="mx-auto py-8 text-center">
          <div style={{ width: "100%", position: "relative" }}>
            {isClient ? (
              <Suspense fallback={<TechTextSkeleton />}>
                <LazyTechText
                  text="PHONG PHAN"
                  fontWeight={600}
                  fontSize={450}
                  height={150}
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
        </div>
      </GridContainer>
    </>
  )
}
