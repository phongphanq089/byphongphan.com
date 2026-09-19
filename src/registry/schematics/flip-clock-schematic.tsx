export function FlipClockSchematic() {
  return (
    <div className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-neutral-950/60 px-8 py-2 font-mono shadow-md select-none">
      {/* Flap 1 */}
      <div className="relative flex h-13 w-9 flex-col overflow-hidden rounded-md border border-white/15 bg-neutral-900 shadow-sm">
        <div className="h-1/2 w-full border-b border-black bg-neutral-800/80" />
        <div className="h-1/2 w-full bg-neutral-900" />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/90">
          1
        </div>
      </div>

      {/* Flap 2 */}
      <div className="relative flex h-13 w-9 flex-col overflow-hidden rounded-md border border-white/15 bg-neutral-900 shadow-sm">
        <div className="h-1/2 w-full border-b border-black bg-neutral-800/80" />
        <div className="h-1/2 w-full bg-neutral-900" />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/90">
          2
        </div>
      </div>

      {/* Colon */}
      <div className="flex flex-col gap-1 text-xs font-bold text-white/40">
        <span>:</span>
      </div>

      {/* Flap 3 */}
      <div className="relative flex h-13 w-9 flex-col overflow-hidden rounded-md border border-white/15 bg-neutral-900 shadow-sm">
        <div className="h-1/2 w-full border-b border-black bg-neutral-800/80" />
        <div className="h-1/2 w-full bg-neutral-900" />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/90">
          4
        </div>
      </div>

      {/* Flap 4 */}
      <div className="relative flex h-13 w-9 flex-col overflow-hidden rounded-md border border-white/15 bg-neutral-900 shadow-sm">
        <div className="h-1/2 w-full border-b border-black bg-neutral-800/80" />
        <div className="h-1/2 w-full bg-neutral-900" />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white/90">
          5
        </div>
      </div>
    </div>
  )
}
