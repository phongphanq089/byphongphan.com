import { MousePointer2, Volume2 } from "lucide-react"

import { PPMarkIsometric } from "@/registry/animated/pp-mark-isometric"
import { Badge } from "@/shared/ui/core/badge"

export function PPMarkIsometricDemo() {
  return (
    <div className="relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-accent p-6 shadow-xs select-none">
      {/* Top instruction badges */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/5 text-[10px] text-primary"
        >
          <Volume2 className="mr-1 size-3" />
          Click to Tap with Audio
        </Badge>
        <Badge
          variant="outline"
          className="border-white/10 bg-white/5 font-mono text-[10px] text-white/70"
        >
          <MousePointer2 className="mr-1 size-3" />
          Track Cursor
        </Badge>
      </div>

      {/* Interactive Monogram Container */}
      <div className="relative z-10 w-full max-w-lg py-6">
        <PPMarkIsometric className="drop-shadow-[0_12px_36px_rgba(0,0,0,0.6)]" />
      </div>

      <p className="mt-2 text-center font-mono text-[11px] text-muted-foreground">
        Interactive 3D Voxel Monogram • Hover mouse for flashlight spotlight •
        Click/tap for spring press
      </p>
    </div>
  )
}

export default PPMarkIsometricDemo
