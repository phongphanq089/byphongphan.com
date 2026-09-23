import { Box } from "lucide-react"

export function PPMarkIsometricSchematic() {
  return (
    <div className="relative flex h-[130px] w-full max-w-[210px] flex-col items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-neutral-950 p-3 shadow-lg select-none">
      {/* 30-degree isometric background grid guides */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(30deg, rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(150deg, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "24px 14px",
        }}
      />

      {/* Radial spotlight glow */}
      <div className="pointer-events-none absolute size-16 rounded-full bg-primary/25 blur-xl" />

      {/* Isometric Monogram Silhouette Preview */}
      <div className="relative z-10 flex flex-col items-center gap-1.5">
        <div className="relative flex size-12 items-center justify-center rounded-lg border border-primary/40 bg-neutral-900/80 shadow-md">
          <Box className="size-6 text-primary drop-shadow-[0_2px_8px_rgba(239,68,68,0.5)]" />
          <span className="absolute -top-1 -right-1 flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[8px] text-white/70">
          3D Voxel • Spring Physics
        </span>
      </div>

      {/* Bottom status badge */}
      <div className="absolute right-3 bottom-2 left-3 flex items-center justify-between border-t border-white/10 pt-1.5">
        <span className="font-mono text-[9px] text-white/50">
          Isometric Monogram
        </span>
        <div className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-primary" />
          <span className="size-1.5 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  )
}

export default PPMarkIsometricSchematic
