import React, { useCallback, useRef } from "react"

import { cn } from "@/shared/lib/utils"

export interface CardCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

/**
 * Interactive canvas container that tracks mouse position and renders
 * an ambient radial glow backdrop across child GlowCard components.
 */
export const CardCanvas = ({
  children,
  className,
  ...props
}: CardCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    containerRef.current.style.setProperty("--mouse-x", `${x}px`)
    containerRef.current.style.setProperty("--mouse-y", `${y}px`)
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={cn("card-canvas", className)}
      {...props}
    >
      <div className="card-backdrop" />
      {children}
    </div>
  )
}

export interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
  contentClassName?: string
  showCrosshairs?: boolean
}

/**
 * Technical Blueprint Animated Glow Card.
 * Features extending corner crosshairs reticles, dynamic hover border glow,
 * and dot-matrix blueprint background texture.
 */
export const GlowCard = ({
  children,
  className,
  contentClassName,
  showCrosshairs = true,
  ...props
}: GlowCardProps) => {
  return (
    <div className={cn("glow-card", className)} {...props}>
      {/* Corner crosshairs extending outwards on hover */}
      {showCrosshairs && (
        <>
          <div className="corner-crosshair tl">
            <div className="line-h" />
            <div className="line-v" />
          </div>
          <div className="corner-crosshair tr">
            <div className="line-h" />
            <div className="line-v" />
          </div>
          <div className="corner-crosshair bl">
            <div className="line-h" />
            <div className="line-v" />
          </div>
          <div className="corner-crosshair br">
            <div className="line-h" />
            <div className="line-v" />
          </div>
        </>
      )}

      {/* Structured inner card content with dot matrix and center alignment */}
      <div
        className={cn(
          "card-content flex h-full w-full flex-1 flex-col items-center justify-center text-center",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  )
}

// Alias export for backward compatibility
export const Card = GlowCard
