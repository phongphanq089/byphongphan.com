import { Link } from "@tanstack/react-router"
import { ArrowUpRight, Check, Copy } from "lucide-react"
import { useState } from "react"

import { cn } from "@/shared/lib/utils"
import {
  Badge,
  BorderGlow,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"

import type { ComponentItem } from "../types"
import { RenderSchematic } from "./schematics"

interface ComponentCardProps {
  component: ComponentItem
}

export function ComponentCard({ component }: ComponentCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (navigator.clipboard) {
      navigator.clipboard.writeText(component.name)
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
        to="/component-ui/$category/$slug"
        params={{ category: component.category, slug: component.slug }}
        className="flex h-full w-full flex-col justify-between p-4 focus:outline-none sm:p-5"
      >
        <div className="flex items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2">
            {component.count !== undefined && (
              <span className="flex size-5 items-center justify-center rounded-md bg-white/10 text-[10px] font-bold text-white">
                {component.count}
              </span>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-pp-primary sm:text-base">
                  {component.name}
                </h3>
              </TooltipTrigger>
              <TooltipContent>{component.name}</TooltipContent>
            </Tooltip>
            {component.isNew && (
              <Badge
                variant="outline"
                className="h-4.5 gap-1 rounded border-primary bg-primary px-1.5 text-[9px] font-semibold tracking-wider text-white uppercase shadow-[0_0_8px_var(--pp-primary-glow)] dark:text-background"
              >
                New
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCopy}
                  className="size-6 border border-border/60 bg-muted/40 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:border-pp-primary/50 hover:bg-pp-primary/10 hover:text-pp-primary active:scale-95"
                  aria-label="Copy component name"
                >
                  {copied ? (
                    <Check className="size-3 text-pp-primary" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={4} className="text-[10px]">
                {copied ? "Copied name!" : "Copy name"}
              </TooltipContent>
            </Tooltip>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-pp-primary" />
          </div>
        </div>
        <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-sm border border-black/5 bg-background p-4 transition-colors group-hover:border-white/10 sm:h-52 dark:border-white/5 dark:bg-black/60">
          <div className="pointer-events-none absolute inset-0 bg-radial from-white/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative z-10 flex w-full items-center justify-center transition-transform duration-300 will-change-transform group-hover:scale-[1.02]">
            <RenderSchematic type={component.schematicType} />
          </div>
        </div>
      </Link>
    </BorderGlow>
  )
}
