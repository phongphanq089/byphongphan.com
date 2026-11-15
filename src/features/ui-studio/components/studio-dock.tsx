import { Check, Copy, Terminal } from "lucide-react"

import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard"
import { cn } from "@/shared/lib/utils"

import type { StudioItem } from "../model/types"
import { getStudioCliCommand } from "../model/unified-registry.adapter"

interface StudioDockProps {
  item: StudioItem | null
}

/**
 * Floating install dock: live CLI command for the current selection.
 * Docked to the bottom edge of the studio stage.
 */
export function StudioDock({ item }: StudioDockProps) {
  const { copy, state } = useCopyToClipboard()
  const command = item
    ? getStudioCliCommand(item)
    : "npx shadcn@latest add @byphongphan/<item>"

  const copied = state === "done"

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center px-3">
      <div
        className={cn(
          "pointer-events-auto flex h-10 max-w-full items-center gap-2 rounded-full border border-border/70 bg-background/85 py-1.5 pr-1.5 pl-4 shadow-lg backdrop-blur-xl",
          "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
        )}
      >
        <Terminal
          className="size-4 shrink-0 text-pp-primary"
          aria-hidden="true"
        />
        <code className="max-w-56 truncate font-mono text-[10px] text-foreground sm:max-w-96 sm:text-[11px]">
          {command}
        </code>
        <button
          type="button"
          onClick={() => void copy(command)}
          aria-label={copied ? "Copied" : "Copy install command"}
          title={copied ? "Copied" : "Copy install command"}
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
          ) : (
            <Copy className="size-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}
