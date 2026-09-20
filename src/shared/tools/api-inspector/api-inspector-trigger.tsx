import { RefreshCw, Terminal } from "lucide-react"
import React, { useMemo } from "react"

import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/core/badge"
import { Button } from "@/shared/ui/core/button"
import { Kbd } from "@/shared/ui/core/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core/tooltip"

import { useApiInspector } from "./api-inspector-context"
import type { ApiEntry } from "./types"

/**
 * Global Floating Dev Tool Button
 * Shows a sleek developer HUD pill with count of logged APIs, active loading pulse,
 * and quick-opens the inspector drawer.
 */
export function DevApiInspectorFloatingTrigger({
  className,
}: {
  className?: string
}) {
  const { entries, isOpen, setIsOpen } = useApiInspector()

  const isAnyLoading = useMemo(() => {
    return entries.some((e) => e.isLoading)
  }, [entries])

  // Only render if there's window / browser
  if (typeof window === "undefined") return null

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle theme mode"
          className={cn(
            "flex size-9 min-w-[50px] items-center justify-center rounded-sm transition-all duration-200 active:scale-95",
            className,
            isOpen
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          )}
        >
          {isAnyLoading ? (
            <RefreshCw className="size-3.5 animate-spin" />
          ) : (
            <Terminal className="size-4.5 shrink-0 text-pp-primary" />
          )}

          {entries.length > 0 && (
            <Badge
              variant="secondary"
              className="h-4.5 min-w-4.5 px-1 text-[10px] font-bold"
            >
              {entries.length}
            </Badge>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className="flex items-center gap-1.5 text-xs"
      >
        <span>Toggle API Inspector</span>
        <Kbd>Ctrl + Shift + A</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Local Inline Trigger Component
 * Drop this onto any card, table row, or button to immediately inspect or re-trigger a response in the drawer.
 * Supports passing either an existing `entry` or a `fetcher` function!
 */
export interface ApiInspectorTriggerProps extends React.ComponentProps<
  typeof Button
> {
  entry?: Omit<ApiEntry, "id"> & { id?: string }
  fetcher?: () => Promise<unknown> | unknown
  title?: string
  endpoint?: string
  children?: React.ReactNode
}

export function ApiInspectorTrigger({
  entry,
  fetcher,
  title = "API Response",
  endpoint,
  children,
  className,
  ...props
}: ApiInspectorTriggerProps) {
  const { inspect, register, setIsOpen } = useApiInspector()

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (fetcher) {
      await register({
        title,
        endpoint: endpoint || title,
        fetcher,
        autoExecute: true,
      })
      setIsOpen(true)
    } else if (entry) {
      inspect(entry)
      setIsOpen(true)
    }

    props.onClick?.(e)
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="xs"
      onClick={handleClick}
      className={cn(
        "h-6 gap-1.5 border-border/70 bg-card/60 text-xs text-muted-foreground shadow-2xs transition-colors hover:border-border hover:bg-accent hover:text-foreground",
        className
      )}
      {...props}
    >
      <Terminal className="size-3 text-primary" />
      <span className="whitespace-nowrap">{children || "Inspect API "}</span>
    </Button>
  )
}
