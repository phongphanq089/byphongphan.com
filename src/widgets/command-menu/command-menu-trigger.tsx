import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui"
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
      onClick={openCommandMenu}
      aria-label="Open command palette"
      className={cn(
        "group relative flex items-center gap-2 rounded-sm border border-border/70 bg-background/40 px-2.5 py-1.5 text-xs text-muted-foreground shadow-xs backdrop-blur-xs transition-all hover:border-foreground/30 hover:bg-accent/60 hover:text-foreground",
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
