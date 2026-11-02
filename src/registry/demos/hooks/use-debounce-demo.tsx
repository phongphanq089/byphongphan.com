import { Search } from "lucide-react"
import { useState } from "react"

import { useDebounce } from "@/registry/hooks/use-debounce"
import { cn } from "@/shared/lib/utils"

export function UseDebounceDemo() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)
  const isWaiting = query !== debouncedQuery

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 p-3 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-muted-foreground">
          Debounce · 500ms
        </span>

        <span
          className="flex items-center gap-1.5 text-xs text-muted-foreground"
          aria-live="polite"
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              isWaiting ? "animate-pulse bg-primary" : "bg-muted-foreground/40"
            )}
          />
          {isWaiting ? "Waiting..." : "Up to date"}
        </span>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type something..."
          aria-label="Test debounce input"
          className="h-10 w-full rounded-sm border border-border bg-background pr-3 pl-9 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className="min-w-0 rounded-sm border border-border bg-muted/20 p-3">
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Immediate
          </span>

          <p className="mt-2 truncate font-mono text-xs text-foreground">
            {query || "—"}
          </p>
        </div>

        <div
          className={cn(
            "min-w-0 rounded-sm border p-3 transition-colors duration-200",
            isWaiting
              ? "border-primary/30 bg-primary/[0.04]"
              : "border-primary/40 bg-primary/[0.07]"
          )}
        >
          <span className="text-[10px] font-medium tracking-wide text-primary uppercase">
            Debounced
          </span>

          <p className="mt-2 truncate font-mono text-xs text-foreground">
            {debouncedQuery || "—"}
          </p>
        </div>
      </div>

      {/* Helper */}
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        The debounced value updates 500ms after you stop typing.
      </p>
    </div>
  )
}

export default UseDebounceDemo
