import { createFileRoute } from "@tanstack/react-router"

import BlueprintCanvasBackground from "@/features/home/banner-hero/blueprint-canvas-background"
import { PPPixelMark } from "@/shared/ui"

export const Route = createFileRoute("/brand-app")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className="relative flex h-screen w-full flex-col justify-between gap-4 overflow-hidden border-b bg-background">
        <BlueprintCanvasBackground />

        {/* ─── Hero Monogram Mark Section (Centered & Elevated) ─── */}
        <div className="relative z-10 flex w-full flex-1 items-center justify-center px-4 py-8 sm:py-12 md:px-8 md:py-16">
          <div className="group relative mx-auto flex w-full max-w-sm flex-col items-center justify-center sm:max-w-md md:max-w-lg lg:max-w-2xl 4xl:max-w-4xl">
            <PPPixelMark className="h-48 w-48 text-pp-primary sm:h-56 sm:w-56" />
          </div>
        </div>
      </div>
    </div>
  )
}
