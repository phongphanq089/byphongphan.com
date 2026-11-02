import { MousePointer2, Volume2 } from "lucide-react"

import { PhongPhanIsometric } from "@/registry/animated/phong-phan-isometric"
import { Badge } from "@/registry/ui/badge"

export function PhongPhanIsometricDemo() {
  return (
    <div className="relative flex min-h-[380px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border/80 bg-accent p-6 shadow-xs select-none">
      {/* Top instruction badges */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <Badge variant="outline">
          <Volume2 className="mr-1 size-3" />
          Interactive Sound Feedback
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
