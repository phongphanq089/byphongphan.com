import { Type } from "lucide-react"

export function PhongPhanIsometricSchematic() {
  return (
    <div className="relative flex h-[130px] w-full max-w-[210px] flex-col items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-neutral-950 p-3 shadow-lg select-none">
      {/* Technical blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundSize: "14px 14px",
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
        }}
      />

      {/* 45-degree isometric projection accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.4) 0px, rgba(255, 255, 255, 0.4) 0.5px, transparent 0.5px, transparent 10px)",
        }}
      />

      {/* Ambient center glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-xl" />

      {/* Typography Preview Stage */}
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-1 rounded-md border border-white/20 bg-neutral-900/80 px-2 py-1 shadow-sm">
          <Type className="size-3.5 text-primary" />
          <span className="font-mono text-[10px] font-bold tracking-widest text-white/90">
            3D TYPOGRAPHY
          </span>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[8px] text-white/60">
          Extruded Block Mesh
        </span>
      </div>

      {/* Bottom badge */}
      <div className="absolute right-3 bottom-2 left-3 flex items-center justify-between border-t border-white/10 pt-1.5">
        <span className="font-mono text-[9px] text-white/50">
          Block Extrusion
        </span>
        <div className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-primary" />
          <span className="size-1.5 rounded-full bg-cyan-400" />
        </div>
      </div>
    </div>
  )
}

export default PhongPhanIsometricSchematic
