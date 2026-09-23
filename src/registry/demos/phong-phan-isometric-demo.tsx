import { MousePointer2, Volume2 } from "lucide-react"

import { PhongPhanIsometric } from "@/registry/animated/phong-phan-isometric"
import { Badge } from "@/shared/ui/core/badge"

export function PhongPhanIsometricDemo() {
  return (
    <div className="relative flex min-h-[380px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-neutral-950 p-6 shadow-xs select-none">
      {/* Top instruction badges */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <Badge
          variant="outline"
          className="border-primary/30 bg-primary/5 text-[10px] text-primary"
        >
          <Volume2 className="mr-1 size-3" />
          Interactive Sound Feedback
        </Badge>
        <Badge
          variant="outline"
          className="border-white/10 bg-white/5 font-mono text-[10px] text-white/70"
        >
          <MousePointer2 className="mr-1 size-3" />
          Dynamic Lighting
        </Badge>
      </div>

      {/* Interactive Typography Canvas */}
      <div className="relative z-10 w-full max-w-4xl py-6">
        <PhongPhanIsometric
          variant="full"
          showGrid={true}
          className="drop-shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
        />
      </div>

      <p className="mt-2 text-center font-mono text-[11px] text-muted-foreground">
        Horizontal 3D Block Typography • Real-time dynamic flashlight
        illumination • Tap to compress blocks
      </p>
    </div>
  )
}

export default PhongPhanIsometricDemo
