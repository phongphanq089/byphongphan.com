import { MousePointer, Sparkles } from "lucide-react"
import { useState } from "react"

import { useClickOutside } from "@/registry/hooks/use-click-outside"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { cn } from "@/shared/lib/utils"

export function UseClickOutsideDemo() {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedOption, setSelectedOption] = useState<number | null>(0)
  const [outsideCount, setOutsideCount] = useState(0)

  const menuRef = useClickOutside<HTMLDivElement>(() => {
    setOutsideCount((c) => c + 1)
  })

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 p-6">
      <div className="flex w-full items-center justify-between">
        <Badge variant="outline" className="gap-1.5 font-mono text-xs">
          <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
          Outside Clicks: {outsideCount}
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsOpen((prev) => !prev)
            setOutsideCount(0)
          }}
          className="h-7 gap-1 text-xs"
        >
          <Sparkles className="size-3" />
          {isOpen ? "Close Menu" : "Open Menu"}
        </Button>
      </div>

      <div className="relative flex min-h-[180px] w-full items-center justify-between rounded-xl border border-white/10 bg-[#0B0F17]/90 p-6 shadow-inner">
        {/* Target Menu container */}
        <div
          ref={menuRef}
          className={cn(
            "relative z-10 w-36 rounded-lg border border-white/10 bg-[#121622] p-2 shadow-2xl transition-all duration-300",
            isOpen
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-40"
          )}
        >
          <div className="mb-1.5 border-b border-white/5 px-1 pb-1">
            <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Target Element
            </span>
          </div>
          {(["Profile Settings", "Billing & Plan", "Sign Out"] as const).map(
            (opt, idx) => {
              const isSelected = selectedOption === idx
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedOption(idx)}
                  className={cn(
                    "flex w-full items-center rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-blue-600 font-semibold text-white"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {opt}
                </button>
              )
            }
          )}
        </div>

        {/* Outside click simulation zone */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex size-20 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/5">
            <div className="absolute size-10 rounded-full border border-blue-500/40 bg-blue-500/10" />
            <div className="size-3 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" />
            <MousePointer className="absolute right-2 bottom-1 size-4 text-white drop-shadow" />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            Click anywhere outside
          </span>
        </div>
      </div>
    </div>
  )
}
