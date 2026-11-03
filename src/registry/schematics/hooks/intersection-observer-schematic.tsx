export function IntersectionObserverSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center select-none">
      <div className="flex w-full flex-col gap-1.5 rounded-lg border border-border bg-card/50 p-2">
        {/* Element above */}
        <div className="flex h-5 items-center gap-2 rounded border border-border/60 bg-muted/40 px-2 opacity-50">
          <div className="size-2 rounded-sm bg-muted-foreground/40" />
          <div className="h-1.5 w-16 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Observed element */}
        <div className="flex h-8 items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-2">
          <div className="size-2.5 shrink-0 rounded-sm bg-primary" />

          <div className="flex flex-1 flex-col gap-1">
            <div className="h-1.5 w-20 rounded-full bg-foreground/70" />
            <div className="h-1 w-12 rounded-full bg-muted-foreground/40" />
          </div>

          <div className="size-1.5 shrink-0 rounded-full bg-primary" />
        </div>

        {/* Element below */}
        <div className="flex h-5 items-center gap-2 rounded border border-border/60 bg-muted/40 px-2 opacity-50">
          <div className="size-2 rounded-sm bg-muted-foreground/40" />
          <div className="h-1.5 w-14 rounded-full bg-muted-foreground/30" />
        </div>
      </div>
    </div>
  )
}

export default IntersectionObserverSchematic
