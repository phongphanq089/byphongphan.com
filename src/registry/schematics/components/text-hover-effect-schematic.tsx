import { MousePointer2 } from "lucide-react"

export function TextHoverEffectSchematic() {
  return (
    <div className="relative flex h-[150px] w-full max-w-[410px] flex-col items-center justify-center overflow-hidden rounded-md border bg-muted p-3 select-none dark:bg-neutral-950">
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
    </div>
  )
}
