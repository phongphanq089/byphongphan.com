import { ArrowUpDown, Check, Copy, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"

import { siteConfig } from "@/shared/config"
import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard"
import { cn } from "@/shared/lib/utils"

import type { StudioItem } from "../model/types"

interface StudioDockProps {
  item: StudioItem | null
}

type PackageManager = "pnpm" | "npm" | "bun"

const PM_CYCLE: PackageManager[] = ["pnpm", "npm", "bun"]

function getCommand(pm: PackageManager, slug?: string): string {
  const target = slug
    ? `${siteConfig.url}/r/${slug}.json`
    : "https://byphongphan.com/r/<item>.json"

  switch (pm) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${target}`
    case "bun":
      return `bunx --bun shadcn@latest add ${target}`
    case "npm":
    default:
      return `npx shadcn@latest add ${target}`
  }
}

/**
 * Floating install dock: package manager switcher (pnpm / npm / bun) +
 * live CLI command for the current selection + copy button.
 * Docked to the bottom edge of the studio stage.
 */
export function StudioDock({ item }: StudioDockProps) {
  const { copy, state } = useCopyToClipboard()
  const [pm, setPm] = useState<PackageManager>("npm")
  const [muted, setMuted] = useState(true)

  const command = getCommand(pm, item?.slug)
  const copied = state === "done"

  const cyclePm = () => {
    setPm((current) => {
      const nextIdx = (PM_CYCLE.indexOf(current) + 1) % PM_CYCLE.length
      return PM_CYCLE[nextIdx] ?? "npm"
    })
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3.5 z-20 flex justify-center px-3">
      <div
        className={cn(
          "pointer-events-auto flex h-9 max-w-full items-center gap-1.5 rounded-full border border-border/80 bg-background/90 py-1 pr-1.5 pl-3 shadow-lg backdrop-blur-xl sm:h-10 sm:gap-2 sm:pl-3.5 dark:border-white/10 dark:bg-zinc-950/90",
          "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2"
        )}
      >
        {/* Package manager switcher */}
        <button
          type="button"
          onClick={cyclePm}
          aria-label={`Cycle package manager, currently ${pm}`}
          title="Click to cycle package manager (pnpm / npm / bun)"
          className="inline-flex h-6 items-center gap-1 rounded-md px-1.5 font-mono text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <span>{pm}</span>
          <ArrowUpDown className="size-2.5 opacity-60" aria-hidden="true" />
        </button>

        <span className="h-3 w-px bg-border/60" aria-hidden="true" />

        {/* CLI snippet */}
        <code className="max-w-44 truncate font-mono text-[10px] text-foreground sm:max-w-80 sm:text-[11px] md:max-w-96">
          {command}
        </code>

        {/* Copy button */}
        <button
          type="button"
          onClick={() => void copy(command)}
          aria-label={copied ? "Copied" : "Copy install command"}
          title={copied ? "Copied" : "Copy install command"}
          className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:size-7"
        >
          {copied ? (
            <Check
              className="size-3 text-emerald-500 sm:size-3.5"
              aria-hidden="true"
            />
          ) : (
            <Copy className="size-3 sm:size-3.5" aria-hidden="true" />
          )}
        </button>

        <span className="h-3 w-px bg-border/60" aria-hidden="true" />

        {/* Audio / SFX mute button */}
        <button
          type="button"
          onClick={() => setMuted((prev) => !prev)}
          aria-label={
            muted
              ? "Unmute preview sound effects"
              : "Mute preview sound effects"
          }
          title={
            muted
              ? "Unmute preview sound effects"
              : "Mute preview sound effects"
          }
          className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:size-7"
        >
          {muted ? (
            <VolumeX
              className="size-3 opacity-60 sm:size-3.5"
              aria-hidden="true"
            />
          ) : (
            <Volume2
              className="size-3 text-pp-primary sm:size-3.5"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </div>
  )
}
