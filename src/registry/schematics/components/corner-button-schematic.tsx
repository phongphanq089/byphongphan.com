export function CornerButtonSchematic() {
  return (
    <div className="group relative flex h-34 w-54 items-center justify-center overflow-hidden rounded-xl border border-zinc-900/10 bg-zinc-900/[0.02] p-3 shadow-inner select-none dark:border-white/10 dark:bg-white/[0.03]">
      {/* 1. Ambient Background Glow on Hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(70px circle at center, rgba(var(--primary-rgb, 120, 120, 120), 0.2), transparent 75%)",
        }}
      />

      {/* 2. Interactive Outer Bounds / CAD Wireframe */}
      <div className="relative flex items-center justify-center p-3">
        {/* Corner Dashed Lines */}
        <div className="absolute -top-1 right-0 left-0 h-px border-t border-dashed border-zinc-900/40 transition-transform duration-300 group-hover:scale-x-105 dark:border-white/40" />
        <div className="absolute right-0 -bottom-1 left-0 h-px border-b border-dashed border-zinc-900/40 transition-transform duration-300 group-hover:scale-x-105 dark:border-white/40" />
        <div className="absolute top-0 bottom-0 -left-1 w-px border-l border-dashed border-zinc-900/40 transition-transform duration-300 group-hover:scale-y-105 dark:border-white/40" />
        <div className="absolute top-0 -right-1 bottom-0 w-px border-r border-dashed border-zinc-900/40 transition-transform duration-300 group-hover:scale-y-105 dark:border-white/40" />

        {/* 4 Corner Orbiting Dots */}
        <div className="absolute -top-1.5 -left-1.5 size-1.5 rounded-full bg-primary/70 ring-1 ring-primary/40 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
        <div className="absolute -top-1.5 -right-1.5 size-1.5 rounded-full bg-primary/70 ring-1 ring-primary/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        <div className="absolute -right-1.5 -bottom-1.5 size-1.5 rounded-full bg-primary/70 ring-1 ring-primary/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
        <div className="absolute -bottom-1.5 -left-1.5 size-1.5 rounded-full bg-primary/70 ring-1 ring-primary/40 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:translate-y-0.5" />

        {/* 3. Center Pill Button */}
        <div className="relative flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1.5 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/25 dark:bg-primary/20">
          <div className="h-1.5 w-12 rounded-full bg-foreground/70 dark:bg-white/80" />
          <div className="size-2 rounded-xs border border-foreground/60 dark:border-white/70" />
        </div>
      </div>
    </div>
  )
}
