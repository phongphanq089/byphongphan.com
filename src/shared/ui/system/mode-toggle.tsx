import { play } from "cuelume"
import * as React from "react"

import { useKeyboardShortcuts } from "@/shared/hooks/use-keyboard-shortcuts"
import { cn } from "@/shared/lib/utils"
import { useTheme } from "@/shared/providers/theme-provider"
import { Kbd, Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/core"

export interface ModeToggleProps {
  className?: string
  enableShortcut?: boolean
}

export function ModeToggle({
  className = "",
  enableShortcut = true,
}: ModeToggleProps) {
  const { setTheme, isDark, resolvedTheme } = useTheme()

  const handleToggle = React.useCallback(() => {
    try {
      play("toggle", {
        direction: isDark ? "back" : "forward",
        emphasis: "subtle",
      })
    } catch {
      // Audio cue fallback
    }

    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
  }, [isDark, resolvedTheme, setTheme])

  useKeyboardShortcuts("d", handleToggle, {
    enabled: enableShortcut,
    enableOnFormTags: false,
    preventDefault: true,
  })

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleToggle}
          aria-label={
            isDark
              ? "Switch to light mode (Press D)"
              : "Switch to dark mode (Press D)"
          }
          className={cn(
            "group relative flex size-9 shrink-0 items-center justify-center",
            "rounded-lg",
            "bg-muted text-foreground shadow-xs select-none hover:bg-muted/80",
            "transition-all duration-200 ease-out",
            "hover:scale-105 hover:border-foreground/20 active:scale-95",
            "focus-visible:ring-2 focus-visible:ring-ring",
            "focus-visible:ring-offset-1 focus-visible:outline-none",
            className
          )}
        >
          <div className="relative size-4.5">
            {/* SUN ICON (Light Mode) */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 size-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
                isDark
                  ? "scale-50 -rotate-90 opacity-0"
                  : "scale-100 rotate-0 opacity-100"
              )}
            >
              <circle cx="12" cy="12" r="4" className="fill-current/15" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>

            {/* MOON & STARS ICON (Dark Mode) */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 size-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
                isDark
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-50 rotate-90 opacity-0"
              )}
            >
              <path
                d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
                className="fill-current/15"
              />
              <path
                d="M19 3v4M17 5h4"
                strokeWidth="1.75"
                className={cn(
                  "origin-center transition-transform delay-100 duration-500",
                  isDark ? "scale-100" : "scale-0"
                )}
              />
            </svg>
          </div>
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        sideOffset={6}
        className="flex items-center gap-1.5 text-xs font-medium"
      >
        <span>Toggle Mode</span>
        <Kbd>D</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
