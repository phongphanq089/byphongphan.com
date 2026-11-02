import { useState } from "react"

import { cn } from "@/shared/lib/utils"

export function LocalStoragePreview() {
  const [enabled, setEnabled] = useState(true)
  const [pulse, setPulse] = useState(0)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEnabled((prev) => !prev)
    setPulse((p) => p + 1)
  }

  return (
    <div className="flex h-full w-full items-center justify-center gap-6 px-6 select-none">
      {/* Switch toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={handleToggle}
        className={cn(
          "relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none",
          enabled
            ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            : "bg-white/10 hover:bg-white/15"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out",
            enabled ? "translate-x-6" : "translate-x-0"
          )}
        />
      </button>

      {/* Synced badge */}
      <div
        key={pulse}
        className={cn(
          "flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)] transition-all duration-300",
          pulse > 0 ? "scale-105" : "scale-100"
        )}
      >
        <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
        <span>Synced</span>
      </div>
    </div>
  )
}
