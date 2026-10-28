import { Hydrate } from "@tanstack/react-start"
import { idle } from "@tanstack/react-start/hydration"

import { siteConfig } from "@/shared/config"
import { BlueprintCanvasBackground } from "@/shared/ui"
import { PPMarkIsometric } from "@/shared/ui/animation/pp-mark-isometric"
import KoiPond from "@/shared/ui/background/koi-background/koi-pond"

export default function BannerHero() {
  return (
    <section className="relative flex min-h-[calc(100svh-20rem)] w-full flex-col justify-between gap-2 overflow-hidden bg-background lg:h-[calc(100svh-3rem)] lg:min-h-0">
      <h1 className="sr-only">{siteConfig.title}</h1>

      <Hydrate when={idle()}>
        <KoiPond className="absolute inset-0 z-0 h-full w-full" />
      </Hydrate>

      <BlueprintCanvasBackground showGrid={false} />

      <div className="relative z-10 flex min-h-0 w-full flex-1 items-center justify-center px-4 py-3 sm:px-8 sm:py-5 lg:py-2">
        <div
          data-koi-avoid
          className="group relative mx-auto flex w-full max-w-sm flex-col items-center justify-center sm:max-w-md md:max-w-lg lg:max-w-2xl 4xl:max-w-4xl"
        >
          <PPMarkIsometric IsometricBlueprint={false} />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-background via-background/70 to-transparent [mask-image:linear-gradient(to_top,black_20%,transparent)] backdrop-blur-[2px] [-webkit-mask-image:linear-gradient(to_top,black_20%,transparent)] sm:h-36 md:h-48 lg:h-60"
      />
    </section>
  )
}
