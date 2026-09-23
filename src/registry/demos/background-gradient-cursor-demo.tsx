import { Compass, Sparkles } from "lucide-react"

import { BackgroundGradientCursor } from "@/registry/animated/background-gradient-cursor"
import { Badge } from "@/shared/ui/core/badge"

export function BackgroundGradientCursorDemo() {
  return (
    <div className="relative flex min-h-[360px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-neutral-950 p-6 shadow-xs select-none">
      <BackgroundGradientCursor
        position="absolute"
        gradient={{
          display: true,
          tilt: 135,
          colorStart: "emerald-500",
          colorEnd: "transparent",
          opacity: 25,
        }}
        dots={{
          display: true,
          size: 1.5,
          color: "white",
          opacity: 18,
        }}
        grid={{
          display: true,
          width: "36px",
          height: "36px",
          color: "white/10",
          opacity: 20,
        }}
        lines={{
          display: true,
          size: 24,
          opacity: 15,
        }}
        mask={{
          cursor: true,
          radius: 160,
          color: "rgba(16, 185, 129, 0.45)",
        }}
      />

      <div className="relative z-10 flex max-w-md flex-col items-center gap-3 text-center">
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-950/40 text-emerald-400 backdrop-blur-md"
        >
          <Sparkles className="mr-1.5 size-3 text-emerald-400" />
          Interactive Canvas Stage
        </Badge>

        <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Move your cursor across this surface
        </h3>

        <p className="text-xs leading-relaxed text-neutral-400">
          The radial mask tracks your cursor in real time with
          hardware-accelerated requestAnimationFrame easing, unveiling
          procedural grid layers and multi-stop directional gradients.
        </p>

        <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-neutral-500">
          <Compass className="size-3.5 text-emerald-500" />
          <span>Interactive coordinates: dynamic GPU radial blur</span>
        </div>
      </div>
    </div>
  )
}

export default BackgroundGradientCursorDemo
