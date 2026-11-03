export function LocalStorageSchematic() {
  return (
    <div className="flex h-32 w-full max-w-[260px] items-center justify-center gap-4 select-none">
      {/* Active Toggle */}
      <div className="flex h-6 w-11 items-center rounded-full border border-primary/40 bg-primary p-0.5">
        <div className="size-5 translate-x-5 rounded-full bg-background shadow-sm" />
      </div>

      {/* Storage Status */}
      <div className="inline-flex items-center gap-1.5 rounded-sm border border-primary/30 bg-primary/5 px-3 py-1.5 font-mono text-[10px] font-medium text-primary">
        <span className="size-1.5 rounded-full bg-primary" />
        Saved
      </div>
    </div>
  )
}

export default LocalStorageSchematic
