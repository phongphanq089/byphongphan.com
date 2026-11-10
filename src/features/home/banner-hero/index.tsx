import { cn } from "@/shared/lib/utils"

import { Background } from "./background"
import { Frame } from "./banner-frame"

export interface BannerV2Props {
  greeting?: string
  subheadline?: string
  className?: string
}

export function BannerHero({ className }: BannerV2Props) {
  return (
    <section
      className={cn(
        "group/banner relative flex min-h-[calc(100svh-14rem)] w-full flex-col justify-between overflow-hidden bg-background text-foreground select-none lg:min-h-[calc(100svh-4rem)]",
        "@container",
        className
      )}
    >
      <Background />

      <div className="relative z-10 flex min-h-[calc(100svh-14rem)] flex-col justify-between p-0 text-center lg:min-h-[calc(100svh-4rem)]">
        <Frame />
      </div>

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
