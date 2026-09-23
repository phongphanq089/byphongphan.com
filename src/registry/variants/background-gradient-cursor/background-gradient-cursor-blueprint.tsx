import { Ruler } from "lucide-react"

import { BackgroundGradientCursor } from "@/registry/animated/background-gradient-cursor"
import { Badge } from "@/shared/ui/core/badge"

export function BackgroundGradientCursorBlueprint() {
  return (
    <div className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden rounded-xl border border-sky-500/20 bg-[#081325] p-6 shadow-xs select-none">
      <BackgroundGradientCursor
        position="absolute"
        grid={{
          display: true,
          width: "24px",
          height: "24px",
          color: "sky-400",
          opacity: 22,
        }}
        dots={{
          display: true,
          size: 1.5,
          color: "sky-200",
          opacity: 35,
        }}
        mask={{
          cursor: true,
          radius: 140,
          color: "rgba(56, 189, 248, 0.4)",
        }}
      />

      <div className="relative z-10 flex max-w-sm flex-col items-center gap-2.5 rounded-lg border border-sky-500/20 bg-[#0a192f]/80 p-5 text-center backdrop-blur-md">
        <Badge
          variant="outline"
          className="border-sky-500/30 bg-sky-950/40 font-mono text-[10px] text-sky-300"
        >
          <Ruler className="mr-1.5 size-3" />
          TECHNICAL BLUEPRINT
        </Badge>
        <h4 className="text-sm font-semibold tracking-wide text-sky-100">
          Precision Grid Matrix
        </h4>
        <p className="text-xs text-sky-200/70">
          Fine-pitched 24px grid layout paired with high-contrast dot
          intersections illuminated by a focused azure spotlight.
        </p>
      </div>
    </div>
  )
}

export default BackgroundGradientCursorBlueprint
