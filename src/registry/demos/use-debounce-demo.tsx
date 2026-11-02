import { Search } from "lucide-react"
import { useState } from "react"

import { useDebounce } from "@/registry/hooks/use-debounce"
import { Badge } from "@/registry/ui/badge"

export function UseDebounceDemo() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)
  const isWaiting = query !== debouncedQuery

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 p-6">
      <div className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Debounced Value (500ms)
        </span>
        <Badge
          variant="outline"
          className={
            isWaiting
              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
              : "border-blue-500/30 bg-blue-500/10 text-blue-400"
          }
        >
          {isWaiting ? "Debouncing..." : "Settled"}
        </Badge>
      </div>

      <div className="relative w-full">
        <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type rapidly to test debounce..."
          className="w-full rounded-xl border border-white/10 bg-[#0B0F17] py-2.5 pr-4 pl-10 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="grid w-full grid-cols-2 gap-3 font-mono text-xs">
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
          <span className="text-[10px] text-muted-foreground uppercase">
            Immediate Input
          </span>
          <p className="mt-1 truncate font-bold text-foreground">
            {query || "<empty>"}
          </p>
        </div>
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
          <span className="text-[10px] text-blue-400 uppercase">
            Debounced Result
          </span>
          <p className="mt-1 truncate font-bold text-blue-400">
            {debouncedQuery || "<empty>"}
          </p>
        </div>
      </div>
    </div>
  )
}
