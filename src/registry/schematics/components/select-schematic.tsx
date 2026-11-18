import { Check, ChevronDown } from "lucide-react"

export function SelectSchematic() {
  return (
    <div className="flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-muted/60 p-2.5 select-none dark:bg-neutral-950/80">
      {/* Trigger Bar */}
      <div className="flex h-6 w-full items-center justify-between rounded-md border border-white/15 bg-white/[0.04] px-2 shadow-xs">
        <div className="h-1.5 w-16 rounded-full bg-white/80" />
        <ChevronDown className="size-2.5 text-white/50" />
      </div>

      {/* Dropdown Menu Items */}
      <div className="flex flex-col gap-1 rounded-md border border-white/15 bg-neutral-900/60 p-1 shadow-md backdrop-blur-md">
        {/* Selected Item */}
        <div className="flex items-center justify-between rounded bg-white/10 px-2 py-1">
          <div className="h-1.5 w-14 rounded-full bg-white" />
          <Check className="size-2.5 text-primary" />
        </div>

        {/* Item 2 */}
        <div className="flex items-center justify-between rounded px-2 py-0.5">
          <div className="h-1.5 w-12 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[8px] text-muted-foreground/60">
        <span>Controlled</span>
        <span className="font-medium text-primary">Selected</span>
      </div>
    </div>
  )
}
