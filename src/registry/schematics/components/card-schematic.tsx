export function CardSchematic() {
  return (
    <div className="flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-neutral-900/40 p-3 shadow-inner backdrop-blur-xs select-none dark:bg-neutral-900/80">
      <div className="flex flex-col gap-1">
        <div className="h-2 w-20 rounded bg-white/85" />
        <div className="h-1.5 w-32 rounded bg-white/40" />
      </div>

      <div className="flex flex-col gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-2">
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-16 rounded bg-white/50" />
          <div className="h-1.5 w-8 rounded bg-white/30" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-12 rounded bg-white/50" />
          <div className="h-2 w-6 rounded bg-primary/40" />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-1.5 border-t border-white/10 pt-1">
        <div className="h-4 w-10 rounded border border-white/10 bg-white/[0.04]" />
        <div className="h-4 w-12 rounded bg-white shadow-xs" />
      </div>
    </div>
  )
}
