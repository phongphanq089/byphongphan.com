export function MiddleTruncationSchematic() {
  return (
    <div className="flex w-full max-w-[210px] flex-col gap-2 rounded-xl border border-white/15 bg-neutral-900/80 p-3 shadow-lg backdrop-blur-xs select-none">
      {/* File pill with middle truncation badge */}
      <div className="flex items-center justify-between gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 font-mono text-[11px]">
        <span className="truncate text-white/80">long_file</span>
        <span className="rounded bg-white/15 px-1 py-0.5 text-[9px] font-semibold text-white/90">
          ...
        </span>
        <span className="shrink-0 text-white/60">.tsx</span>
      </div>

      {/* Hash / Address representation */}
      <div className="flex items-center justify-between gap-1 rounded-md border border-white/5 bg-white/[0.02] px-2 py-1 font-mono text-[10px]">
        <span className="text-white/50">0x71C...</span>
        <span className="text-white/40">b947</span>
      </div>

      {/* Bounding / width dimension markers */}
      <div className="flex items-center justify-between px-1 pt-0.5">
        <span className="h-1 w-6 rounded-full bg-white/20" />
        <span className="h-0.5 w-12 border-t border-dashed border-white/20" />
        <span className="h-1 w-4 rounded-full bg-white/20" />
      </div>
    </div>
  )
}
