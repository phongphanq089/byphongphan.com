export function SlideToUnlockSchematic() {
  return (
    <div className="group relative flex h-34 w-54 items-center justify-center overflow-hidden rounded-xl border border-zinc-900/10 bg-zinc-900/[0.02] p-3 shadow-inner select-none dark:border-white/10 dark:bg-white/[0.03]">
      {/* Ambient background hint */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(80px circle at center, rgba(255, 255, 255, 0.12), transparent 75%)",
        }}
      />

      {/* iOS Pill Track */}
      <div className="relative flex h-9 w-44 items-center justify-between rounded-[12px] border border-zinc-900/15 bg-zinc-900/10 p-1 shadow-inner backdrop-blur-xs transition-colors group-hover:border-zinc-900/25 dark:border-white/15 dark:bg-white/10 dark:group-hover:border-white/25">
        {/* Shimmering Text Line Mockup (Centered in available opening) */}
        <div className="absolute inset-y-0 right-1 left-11 flex items-center justify-center">
          <div className="h-1.5 w-18 rounded-full bg-gradient-to-r from-zinc-900/30 via-zinc-900/70 to-zinc-900/30 transition-opacity group-hover:opacity-60 dark:from-white/20 dark:via-white/70 dark:to-white/20" />
        </div>

        {/* Squircle White Thumb */}
        <div className="relative z-10 flex h-7 w-9 items-center justify-center rounded-[8px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out group-hover:translate-x-12">
          {/* Block Arrow Icon */}
          <div className="flex items-center">
            <div className="h-1.5 w-2.5 rounded-xs bg-zinc-600" />
            <div className="size-0 border-y-[3.5px] border-l-[4px] border-y-transparent border-l-zinc-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
