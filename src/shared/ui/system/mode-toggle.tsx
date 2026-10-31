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
    // Play tactile acoustic feedback
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

  // Hook up global keyboard shortcut 'D'
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
            "relative flex size-6 shrink-0 items-center justify-center rounded-full border border-border/80 bg-black text-white shadow-xs select-none",
            "transition-transform duration-200 ease-out will-change-transform hover:scale-105 active:scale-90",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none",
            className
          )}
        >
          {/*
            GPU Hardware-accelerated CSS transforms.
            Runs on the compositor thread so it never drops frames or freezes even during heavy React re-renders.
          */}
          <svg
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none size-full overflow-visible"
            aria-hidden="true"
          >
            <g
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
              style={{
                transform: isDark ? "rotate(-180deg)" : "rotate(0deg)",
                transformOrigin: "120px 120px",
              }}
            >
              <path
                d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
                fill="white"
              />
              <path
                d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
                fill="black"
              />
            </g>
            <path
              className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
              style={{
                transform: isDark ? "rotate(180deg)" : "rotate(0deg)",
                transformOrigin: "120px 120px",
              }}
              d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
              fill="white"
            />
          </svg>
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
