import type React from "react"
import { useCallback, useRef } from "react"

import { cn } from "@/shared/lib/utils"

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
  contentClassName?: string
  spotlightSize?: number
  enableTilt?: boolean
  /** RGB string e.g. "255, 255, 255". If omitted, automatically adapts to theme */
  glowRgb?: string
  glowColor?: "neutral" | "primary"
}

const FALLOFF = [1, 0.973, 0.837, 0.593, 0.317, 0.104, 0.009] as const

const buildGlowStops = (alphaVar: string, weightVar: string) =>
  `${FALLOFF.map(
    (fall, i) =>
      `rgba(var(--mb-glow-rgb), calc(var(${alphaVar}) * var(${weightVar}, 0) * ${fall})) ${i * 15}%`
  ).join(", ")}, rgba(var(--mb-glow-rgb), 0) 100%`

const SPOTLIGHT_STOPS = buildGlowStops("--mb-spot-alpha", "--mb-hot")
const BORDER_STOPS = buildGlowStops("--mb-glow-alpha", "--mb-near")

export function SpotlightCard({
  children,
  className,
  contentClassName,
  spotlightSize = 280,
  enableTilt = false,
  glowRgb,
  glowColor = "neutral",
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  style,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseMove?.(e)
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      card.style.setProperty("--mb-x", `${x.toFixed(1)}px`)
      card.style.setProperty("--mb-y", `${y.toFixed(1)}px`)

      if (enableTilt) {
        const u = x / Math.max(1, rect.width) - 0.5
        const v = y / Math.max(1, rect.height) - 0.5
        card.style.setProperty("--mb-rx", `${(-v * 8).toFixed(2)}deg`)
        card.style.setProperty("--mb-ry", `${(u * 8).toFixed(2)}deg`)
      }
    },
    [enableTilt, onMouseMove]
  )

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(e)
      const card = cardRef.current
      if (!card) return
      card.style.setProperty("--mb-hot", "1")
      card.style.setProperty("--mb-near", "1")
      card.setAttribute("data-active", "")
    },
    [onMouseEnter]
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e)
      const card = cardRef.current
      if (!card) return
      card.style.setProperty("--mb-hot", "0")
      card.style.setProperty("--mb-near", "0")
      card.style.setProperty("--mb-rx", "0deg")
      card.style.setProperty("--mb-ry", "0deg")
      card.removeAttribute("data-active")
    },
    [onMouseLeave]
  )

  const resolvedGlowRgb =
    glowRgb || (glowColor === "primary" ? "220, 38, 38" : undefined)

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        {
          "--mb-spot-size": `${spotlightSize}px`,
          "--mb-border-size": `${Math.round(spotlightSize * 0.75)}px`,
          "--mb-hot": 0,
          "--mb-near": 0,
          ...(resolvedGlowRgb ? { "--mb-glow-rgb": resolvedGlowRgb } : {}),
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-xl select-none",
        // Adaptive light/dark glow variables
        "[--mb-glow-alpha:0.45] [--mb-glow-rgb:24,24,27] [--mb-spot-alpha:0.04]",
        "dark:[--mb-glow-alpha:0.85] dark:[--mb-glow-rgb:244,244,245] dark:[--mb-spot-alpha:0.07]",
        // Theme surface & borders
        "border border-black/10 bg-gradient-to-b from-white to-zinc-50/90 dark:border-white/10 dark:from-[#18181b]/90 dark:to-[#121215]",
        "shadow-xs transition-all duration-300",
        // Smooth 3D tilt perspective
        enableTilt &&
          "[transform:perspective(900px)_rotateX(var(--mb-rx,0deg))_rotateY(var(--mb-ry,0deg))] transition-transform duration-200 ease-out",
        className
      )}
      {...props}
    >
      {/* 1. Spotlight Layer (Radial background wash following mouse) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-1 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(var(--mb-spot-size) circle at var(--mb-x, -999px) var(--mb-y, -999px), ${SPOTLIGHT_STOPS})`,
        }}
      />

      {/* 2. Inner Content */}
      <div
        className={cn("relative z-2 flex flex-1 flex-col", contentClassName)}
      >
        {children}
      </div>

      {/* 3. Rim Highlight Layer (Subtle static inner bevel edge) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-3 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(24,24,27,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.05)]"
      />

      {/* 4. Border Glow Layer (1px cursor-tracking edge highlight via mask) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-4 box-border rounded-[inherit] p-px transition-opacity duration-300"
        style={{
          background: `radial-gradient(var(--mb-border-size) circle at var(--mb-x, -999px) var(--mb-y, -999px), ${BORDER_STOPS})`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
        }}
      />
    </div>
  )
}
