export function LineNavSchematic() {
  return (
    <div className="flex w-full max-w-[210px] flex-col gap-2 rounded-xl border border-white/15 bg-neutral-900/80 p-3.5 shadow-lg backdrop-blur-xs select-none">
      {/* Item 1 - Inactive */}
      <div className="flex items-center gap-2">
        <span className="h-0.5 w-4 rounded-full bg-white/20" />
        <span className="h-1.5 w-14 rounded-full bg-white/30" />
      </div>

      {/* Subline divider ticks */}
      <div className="flex flex-col gap-1 pl-0.5">
        <span className="h-0.5 w-3 rounded-full bg-white/10" />
        <span className="h-0.5 w-3 rounded-full bg-white/10" />
      </div>

      {/* Item 2 - Active (Elongated with glowing highlight) */}
      <div className="flex items-center gap-2">
        <span className="h-0.5 w-8 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
        <span className="h-1.5 w-20 rounded-full bg-white/90" />
      </div>

      {/* Subline divider ticks */}
      <div className="flex flex-col gap-1 pl-0.5">
        <span className="h-0.5 w-3 rounded-full bg-white/10" />
        <span className="h-0.5 w-3 rounded-full bg-white/10" />
      </div>

      {/* Item 3 - Inactive */}
      <div className="flex items-center gap-2">
        <span className="h-0.5 w-4 rounded-full bg-white/20" />
        <span className="h-1.5 w-16 rounded-full bg-white/30" />
      </div>
    </div>
  )
}
