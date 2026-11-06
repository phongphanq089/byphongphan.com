import AsciiSkyline from "@/registry/animated/ascii-skyline"
import { siteConfig } from "@/shared/config"
import { BlueprintCanvasBackground } from "@/shared/ui"

export default function BannerHero() {
  return (
    <section className="relative flex min-h-[calc(100svh-20rem)] w-full flex-col justify-between gap-2 overflow-hidden bg-background lg:h-[calc(100svh-3rem)] lg:min-h-0">
      <h1 className="sr-only">{siteConfig.title}</h1>

      <AsciiSkyline className="absolute inset-0 z-0 h-full w-full" />

      <BlueprintCanvasBackground showGrid={false} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-background via-background/70 to-transparent [mask-image:linear-gradient(to_top,black_20%,transparent)] backdrop-blur-[2px] [-webkit-mask-image:linear-gradient(to_top,black_20%,transparent)] sm:h-36 md:h-48 lg:h-60"
      />
    </section>
  )
}
