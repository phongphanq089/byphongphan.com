import { MousePointer2, MousePointerClick, RotateCcw } from "lucide-react"
import { useState } from "react"

import { useClickOutside } from "@/registry/hooks/use-click-outside"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { cn } from "@/shared/lib/utils"

const options = ["Profile Settings", "Billing & Plan", "Sign Out"] as const

export function UseClickOutsideDemo() {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedOption, setSelectedOption] = useState<number | null>(0)
  const [outsideCount, setOutsideCount] = useState(0)

  const menuRef = useClickOutside<HTMLDivElement>(() => {
    setOutsideCount((c) => c + 1)
  })

  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
    setOutsideCount(0)
  }

  return (
    <div className="w-full min-w-0 p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-3 sm:gap-4">
        {/* Toolbar */}
        <div className="flex min-w-0 items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="h-7 gap-1.5 rounded-md px-2 font-mono text-[11px] sm:text-xs"
          >
            <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--pp-primary-glow)]" />
            Outside clicks
            <span className="font-bold text-foreground tabular-nums">
              {outsideCount}
            </span>
          </Badge>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-[11px] sm:text-xs"
              onClick={() => {
                setOutsideCount(0)
                setSelectedOption(0)
                setIsOpen(true)
              }}
            >
              <RotateCcw className="size-3" />
              Reset
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-[11px] sm:text-xs"
              onClick={toggleMenu}
            >
              {isOpen ? "Close menu" : "Open menu"}
            </Button>
          </div>
        </div>

        {/* Demo area */}
        <div className="relative flex min-h-[156px] items-center justify-between gap-3 overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-3 sm:min-h-[190px] sm:gap-5 sm:p-5">
          {/* Target menu */}
          <div
            ref={menuRef}
            className={cn(
              "relative z-10 w-[145px] shrink-0 rounded-lg border border-border/80 bg-card p-2 shadow-md transition-all duration-200 sm:w-40",
              isOpen
                ? "scale-100 opacity-100"
                : "pointer-events-none scale-95 opacity-40"
            )}
          >
            <div className="mb-1.5 flex items-center justify-between border-b border-border/60 px-1 pb-2">
              <span className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase sm:text-[10px]">
                Target element
              </span>
              <span className="size-1.5 rounded-full bg-primary" />
            </div>

            <div className="space-y-0.5">
              {options.map((opt, idx) => {
                const isSelected = selectedOption === idx

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={!isOpen}
                    onClick={() => setSelectedOption(idx)}
                    className={cn(
                      "flex min-h-8 w-full items-center rounded-md px-2 text-left text-[10px] transition-colors sm:text-xs",
                      isSelected
                        ? "bg-primary font-medium text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Outside click zone */}
          <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2">
            <div className="relative flex size-14 shrink-0 items-center justify-center rounded-full border border-dashed border-primary/30 bg-primary/[0.04] sm:size-[76px]">
              <div className="absolute size-8 rounded-full border border-primary/30 bg-primary/10 sm:size-10" />
              <div className="size-2.5 rounded-full bg-primary shadow-[0_0_12px_var(--pp-primary-glow)] sm:size-3" />
              <MousePointer2 className="absolute right-0 -bottom-0.5 size-4 fill-foreground text-background sm:size-[18px]" />
            </div>

            <div className="flex flex-col items-center gap-0.5 text-center">
              <span className="text-[10px] font-medium text-foreground sm:text-xs">
                Outside area
              </span>
              <span className="text-[9px] text-muted-foreground sm:text-[10px]">
                Click outside menu
              </span>
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-2 px-1">
          <MousePointerClick className="size-3.5 shrink-0 text-muted-foreground" />
          <p className="text-[10px] leading-relaxed text-muted-foreground sm:text-xs">
            Click outside the target element to trigger the callback.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UseClickOutsideDemo
