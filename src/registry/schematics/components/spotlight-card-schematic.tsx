export function SpotlightCardSchematic() {
  return (
    <div className="relative flex h-28 w-44 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-white/[0.03] p-3 shadow-inner select-none">
      {/* Simulated spotlight wash */}
      <div className="pointer-events-none absolute -top-4 -right-4 size-24 rounded-full bg-radial from-white/20 to-transparent blur-md" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-white/40" />
          <div className="h-1.5 w-10 rounded-full bg-white/25" />
        </div>
        <div className="size-1.5 rounded-full bg-primary/60 shadow-[0_0_6px_var(--color-primary)]" />
      </div>

      {/* Center content placeholder */}
      <div className="relative z-10 flex flex-col gap-1.5 py-1">
        <div className="h-1.5 w-full rounded-xs bg-white/30" />
        <div className="h-1.5 w-4/5 rounded-xs bg-white/15" />
      </div>

      {/* Footer bar */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-1.5">
        <div className="h-1 w-8 rounded-full bg-white/20" />
        <div className="h-2.5 w-6 rounded-xs bg-white/20" />
      </div>

      {/* Glowing border highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-xl border border-white/30 [mask-image:radial-gradient(circle_at_top_right,black_30%,transparent_70%)]" />
    </div>
  )
}
