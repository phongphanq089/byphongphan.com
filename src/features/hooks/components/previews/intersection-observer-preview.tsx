import { useState } from "react"

import { cn } from "@/shared/lib/utils"

export function IntersectionObserverPreview() {
  const [activeIdx, setActiveIdx] = useState(1)

  return (
    <div className="flex h-full w-full items-center justify-center p-3 select-none">
      <div className="relative flex w-full max-w-[240px] flex-col gap-1.5 py-1">
        {[0, 1, 2].map((idx) => {
          const isIntersecting = activeIdx === idx
          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={(e) => {
                e.stopPropagation()
                setActiveIdx(idx)
              }}
              className={cn(
                "group relative flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition-all duration-300",
                isIntersecting
                  ? "z-10 scale-[1.02] border-blue-500 bg-blue-500/10 shadow-[0_0_18px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/40"
                  : "scale-95 border-white/5 bg-white/[0.02] opacity-40 hover:opacity-70"
              )}
            >
              {/* Box indicator on left */}
              <div
                className={cn(
                  "size-5.5 shrink-0 rounded transition-all",
                  isIntersecting
                    ? "bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                    : "bg-white/10"
                )}
              />

              {/* Skeleton lines */}
              <div className="flex flex-1 flex-col gap-1.5">
                <div
                  className={cn(
                    "h-2 rounded transition-colors",
                    isIntersecting
                      ? "w-3/4 bg-blue-400/80"
                      : "w-2/3 bg-white/10"
                  )}
                />
                <div
                  className={cn(
                    "h-1.5 rounded transition-colors",
                    isIntersecting ? "w-1/2 bg-blue-400/40" : "w-1/3 bg-white/5"
                  )}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
