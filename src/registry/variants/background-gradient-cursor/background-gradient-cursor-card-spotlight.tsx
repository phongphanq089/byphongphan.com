import { Layers } from "lucide-react"

import { BackgroundGradientCursor } from "@/registry/animated/background-gradient-cursor"
import { Badge } from "@/registry/ui/badge"
export function BackgroundGradientCursorCardSpotlight() {
  return (
    <div className="relative flex size-full min-h-[400px] w-full items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-background p-6 shadow-xs select-none">
      <BackgroundGradientCursor
        position="absolute"
        gradient={{
          display: true,
          tilt: 180,
          colorStart: "amber-500",
          colorEnd: "transparent",
          opacity: 18,
        }}
        dots={{
          display: true,
          size: 1,
          color: "amber-400",
          opacity: 20,
        }}
        mask={{
          cursor: true,
          radius: 180,
          color: "rgba(245, 158, 11, 0.35)",
        }}
      />

      <div className="relative z-10 flex max-w-sm flex-col items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-neutral-950/70 p-6 text-center shadow-2xl backdrop-blur-md">
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-950/40 font-mono text-[10px] text-amber-300"
        >
          <Layers className="mr-1.5 size-3" />
          AMBER SPOTLIGHT
        </Badge>
        <h4 className="text-base font-semibold tracking-wide text-amber-100">
          Warm Surface Reveal
        </h4>
        <p className="text-xs leading-relaxed text-neutral-400">
          Soft golden radial glow with fine amber dot accents that smoothly
          tracks the viewer without visual noise.
        </p>
      </div>
    </div>
  )
}

export default BackgroundGradientCursorCardSpotlight
