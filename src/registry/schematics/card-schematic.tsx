export function CardSchematic() {
  return (
    <div className="flex w-full max-w-[210px] flex-col rounded-xl border border-white/15 bg-neutral-900/80 p-3.5 shadow-lg backdrop-blur-xs select-none">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="h-2.5 w-24 rounded-full bg-white/85" />
        <div className="h-1.5 w-36 rounded-full bg-white/40" />
      </div>

      {/* Content Preview */}
      <div className="my-2.5 flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
        <div className="flex items-center justify-between">
          <div className="h-2 w-16 rounded-full bg-white/50" />
          <div className="h-2 w-10 rounded-full bg-white/30" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-2 w-12 rounded-full bg-white/50" />
          <div className="h-3 w-6 rounded-full bg-white/20" />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-1.5 pt-0.5">
        <div className="h-5 w-12 rounded-md border border-white/10 bg-white/[0.04]" />
        <div className="h-5 w-14 rounded-md bg-white shadow-xs" />
      </div>
    </div>
  )
}
