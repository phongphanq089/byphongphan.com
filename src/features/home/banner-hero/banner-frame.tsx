import { cn } from "@/shared/lib/utils"

import { BuildComposeShip3DHeadline } from "./build-compose-ship3d-headline"
import { PhongPhan3DHeadline } from "./phong-phan-3d-headline"

export interface BannerV2FrameProps {
  className?: string
}

export function Frame({ className }: BannerV2FrameProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[calc(100svh-14rem)] w-full flex-col items-center justify-between bg-transparent lg:min-h-[calc(100svh-4rem)]",
        className
      )}
    >
      <div className="relative flex w-full flex-1 items-center justify-center px-6 pt-6 sm:pt-10 md:pt-12">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 inset-y-2 z-0 mx-auto max-w-2xl bg-gradient-to-r from-transparent via-background/80 to-transparent [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] backdrop-blur-md"
        />
        <div className="relative z-10 w-full">
          <BuildComposeShip3DHeadline />
        </div>
      </div>

      <div className="relative mt-auto flex w-full flex-col items-center justify-end px-4 pt-16 pb-6 text-center sm:pb-8 md:pb-12">
        <div className="flex w-full max-w-sm flex-1 items-center justify-center pt-6 sm:pt-10 md:pt-12">
          <PhongPhan3DHeadline />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full bg-gradient-to-t from-background via-background/75 to-transparent [mask-image:radial-gradient(ellipse_at_bottom,black_45%,transparent_90%)]"
        />
      </div>
    </div>
  )
}
