import { MousePointer2 } from "lucide-react"

export function BackgroundGradientCursorSchematic() {
  return (
    <div className="relative flex h-[130px] w-full max-w-[210px] flex-col items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-neutral-950 p-3 shadow-lg select-none">
      {/* Background grid canvas */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundSize: "16px 16px",
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
          `,
        }}
      />

      {/* Repeating 45deg accent lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.4) 0px, rgba(255, 255, 255, 0.4) 0.5px, transparent 0.5px, transparent 8px)",
        }}
      />

      {/* Radial spotlight tracking pseudo cursor */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 75%)",
        }}
      />

      {/* Interactive Cursor Pointer & Coordinate Tag */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5">
          <MousePointer2 className="size-4 fill-emerald-400 text-emerald-300 drop-shadow-[0_2px_8px_rgba(16,185,129,0.7)]" />
          <span className="rounded-full border border-emerald-500/30 bg-emerald-950/60 px-1.5 py-0.5 font-mono text-[8px] text-emerald-300 backdrop-blur-xs">
            x: 128 y: 46
          </span>
        </div>
        <div className="h-1 w-8 rounded-full bg-white/20" />
      </div>

      {/* Bottom status badge */}
      <div className="absolute right-3 bottom-2 left-3 flex items-center justify-between border-t border-white/10 pt-1.5">
        <span className="font-mono text-[9px] text-white/50">
          Grid + Cursor Mask
        </span>
        <div className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          <span className="size-1.5 rounded-full bg-cyan-400" />
        </div>
      </div>
    </div>
  )
}
