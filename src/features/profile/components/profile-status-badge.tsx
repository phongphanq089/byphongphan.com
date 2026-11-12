/** Subtle "under development" notice shown at the top of the profile body. */
export function ProfileStatusBadge() {
  return (
    <p className="flex w-fit max-w-full items-center gap-2.5 rounded-sm border border-amber-500/25 bg-amber-500/8 py-1 pr-3.5 pl-3 font-mono text-[9px] leading-snug tracking-[0.18em] text-amber-700 uppercase sm:text-[10px] dark:text-amber-400/90">
      <span className="relative flex size-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
      </span>
      Portfolio upgrade in progress
    </p>
  )
}
