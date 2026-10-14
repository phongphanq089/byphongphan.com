export function SpotlightCardSchematic() {
  return (
    <div className="group relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-zinc-900/10 bg-zinc-900/[0.02] p-3 shadow-inner select-none dark:border-white/10 dark:bg-white/[0.03]">
      {/* 1. Ambient Spotlight Wash (Quầng sáng chiếu rọi bên trong mặt thẻ) */}
      <div
        className="pointer-events-none absolute inset-0 transition-transform duration-500 group-hover:scale-105"
        style={{
          background:
            "radial-gradient(95px circle at 82% 22%, rgba(161, 161, 170, 0.22), transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 hidden transition-transform duration-500 group-hover:scale-105 dark:block"
        style={{
          background:
            "radial-gradient(95px circle at 82% 22%, rgba(255, 255, 255, 0.16), transparent 75%)",
        }}
      />

      {/* 2. Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-zinc-900/45 dark:bg-white/45" />
          <div className="h-1.5 w-10 rounded-full bg-zinc-900/25 dark:bg-white/25" />
        </div>

        {/* Simulated Cursor / Spotlight Center */}
        <div className="relative flex items-center justify-center">
          <div className="absolute size-4 rounded-full bg-primary/20 blur-[2px] dark:bg-white/20" />
          <div className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] dark:bg-white dark:shadow-[0_0_8px_#ffffff]" />
        </div>
      </div>

      {/* 3. Center Content Placeholder (Sáng hơn ở phía gần Spotlight) */}
      <div className="relative z-10 flex flex-col gap-1.5 py-1">
        <div className="h-1.5 w-full rounded-xs bg-gradient-to-r from-zinc-900/20 via-zinc-900/35 to-zinc-900/50 dark:from-white/15 dark:via-white/30 dark:to-white/55" />
        <div className="h-1.5 w-4/5 rounded-xs bg-zinc-900/20 dark:bg-white/20" />
      </div>

      {/* 4. Footer Bar */}
      <div className="relative z-10 flex items-center justify-between border-t border-zinc-900/10 pt-1.5 dark:border-white/10">
        <div className="h-1 w-8 rounded-full bg-zinc-900/20 dark:bg-white/20" />
        <div className="h-2.5 w-6 rounded-xs border border-zinc-900/15 bg-zinc-900/10 dark:border-white/15 dark:bg-white/15" />
      </div>

      {/* 5. Glowing Border Highlight tại góc chiếu sáng */}
      <div className="pointer-events-none absolute inset-0 rounded-xl border border-zinc-900/40 [mask-image:radial-gradient(circle_at_top_right,black_25%,transparent_65%)] dark:border-white/45" />
    </div>
  )
}
