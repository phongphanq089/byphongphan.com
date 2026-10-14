export function BorderGlowSchematic() {
  return (
    <div className="group relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-zinc-900/10 bg-zinc-900/[0.02] p-3 shadow-inner select-none dark:border-white/10 dark:bg-white/[0.03]">
      {/* 1. Corner Spotlight Aura (Quầng sáng lan tỏa từ góc trên phải) */}
      <div className="pointer-events-none absolute -top-6 -right-6 size-24 rounded-full bg-purple-500/15 blur-xl transition-transform duration-500 group-hover:scale-125 dark:bg-purple-400/20" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 size-20 rounded-full bg-sky-500/10 blur-xl dark:bg-sky-400/15" />

      {/* 2. Directional Perimeter Border Glow (Viền sáng tập trung ở góc và mờ dần) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl p-px [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]"
        style={{
          background:
            "radial-gradient(110px circle at 85% 15%, #c084fc, #f472b6 45%, transparent 100%), radial-gradient(90px circle at 15% 85%, #38bdf8, transparent 100%)",
        }}
      />

      {/* 3. Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="size-2 rounded-full bg-purple-500/85 shadow-[0_0_6px_rgba(168,85,247,0.5)] dark:bg-purple-400 dark:shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
          <div className="h-1.5 w-12 rounded-full bg-zinc-900/40 dark:bg-white/40" />
        </div>
        {/* Điểm sáng mô phỏng vị trí con trỏ tạo Glow */}
        <div className="flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 dark:border-purple-300/30 dark:bg-purple-400/15">
          <div className="size-1 rounded-full bg-purple-500 dark:bg-purple-300" />
          <div className="h-1 w-3 rounded-full bg-purple-500/50 dark:bg-purple-200/50" />
        </div>
      </div>

      {/* 4. Center Content Lines */}
      <div className="relative z-10 flex flex-col gap-1.5 py-1">
        <div className="h-2 w-2/3 rounded-xs bg-zinc-900/70 shadow-[0_0_6px_rgba(0,0,0,0.1)] dark:bg-white/80 dark:shadow-[0_0_6px_rgba(255,255,255,0.2)]" />
        <div className="h-1 w-full rounded-xs bg-zinc-900/25 dark:bg-white/25" />
        <div className="h-1 w-4/5 rounded-xs bg-zinc-900/15 dark:bg-white/15" />
      </div>

      {/* 5. Footer Bar */}
      <div className="relative z-10 flex items-center justify-between border-t border-zinc-900/10 pt-1.5 dark:border-white/10">
        <div className="h-1 w-10 rounded-full bg-zinc-900/20 dark:bg-white/20" />
        <div className="size-2 rounded-full bg-sky-500/75 shadow-[0_0_6px_rgba(14,165,233,0.45)] dark:bg-sky-400/70 dark:shadow-[0_0_6px_rgba(56,189,248,0.6)]" />
      </div>
    </div>
  )
}
