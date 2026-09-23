import { Terminal } from "lucide-react"

import { BackgroundGradientCursor } from "@/registry/animated/background-gradient-cursor"
import { Badge } from "@/shared/ui/core/badge"

export function BackgroundGradientCursorCyberpunk() {
  return (
    <div className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden rounded-xl border border-cyan-500/20 bg-neutral-950 p-6 shadow-xs select-none">
      <BackgroundGradientCursor
        position="absolute"
        gradient={{
          display: true,
          tilt: 60,
          colorStart: "cyan-500",
          colorEnd: "fuchsia-600",
          opacity: 20,
        }}
        grid={{
          display: true,
          width: "28px",
          height: "28px",
          color: "cyan-400",
          opacity: 18,
        }}
        lines={{
          display: true,
          size: 20,
          color: "fuchsia-500",
          opacity: 12,
        }}
        mask={{
          cursor: true,
          radius: 170,
          gradient: `radial-gradient(
            circle at var(--mask-position-x) var(--mask-position-y),
            rgba(6, 182, 212, 0.6) 0%,
            rgba(217, 70, 239, 0.4) 35%,
            transparent 70%
          )`,
        }}
      />

      <div className="relative z-10 flex max-w-sm flex-col items-center gap-2.5 rounded-lg border border-cyan-500/30 bg-neutral-900/70 p-5 text-center backdrop-blur-md">
        <Badge
          variant="outline"
          className="border-cyan-500/40 bg-cyan-950/40 font-mono text-cyan-300"
        >
          <Terminal className="mr-1.5 size-3" />
          CYBERPUNK NEON
        </Badge>
        <h4 className="text-sm font-semibold tracking-wide text-cyan-100">
          Neural Mesh Interface
        </h4>
        <p className="text-xs text-neutral-400">
          Custom multi-stop radial gradient with dual-tone cyan & fuchsia
          projection tracking the pointer.
        </p>
      </div>
    </div>
  )
}

export default BackgroundGradientCursorCyberpunk
