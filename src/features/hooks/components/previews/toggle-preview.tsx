import { useState } from "react"

import { cn } from "@/shared/lib/utils"

export function TogglePreview() {
  const [isOn, setIsOn] = useState(true)

  return (
    <div className="flex h-full w-full items-center justify-center gap-4 px-6 select-none">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setIsOn((prev) => !prev)
        }}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300",
          isOn
            ? "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]"
            : "border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10"
        )}
      >
        <span
          className={cn(
            "size-2 rounded-full transition-colors",
            isOn
              ? "bg-blue-400 shadow-[0_0_8px_#60a5fa]"
              : "bg-muted-foreground/40"
          )}
        />
        <span>State: {isOn ? "TRUE" : "FALSE"}</span>
      </button>

      <span className="font-mono text-[11px] text-muted-foreground/70">
        toggle()
      </span>
    </div>
  )
}
