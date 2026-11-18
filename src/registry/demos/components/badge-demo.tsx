import { ArrowUpRight, Check, GitBranch, Sparkles } from "lucide-react"
import { useState } from "react"

import { Badge, BadgeDot } from "@/registry/ui/badge"

export function BadgeDemo() {
  const [size, setSize] = useState<"xs" | "sm" | "default" | "lg">("default")
  const [shape, setShape] = useState<"pill" | "rounded" | "square">("pill")

  return (
    <div className="flex w-full max-w-2xl flex-col items-center justify-center gap-10 p-4 text-center sm:p-10">
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Refined Minimalist Badge System
        </span>
        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Precision Tags & Status Indicators
        </h3>
        <p className="max-w-md text-xs text-balance text-muted-foreground">
          Calibrated proportions, subtle tints, hairline borders, and reactive
          micro-dots for modern interfaces.
        </p>
      </div>

      {/* Live Showcase Grid */}
      <div className="flex w-full flex-col gap-6 rounded-2xl border border-border/80 bg-background/60 p-6 shadow-xs backdrop-blur-sm sm:p-8">
        {/* Section 1: Semantic Variants */}
        <div className="flex flex-col gap-3">
          <span className="text-left font-mono text-[11px] font-medium text-muted-foreground uppercase">
            Semantic Variants
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="default" size={size} shape={shape}>
              Default
            </Badge>
            <Badge variant="secondary" size={size} shape={shape}>
              Secondary
            </Badge>
            <Badge variant="outline" size={size} shape={shape}>
              Outline
            </Badge>
            <Badge variant="subtle" size={size} shape={shape}>
              Subtle
            </Badge>
            <Badge variant="success" size={size} shape={shape}>
              Success
            </Badge>
            <Badge variant="warning" size={size} shape={shape}>
              Warning
            </Badge>
            <Badge variant="destructive" size={size} shape={shape}>
              Destructive
            </Badge>
            <Badge variant="info" size={size} shape={shape}>
              Info
            </Badge>
          </div>
        </div>

        <div className="h-px w-full bg-border/40" />

        {/* Section 2: Status Indicators with Pulsing Dots */}
        <div className="flex flex-col gap-3">
          <span className="text-left font-mono text-[11px] font-medium text-muted-foreground uppercase">
            Status with Micro Dots
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="success" size={size} shape={shape}>
              <BadgeDot pulse />
              Production Ready
            </Badge>
            <Badge variant="info" size={size} shape={shape}>
              <BadgeDot pulse />
              Deploying
            </Badge>
            <Badge variant="warning" size={size} shape={shape}>
              <BadgeDot />
              Staged
            </Badge>
            <Badge variant="subtle" size={size} shape={shape}>
              <BadgeDot />
              Draft
            </Badge>
            <Badge variant="destructive" size={size} shape={shape}>
              <BadgeDot pulse />
              Degraded
            </Badge>
          </div>
        </div>

        <div className="h-px w-full bg-border/40" />

        {/* Section 3: Icon & Action Badges */}
        <div className="flex flex-col gap-3">
          <span className="text-left font-mono text-[11px] font-medium text-muted-foreground uppercase">
            Icon & Interactive Badges
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="default" size={size} shape={shape}>
              <Sparkles />
              AI Powered
            </Badge>
            <Badge variant="outline" size={size} shape={shape}>
              <GitBranch />
              feature/v2.5
            </Badge>
            <Badge variant="secondary" size={size} shape={shape}>
              <Check />
              Verified
            </Badge>
            <Badge
              variant="outline"
              size={size}
              shape={shape}
              render={<a href="#changelog" className="cursor-pointer" />}
            >
              Changelog
              <ArrowUpRight />
            </Badge>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="flex max-w-full flex-wrap items-center justify-center gap-3 rounded-xl border border-border/80 bg-background/80 p-3 text-xs shadow-xs backdrop-blur-sm">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-muted-foreground">Size:</span>
          {(["xs", "sm", "default", "lg"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                size === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>

        <span
          className="hidden h-4 w-px bg-border/60 sm:inline-block"
          aria-hidden="true"
        />

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-muted-foreground">Shape:</span>
          {(["pill", "rounded", "square"] as const).map((sh) => (
            <button
              key={sh}
              type="button"
              onClick={() => setShape(sh)}
              className={`rounded-lg px-2.5 py-1 font-medium capitalize transition-colors ${
                shape === sh
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {sh}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BadgeDemo
