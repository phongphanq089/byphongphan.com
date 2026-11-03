import { Eye, X } from "lucide-react"

export function DisclosureSchematic() {
  return (
    <div className="relative flex h-32 w-full max-w-[240px] items-center justify-center select-none">
      {/* Background canvas simulating underlying page */}
      <div className="absolute inset-x-4 inset-y-3 flex flex-col gap-1.5 rounded-lg border border-border/40 bg-card/40 p-2 opacity-50 blur-[0.5px]">
        <div className="h-2 w-16 rounded-xs bg-muted-foreground/30" />
        <div className="h-1.5 w-full rounded-xs bg-muted/40" />
        <div className="h-1.5 w-4/5 rounded-xs bg-muted/30" />
      </div>

      {/* Dimmed backdrop overlay */}
      <div className="absolute inset-0 rounded-lg bg-black/25 backdrop-blur-[1px] dark:bg-black/50" />

      {/* Modal Dialog Card (Elevated Popover) */}
      <div className="relative z-10 flex w-44 flex-col gap-2 rounded-xl border border-primary/30 bg-card/95 p-2.5 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.3),0_0_12px_var(--pp-primary-glow)] backdrop-blur-md">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-primary" />
            <span className="font-mono text-[9px] font-semibold text-foreground">
              dialog.modal
            </span>
          </div>
          <div className="flex size-4 items-center justify-center rounded-xs text-muted-foreground/60 hover:text-foreground">
            <X className="size-2.5" />
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-24 rounded-xs bg-muted-foreground/30" />
          <div className="h-1.5 w-full rounded-xs bg-muted/50" />
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-end gap-1.5 pt-1">
          <div className="rounded px-1.5 py-0.5 font-mono text-[8px] text-muted-foreground">
            close()
          </div>
          <div className="rounded bg-primary px-2 py-0.5 font-mono text-[8px] font-medium text-primary-foreground shadow-xs">
            open
          </div>
        </div>
      </div>

      {/* Floating State Badge */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1 rounded-full border border-emerald-500/40 bg-background/95 px-2 py-0.5 shadow-sm">
        <Eye className="size-2.5 text-emerald-500" />
        <span className="font-mono text-[9px] font-semibold text-emerald-500">
          isOpen: true
        </span>
      </div>
    </div>
  )
}

export default DisclosureSchematic
