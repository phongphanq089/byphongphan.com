export function CardSchematic() {
  return (
    <div className="flex w-full max-w-[410px] flex-col rounded-md border border-white/15 bg-neutral-900/40 p-3.5 shadow-lg backdrop-blur-xs select-none dark:bg-neutral-900/80">
      <div className="flex flex-col gap-1.5">
        <div className="h-2.5 w-24 rounded bg-white/85" />
        <div className="h-1.5 w-36 rounded bg-white/40" />
      </div>

      <div className="my-2.5 flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
        <div className="flex items-center justify-between">
          <div className="h-2 w-16 rounded bg-white/50" />
          <div className="h-2 w-10 rounded bg-white/30" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-2 w-12 rounded bg-white/50" />
          <div className="h-3 w-6 rounded bg-white/20" />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-1.5 pt-0.5">
        <div className="h-5 w-12 rounded border border-white/10 bg-white/[0.04]" />
        <div className="h-5 w-14 rounded bg-white shadow-xs" />
      </div>
    </div>
  )
}
