import { MousePointer2 } from "lucide-react"

export function TextHoverEffectSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-muted/60 p-3 select-none dark:bg-neutral-950/80">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-2xl" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-[9px] text-muted-foreground/60 uppercase">
          Dynamic SVG Mask
        </span>
        <span className="size-1.5 rounded-full bg-primary" />
      </div>

      {/* Typography Preview Stage */}
      <div className="relative flex items-center justify-center py-2">
        {/* Faded background outline letters */}
        <span className="stroke-white/20 [stroke-width:1.5px] font-mono text-2xl font-black tracking-widest text-transparent">
          HOVER
        </span>

        {/* Highlighted text under spotlight */}
        <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 [mask-image:radial-gradient(circle_at_65%_45%,black_40%,transparent_75%)] bg-clip-text font-mono text-2xl font-black tracking-widest text-transparent">
          HOVER
        </span>

        {/* Simulated Cursor */}
        <div className="absolute top-1/4 right-3 z-10 flex items-center gap-1">
          <MousePointer2 className="size-3.5 fill-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          <span className="rounded-full bg-white/10 px-1 py-0.5 font-mono text-[7px] text-white/80 backdrop-blur-xs">
            pointer
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>Radial Mask</span>
        <span className="font-medium text-primary">Automatic</span>
      </div>
    </div>
  )
}
