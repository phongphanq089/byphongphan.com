import { GridContainer } from "@/app/layouts"
import { cn } from "@/shared/lib/utils"

import { Background } from "./background"
import { Frame } from "./banner-frame"

export interface BannerV2Props {
  greeting?: string

  subheadline?: string
  className?: string
}

export function BannerHero({
  subheadline = "An open-source UI registry and engineering showcase for crafted components and production-ready blocks. Resilient primitives and fluid micro-interactions crafted with intention.",
  className,
}: BannerV2Props) {
  return (
    <section
      className={cn(
        "group/banner relative flex min-h-[calc(100svh-14rem)] w-full flex-col justify-between overflow-hidden bg-background text-foreground select-none lg:min-h-[calc(100svh-4rem)]",
        "@container",
        className
      )}
    >
      <Background />

      <GridContainer
        as="div"
        borderTop={false}
        borderBottom={false}
        borderLeft={true}
        borderRight={true}
        showCrosshairs={false}
        className="relative z-10 flex min-h-[calc(100svh-14rem)] flex-col items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-16 md:py-20 lg:min-h-[calc(100svh-4rem)] lg:py-24"
      >
        <div className="relative flex w-full flex-col items-center gap-6 text-center">
          <Frame subheadline={subheadline} />
        </div>
      </GridContainer>

      <style>{`
        .collab-live-ping {
          animation: collab-ping 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes collab-ping {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          75%, 100% {
            transform: scale(2.6);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}

export default BannerHero
