import { MousePointer2 } from "lucide-react"

export function BackgroundGradientCursorSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-muted/60 p-3 select-none dark:bg-neutral-950/80">
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

      {/* Radial spotlight tracking pseudo cursor */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 75%)",
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-[9px] text-muted-foreground/60">
          MESH CURSOR
        </span>
        <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
      </div>

      {/* Interactive Cursor Pointer & Coordinate Tag */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="flex items-center gap-1.5">
          <MousePointer2 className="size-4 fill-emerald-400 text-emerald-300 drop-shadow-[0_2px_8px_rgba(16,185,129,0.7)]" />
          <span className="rounded border border-emerald-500/30 bg-emerald-950/80 px-1.5 py-0.5 font-mono text-[9px] text-emerald-300 backdrop-blur-xs">
            x: 128 y: 46
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>Dual-Tone</span>
        <span className="text-emerald-400">Spring Tracking</span>
      </div>
    </div>
  )
}
