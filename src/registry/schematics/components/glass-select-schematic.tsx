import { Check, ChevronDown } from "lucide-react"

export function GlassSelectSchematic() {
  return (
    <div className="relative flex h-34 w-54 flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-muted/60 p-2.5 select-none dark:bg-neutral-950/80">
      {/* Ambient backdrop gradient for glass refraction */}
      <div className="pointer-events-none absolute -top-4 -right-4 size-20 rounded-full bg-sky-400/20 blur-xl" />
      <div className="pointer-events-none absolute -bottom-4 -left-4 size-20 rounded-full bg-violet-400/20 blur-xl" />

      {/* Liquid Glass Pill Trigger */}
      <div className="relative z-10 flex h-6 w-full items-center justify-between rounded-full border border-white/25 bg-white/10 px-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-md">
        <div className="h-1.5 w-16 rounded-full bg-white/85" />
        <ChevronDown className="size-2.5 text-white/60" />
      </div>

      {/* Frosted Liquid Popup Surface */}
      <div className="relative z-10 flex flex-col gap-1 rounded-2xl border border-white/20 bg-white/10 p-1.5 shadow-lg backdrop-blur-xl">
        <div className="flex items-center justify-between rounded-xl bg-white/15 px-2 py-1">
          <div className="h-1.5 w-14 rounded-full bg-white" />
          <Check className="size-2.5 text-primary" />
        </div>

        <div className="flex items-center justify-between rounded-xl px-2 py-0.5">
          <div className="h-1.5 w-11 rounded-full bg-white/45" />
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-1 font-mono text-[8px] text-muted-foreground/60">
        <span>Base UI</span>
        <span className="font-medium text-primary">Liquid Glass</span>
      </div>
    </div>
  )
}
