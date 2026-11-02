import { Link } from "@tanstack/react-router"
import { ArrowRight, Check, Copy, Puzzle } from "lucide-react"
import { useState } from "react"

import { useCopyToClipboard } from "@/shared/hooks/use-copy-to-clipboard"
import { cn } from "@/shared/lib/utils"
import {
  BorderGlow,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"

import type { HookItem, HookSchematicType } from "../types"
import { RenderHookSchematic } from "./previews"

interface HookCardProps {
  hook: HookItem
}

export function HookCard({ hook }: HookCardProps) {
  const { isCopied, copy } = useCopyToClipboard({ timeout: 2000 })
  const [copiedManual, setCopiedManual] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    copy(hook.name)
    setCopiedManual(true)
    setTimeout(() => setCopiedManual(false), 2000)
  }

  const showCopied = isCopied || copiedManual

  return (
    <BorderGlow
      borderRadius={12}
      edgeSensitivity={20}
      glowRadius={30}
      glowIntensity={0.8}
      className={cn(
        "group relative flex h-full w-full flex-col overflow-hidden rounded-xl p-0 transition-all duration-300",
        "border border-black/10 bg-muted/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#0B0F17]/90",
        "shadow-xs hover:shadow-xl",
        "focus-within:ring-2 focus-within:ring-primary/50"
      )}
      contentClassName="h-full flex-col justify-between"
    >
      <Link
        to="/hooks/$category/$slug"
        params={{ category: hook.category, slug: hook.slug }}
        className="flex h-full w-full flex-col justify-between p-4 focus:outline-none sm:p-5"
      >
        {/* Top Header */}
        <div className="flex flex-col gap-2 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-sans text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-blue-400">
                {hook.name}
              </h3>

              {/* Category Pill Badge */}
              <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                {hook.category.replace("-", " & ")}
              </span>

              {/* NEW Badge */}
              {hook.isNew && (
                <span className="flex items-center gap-1 rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase shadow-[0_0_8px_rgba(37,99,235,0.4)]">
                  <Puzzle className="size-2.5 fill-white" />
                  NEW
                </span>
              )}

              {/* Blue indicator dot */}
              {(!hook.isNew || hook.slug !== "use-click-outside") && (
                <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              )}
            </div>

            {/* Quick Copy Name Action */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCopy}
                  className="size-6 border border-border/60 bg-muted/40 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 active:scale-95"
                  aria-label="Copy hook name"
                >
                  {showCopied ? (
                    <Check className="size-3 text-emerald-400" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} className="text-[10px]">
                {showCopied ? "Copied name!" : "Copy hook name"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
            {hook.description}
          </p>
        </div>

        {/* Center Preview Box */}
        <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-lg border border-black/5 bg-background/50 p-2 transition-colors group-hover:border-white/10 sm:h-48 dark:border-white/5 dark:bg-[#070A11]/90">
          <div className="pointer-events-none absolute inset-0 bg-radial from-blue-500/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex h-full w-full items-center justify-center transition-transform duration-300 will-change-transform group-hover:scale-[1.01]">
            <RenderHookSchematic
              type={
                (hook.schematicType ??
                  hook.slug.replace(/^use-/, "")) as HookSchematicType
              }
            />
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
          <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
            {hook.name}
          </span>
          <ArrowRight className="size-4 text-muted-foreground/60 transition-all duration-200 group-hover:translate-x-1 group-hover:text-blue-400" />
        </div>
      </Link>
    </BorderGlow>
  )
}
