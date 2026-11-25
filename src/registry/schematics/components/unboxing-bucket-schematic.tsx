export function UnboxingBucketSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col items-center justify-between overflow-hidden rounded-xl border border-white/10 bg-muted/60 p-3 select-none dark:bg-neutral-950/80">
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-xl" />

      {/* Floating item header */}
      <div className="relative z-10 flex items-center gap-2 rounded-md border border-white/20 bg-neutral-900/60 px-2.5 py-1 shadow-md backdrop-blur-md">
        <div className="size-2 rounded-full bg-primary" />
        <div className="flex flex-col gap-0.5">
          <div className="h-1.5 w-14 rounded-full bg-white/85" />
          <div className="h-1 w-9 rounded-full bg-white/40" />
        </div>
      </div>

      {/* 3D Isometric Bucket graphic */}
      <svg
        width="110"
        height="60"
        viewBox="0 0 120 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-0"
      >
        <path
          d="M60 5L105 25L60 45L15 25L60 5Z"
          className="fill-white/15 stroke-white/30"
          strokeWidth="1"
        />
        <path
          d="M15 25L60 45V65L15 45V25Z"
          className="fill-primary/20 stroke-primary/40"
          strokeWidth="1"
        />
        <path
          d="M105 25L60 45V65L105 45V25Z"
          className="fill-white/10 stroke-white/20"
          strokeWidth="1"
        />
      </svg>

      {/* Footer */}
      <div className="relative z-10 flex w-full items-center justify-between border-t border-white/10 pt-1 font-mono text-[9px] text-muted-foreground/60">
        <span>Isometric</span>
        <span className="font-medium text-primary">Unboxed</span>
      </div>
    </div>
  )
}
