import { MousePointer2 } from "lucide-react"

export function TextHoverEffectSchematic() {
  return (
    <div className="relative flex h-[130px] w-full max-w-[210px] flex-col items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-neutral-950 p-3 shadow-lg select-none">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-2xl" />

      {/* Typography Preview Stage */}
      <div className="relative flex items-center justify-center">
        {/* Faded background outline letters */}
        <span className="stroke-white/20 [stroke-width:1.5px] font-sans text-3xl font-black tracking-widest text-transparent">
          HOVER
        </span>

        {/* Highlighted text under spotlight */}
        <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 [mask-image:radial-gradient(circle_at_65%_45%,black_40%,transparent_75%)] bg-clip-text font-sans text-3xl font-black tracking-widest text-transparent">
          HOVER
        </span>

        {/* Simulated Cursor following the spotlight */}
        <div className="absolute top-1/4 right-8 z-10 flex items-center gap-1">
          <MousePointer2 className="size-4 fill-white/80 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          <span className="rounded-full bg-white/10 px-1.5 py-0.5 font-mono text-[8px] text-white/80 backdrop-blur-xs">
            cursor
          </span>
        </div>
      </div>

      {/* Bottom badge */}
      <div className="absolute right-3 bottom-2 left-3 flex items-center justify-between border-t border-white/10 pt-1.5">
        <span className="font-mono text-[9px] text-white/50">
          SVG Stroke + Mask
        </span>
        <div className="flex gap-1">
          <span className="size-1.5 rounded-full bg-amber-400" />
          <span className="size-1.5 rounded-full bg-rose-400" />
          <span className="size-1.5 rounded-full bg-cyan-400" />
        </div>
      </div>
    </div>
  )
}
