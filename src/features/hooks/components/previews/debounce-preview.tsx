import { useState } from "react"

import { useDebounce } from "@/shared/hooks/use-debounce"
import { cn } from "@/shared/lib/utils"

export function DebouncePreview() {
  const [inputVal, setInputVal] = useState("")
  const debouncedVal = useDebounce(inputVal, 600)
  const isPending = inputVal !== debouncedVal

  return (
    <div className="flex h-full w-full items-center justify-between gap-3 px-5 select-none">
      {/* Search Input Box */}
      <div className="relative flex flex-1 items-center">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder="Search..."
          className="w-full rounded-lg border border-white/10 bg-[#0d121c]/80 py-2 pr-2 pl-3 text-xs text-foreground transition-all placeholder:text-muted-foreground/60 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 focus:outline-none"
        />
        {inputVal && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setInputVal("")
            }}
            className="absolute right-2 text-[10px] text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </div>

      {/* 4 Debounce indicator dots */}
      <div className="flex shrink-0 items-center gap-1.5">
        {[0, 1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={cn(
              "size-2 rounded-full transition-all duration-300",
              isPending
                ? "animate-pulse bg-blue-400 shadow-[0_0_8px_#60a5fa]"
                : dot === 0
                  ? "bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                  : "bg-white/10"
            )}
            style={isPending ? { animationDelay: `${dot * 150}ms` } : undefined}
          />
        ))}
      </div>
    </div>
  )
}
