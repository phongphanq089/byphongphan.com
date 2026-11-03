import { MousePointer2, ArrowUp } from "lucide-react"

export function PageLeaveSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center overflow-hidden rounded-xl select-none">
      {/* Viewport */}
      <div className="relative flex h-[76px] w-[172px] flex-col overflow-hidden rounded-lg border border-border bg-background">
        {/* Browser header */}
        <div className="flex h-5 items-center gap-1.5 border-b border-border px-2">
          <span className="size-1.5 rounded-full bg-muted-foreground/30" />
          <span className="size-1.5 rounded-full bg-muted-foreground/30" />
          <span className="size-1.5 rounded-full bg-muted-foreground/30" />
          <div className="ml-2 h-2 w-16 rounded-full bg-muted/60" />
        </div>

        {/* Page content */}
        <div className="flex flex-1 items-center justify-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary/10"></div>
          <div className="space-y-1">
            <div className="h-1.5 w-16 rounded-full bg-foreground/15" />
            <div className="h-1 w-10 rounded-full bg-muted-foreground/20" />
          </div>
        </div>

        {/* Top exit boundary */}
        <div className="absolute inset-x-0 top-0 border-t border-dashed border-primary/60" />
      </div>

      {/* Cursor leaving viewport */}
      <div className="absolute top-1.5 left-[calc(50%+54px)] flex flex-col items-center gap-0.5">
        <ArrowUp className="size-3 text-primary" />
        <MousePointer2 className="size-4 -rotate-12 fill-primary/10 text-primary" />
      </div>

      {/* Detection indicator */}
      <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 rounded-md border border-primary/20 bg-background px-2 py-1">
        <span className="size-1.5 animate-pulse rounded-full bg-primary" />
        <span className="font-mono text-[9px] text-primary">EXIT INTENT</span>
      </div>
    </div>
  )
}

export default PageLeaveSchematic
