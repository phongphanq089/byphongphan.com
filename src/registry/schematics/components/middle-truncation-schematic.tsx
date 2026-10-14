export function MiddleTruncationSchematic() {
  return (
    <div className="flex w-full flex-col gap-2 rounded-md border border-white/15 bg-muted p-3 backdrop-blur-xs select-none dark:bg-neutral-900/80">
      {/* File pill with middle truncation badge */}
      <div className="flex items-center justify-between gap-1.5 rounded-lg border bg-white/[0.04] px-2.5 py-1.5 font-mono text-[11px] dark:border-white/10">
        <span className="truncate dark:text-white/80">long_file</span>
        <span className="rounded bg-white/15 px-1 py-0.5 text-[9px] font-semibold dark:text-white/90">
          ...
        </span>
        <span className="shrink-0 dark:text-white/60">.tsx</span>
      </div>

      {/* Hash / Address representation */}
      <div className="flex items-center justify-between gap-1 rounded-md border border-white/5 bg-white/[0.02] px-2 py-1 font-mono text-[10px]">
        <span className="dark:text-white/50">12x71Ca...</span>
        <span className="dark:text-white/40">b947</span>
      </div>

      <div className="flex items-center justify-between px-1 pt-0.5">
        <span className="h-1 w-6 rounded-full bg-black/70 dark:bg-white/20" />
        <span className="h-0.5 w-12 border-t border-dashed dark:border-white/20" />
        <span className="h-1 w-4 rounded-full bg-black dark:bg-white/20" />
      </div>
      <div className="flex items-center justify-between px-1 pt-0.5">
        <span className="h-1 w-6 rounded-full bg-black dark:bg-white/20" />
        <span className="h-0.5 w-12 border-t border-dashed dark:border-white/20" />
        <span className="h-1 w-4 rounded-full bg-black dark:bg-white/20" />
      </div>
    </div>
  )
}
