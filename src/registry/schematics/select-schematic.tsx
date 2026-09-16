import { Check, ChevronDown } from "lucide-react"

export function SelectSchematic() {
  return (
    <div className="flex w-full max-w-[170px] flex-col gap-1.5 select-none">
      {/* Select Trigger Box */}
      <div className="flex h-8 w-full items-center justify-between rounded-md border border-white/15 bg-white/[0.04] px-2.5 shadow-xs">
        <div className="h-2 w-20 rounded-full bg-white/70" />
        <ChevronDown className="size-3 text-white/40" />
      </div>

      {/* Dropdown Menu Items */}
      <div className="flex flex-col gap-1 rounded-md border border-white/15 bg-neutral-900/95 p-1 shadow-xl backdrop-blur-md">
        {/* Selected Item */}
        <div className="flex items-center justify-between rounded bg-white/10 px-2 py-1.5">
          <div className="h-2 w-16 rounded-full bg-white/90" />
          <Check className="size-3 text-white/90" />
        </div>

        {/* Item 2 */}
        <div className="flex items-center justify-between rounded px-2 py-1.5">
          <div className="h-2 w-14 rounded-full bg-white/40" />
        </div>

        {/* Item 3 */}
        <div className="flex items-center justify-between rounded px-2 py-1.5">
          <div className="h-2 w-18 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  )
}
