import { MousePointer } from "lucide-react"
import { useState } from "react"

import { useClickOutside } from "@/shared/hooks/use-click-outside"
import { cn } from "@/shared/lib/utils"

export function ClickOutsidePreview() {
  const [selectedOption, setSelectedOption] = useState<number | null>(1)
  const [rippleKey, setRippleKey] = useState(0)

  const menuRef = useClickOutside<HTMLDivElement>(() => {
    setRippleKey((prev) => prev + 1)
  })

  return (
    <div
      className="relative flex h-full w-full items-center justify-between px-6 py-4 select-none"
      onClick={(e) => {
        // Fallback for click outside container
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setRippleKey((prev) => prev + 1)
        }
      }}
    >
      {/* Menu on left */}
      <div
        ref={menuRef}
        onClick={(e) => {
          e.stopPropagation()
        }}
        className="relative z-10 w-28 scale-100 rounded-lg border border-white/10 bg-[#0d121c]/90 p-1.5 opacity-100 shadow-xl backdrop-blur-md transition-all duration-300"
      >
        {(["Option 1", "Option 2", "Option 3"] as const).map((opt, idx) => {
          const isSelected = selectedOption === idx
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setSelectedOption(idx)}
              className={cn(
                "flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-[11px] font-medium transition-colors",
                isSelected
                  ? "bg-white/10 font-semibold text-white"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Target indicator on right with concentric ripple waves and cursor */}
      <div className="relative flex size-20 items-center justify-center">
        {/* Concentric rings */}
        <div
          key={rippleKey}
          className="absolute inset-0 animate-ping rounded-full border border-blue-500/20 opacity-75"
          style={{ animationDuration: "2s" }}
        />
        <div className="absolute size-14 rounded-full border border-blue-500/30 bg-blue-500/5 transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute size-8 rounded-full border border-blue-500/50 bg-blue-500/10" />
        <div className="relative z-10 size-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />

        {/* Cursor pointer icon */}
        <div className="pointer-events-none absolute right-2 bottom-1 z-20 text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <MousePointer className="size-4.5 fill-white text-black drop-shadow-md" />
        </div>
      </div>
    </div>
  )
}
