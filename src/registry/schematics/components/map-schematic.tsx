import { MapPin, Minus, Navigation, Plus } from "lucide-react"

export function MapSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-muted/60 p-3 select-none dark:bg-neutral-950/80">
      {/* Background Grid & Contour lines */}
      <svg
        className="absolute inset-0 size-full stroke-white/[0.08]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="map-schematic-grid"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 18 0 L 0 0 0 18" fill="none" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#map-schematic-grid)" />
        {/* Curved route vector */}
        <path
          d="M 15 90 Q 75 35 110 65 T 200 25"
          fill="none"
          className="stroke-primary/60"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
      </svg>

      {/* Top Bar: Controls & Compass */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded border border-white/10 bg-black/60 px-1.5 py-0.5 backdrop-blur-xs">
          <Navigation className="size-2.5 rotate-45 text-white/80" />
          <span className="font-mono text-[9px] tracking-wider text-white/70">
            37°N
          </span>
        </div>

        <div className="flex flex-col gap-0.5 rounded-[3px] border border-white/10 bg-black/60 p-0.5 backdrop-blur-xs">
          <Plus className="size-2.5 text-white/70" />
          <div className="h-px w-full bg-white/10" />
          <Minus className="size-2.5 text-white/70" />
        </div>
      </div>

      {/* Center Pin Marker */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="flex size-6 items-center justify-center rounded-full border border-primary/40 bg-primary/20 shadow-[0_0_12px_var(--primary)] backdrop-blur-xs">
          <MapPin className="size-3 text-primary" />
        </div>
      </div>

      {/* Bottom Bar: Vector Map label */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono text-[9px] text-white/70">Vector Map</span>
        </div>
        <span className="font-mono text-[9px] text-muted-foreground/60">
          CARTO Dark
        </span>
      </div>
    </div>
  )
}
