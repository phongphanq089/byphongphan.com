import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/core/button"
import { Kbd } from "@/shared/ui/core/kbd"

import { openCommandMenu } from "./use-command-menu"

interface CommandMenuTriggerProps {
  className?: string
  compact?: boolean
}

export function CommandMenuTrigger({
  className,
  compact = false,
}: CommandMenuTriggerProps) {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsMac(navigator.userAgent.toUpperCase().includes("MAC"))
    }
  }, [])

  return (
    <Button
      type="button"
      size="lg"
      onClick={openCommandMenu}
      aria-label="Open command palette"
      className={cn(
        "group relative flex h-9 shrink-0 items-center gap-2 rounded-lg border-0 bg-muted px-3.5 py-0 text-xs font-medium text-muted-foreground shadow-none transition-colors duration-200 hover:bg-foreground/10 hover:text-foreground dark:hover:bg-white/10",
        className
      )}
    >
      <SearchIcon className="size-3.5 shrink-0 text-muted-foreground/80 transition-colors group-hover:text-foreground" />

      {!compact && (
        <span className="hidden text-xs text-muted-foreground/80 group-hover:text-foreground xl:inline">
          Search commands...
        </span>
      )}

      <div className="flex items-center gap-1">
        <Kbd className="h-4.5 min-w-4.5 px-1 text-[10px] font-medium text-muted-foreground/80 shadow-2xs group-hover:text-foreground">
          {isMac ? "⌘" : "Ctrl"}
        </Kbd>
        <Kbd className="h-4.5 min-w-4.5 px-1 text-[10px] font-medium text-muted-foreground/80 shadow-2xs group-hover:text-foreground">
          K
        </Kbd>
      </div>
    </Button>
  )
}
