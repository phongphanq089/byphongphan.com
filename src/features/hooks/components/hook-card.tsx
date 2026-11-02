import { Link } from "@tanstack/react-router"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { usePostHog } from "posthog-js/react"
import { useState } from "react"

import { RenderHookSchematic } from "@/registry/schematics"
import { cn } from "@/shared/lib/utils"
import {
  Badge,
  BorderGlow,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"

import type { HookItem } from "../types"

interface HookCardProps {
  hook: HookItem
}

export function HookCard({ hook }: HookCardProps) {
  const [copied, setCopied] = useState(false)
  const posthog = usePostHog()

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hook.name)
      posthog.capture("hook_name_copied", {
        hook_category: hook.category,
        hook_slug: hook.slug,
      })
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <BorderGlow
      borderRadius={10}
      edgeSensitivity={20}
      glowRadius={28}
      glowIntensity={0.8}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-lg p-0 transition-all duration-300",
        "border border-black/10 bg-muted/80 backdrop-blur-xl dark:border-white/10 dark:bg-muted/40",
        "shadow-xs hover:shadow-lg",
        "focus-within:ring-2 focus-within:ring-primary/50"
      )}
      contentClassName="h-full flex-col justify-between"
    >
      <Link
        to="/hooks/$category/$slug"
        params={{ category: hook.category, slug: hook.slug }}
        className="flex h-full w-full flex-col justify-between p-4 focus:outline-none sm:p-5"
      >
        {/* Top Section: Title, Categories, Badges & Action */}
        <div className="flex flex-col gap-1.5 pb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-pp-primary sm:text-base">
                    {hook.name}
                  </h3>
                </TooltipTrigger>
                <TooltipContent>{hook.name}</TooltipContent>
              </Tooltip>

              {/* Status Badge */}
              {hook.isNew ? (
                <Badge
                  variant="outline"
                  className="h-4.5 gap-1 rounded border-primary bg-primary px-1.5 text-[9px] font-semibold tracking-wider text-white uppercase shadow-[0_0_8px_var(--pp-primary-glow)] dark:text-background"
                >
                  New
                </Badge>
              ) : hook.isUpdated ? (
                <Badge
                  variant="outline"
                  className="h-4.5 gap-1 rounded border-emerald-500/30 bg-emerald-500/10 px-1.5 text-[9px] font-semibold tracking-wider text-emerald-600 uppercase shadow-[0_0_8px_rgba(16,185,129,0.3)] dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400"
                >
                  Updated
                </Badge>
              ) : null}
            </div>

            {/* Quick Copy Name & Navigation Arrow */}
            <div className="flex items-center gap-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleCopy}
                    className="size-6 border border-border/60 bg-muted/40 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:border-pp-primary/50 hover:bg-pp-primary/10 hover:text-pp-primary active:scale-95"
                    aria-label="Copy hook name"
                  >
                    {copied ? (
                      <Check className="size-3 text-pp-primary" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={4}
                  className="text-[10px]"
                >
                  {copied ? "Copied name!" : "Copy name"}
                </TooltipContent>
              </Tooltip>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-pp-primary" />
            </div>
          </div>
        </div>

        {/* Center Stage: Hook Schematic */}
        <div className="relative my-2 flex h-44 w-full items-center justify-center overflow-hidden rounded-sm border border-black/5 bg-background p-4 transition-colors group-hover:border-white/10 sm:h-48 dark:border-white/5 dark:bg-black/60">
          <div className="pointer-events-none absolute inset-0 bg-radial from-white/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex w-full items-center justify-center transition-transform duration-300 will-change-transform group-hover:scale-[1.02]">
            <RenderHookSchematic type={hook.schematicType} />
          </div>
        </div>
      </Link>
    </BorderGlow>
  )
}
