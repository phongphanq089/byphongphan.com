import { MapPin,Minus, Navigation, Plus } from "lucide-react"

export function MapSchematic() {
  return (
    <div className="relative flex h-[130px] w-full max-w-[210px] flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-neutral-950 p-2.5 shadow-lg select-none">
      {/* Background Grid & Contour lines */}
      <svg
        className="absolute inset-0 size-full stroke-white/[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="map-schematic-grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 20 0 L 0 0 0 20" fill="none" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-schematic-grid)" />
        {/* Curved route vector */}
        <path
          d="M 20 100 Q 80 40 120 70 T 190 30"
          fill="none"
          className="stroke-primary/50"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      </svg>

      {/* Top Bar: Controls & Compass */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 backdrop-blur-xs">
          <Navigation className="size-2.5 rotate-45 text-white/70" />
          <span className="font-mono text-[9px] tracking-wider text-white/60">
            37°N
          </span>
        </div>

        <div className="flex flex-col gap-0.5 rounded-md border border-white/10 bg-white/[0.04] p-0.5 backdrop-blur-xs">
          <div className="flex size-3.5 items-center justify-center rounded text-white/70">
            <Plus className="size-2.5" />
          </div>
          <div className="h-px w-full bg-white/10" />
          <div className="flex size-3.5 items-center justify-center rounded text-white/70">
            <Minus className="size-2.5" />
          </div>
        </div>
      </div>

      {/* Center Marker with Pulse Effect */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute size-5 animate-ping rounded-full bg-primary/30" />
          <div className="flex size-5 items-center justify-center rounded-full border border-primary/40 bg-primary/20 shadow-xs">
            <MapPin className="size-3 text-primary" />
          </div>
        </div>
      </div>

      {/* Bottom status chip */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 backdrop-blur-md">
          <div className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="font-mono text-[9px] text-white/70">Vector Map</span>
        </div>
        <div className="h-1.5 w-10 rounded-full bg-white/20" />
      </div>
    </div>
  )
}
