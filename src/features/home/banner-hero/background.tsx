import { PixelBlast } from "@/features/home/banner-hero/pixel-blast"
import { getPixelBlastInlineScript } from "@/features/home/banner-hero/pixel-blast-inline"

import BlueprintCanvasBackground from "./blueprint-canvas-background"

export function Background() {
  return (
    <>
      {/* ── 0. Instant SSR Ambient Pixel Matrix (Zero-JS Fallback / First Paint 0ms) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Soft atmospheric depth glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_48%_at_50%_46%,rgba(203,213,225,0.08),transparent_75%)]" />
        <div className="size-full bg-[radial-gradient(rgba(203,213,225,0.45)_1.2px,transparent_1.2px)] [mask-image:radial-gradient(ellipse_78%_58%_at_50%_48%,black_35%,transparent_90%)] [background-size:18px_18px] opacity-35" />
      </div>

      {/* ── 1. Interactive PixelBlast WebGL Background (Early 0ms Bootstrap) ── */}
      <div className="absolute inset-0 z-0 dark:opacity-20">
        <PixelBlast
          id="hero-pixel-blast-canvas"
          variant="square"
          pixelSize={4}
          color="#cbd5e1"
          accentColor="#000000"
          patternScale={3.5}
          patternDensity={0.9}
          softness={0.2}
          glow={0}
          twinkle={0.35}
          drift={0.16}
          driftAngle={160}
          hoverEffect="reveal"
          hoverRadius={130}
          enableRipples={true}
          autoRipple={4}
          rippleSpeed={0.38}
          rippleThickness={0.16}
          rippleIntensityScale={1.5}
          edgeFade={0.35}
          transparent={true}
          intro={true}
          introDuration={0.65}
          dpr={1}
          className="size-full"
        />
        {/* Inline Vanilla Micro-Script — initializes WebGL at 0ms during HTML parse */}
        <script
          id="hero-pixel-blast-bootstrap"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: getPixelBlastInlineScript("hero-pixel-blast-canvas"),
          }}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_0%,var(--color-background)_95%)]"
      />

      <BlueprintCanvasBackground className="z-2 opacity-80" />
    </>
  )
}
