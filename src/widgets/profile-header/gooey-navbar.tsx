/* eslint-disable react-hooks/immutability */
import { Link, useRouterState } from "@tanstack/react-router"
import React, { useEffect, useMemo, useRef, useState } from "react"

import { MAIN_NAV_ITEMS, type NavItemConfig } from "@/shared/config"
import { useTheme } from "@/shared/providers/theme-provider"

// --- Number Formatter Helper ---
function $(n: number): string {
  if (isNaN(n) || !isFinite(n)) return "0"
  return (Math.round(n * 100) / 100).toString()
}

// --- Exact SVG Pill Path Generator ---
function getPillPath(
  rect: { x: number; y: number; width: number; height: number },
  radius: number
): string {
  const rClamped = Math.min(radius, rect.width / 2, rect.height / 2)
  const { x, y, width: w, height: h } = rect
  return [
    `M${$(x)} ${$(y + rClamped)}`,
    `A${$(rClamped)} ${$(rClamped)} 0 0 1 ${$(x + rClamped)} ${$(y)}`,
    `L${$(x + w - rClamped)} ${$(y)}`,
    `A${$(rClamped)} ${$(rClamped)} 0 0 1 ${$(x + w)} ${$(y + rClamped)}`,
    `L${$(x + w)} ${$(y + h - rClamped)}`,
    `A${$(rClamped)} ${$(rClamped)} 0 0 1 ${$(x + w - rClamped)} ${$(y + h)}`,
    `L${$(x + rClamped)} ${$(y + h)}`,
    `A${$(rClamped)} ${$(rClamped)} 0 0 1 ${$(x)} ${$(y + h - rClamped)}`,
    `Z`,
  ].join(" ")
}

// --- Exact Tangent-Arc Liquid Gooey Bridge Generator ---
function getGooeyBridgePath(
  e: { x: number; y: number; width: number; height: number },
  t: { x: number; y: number; width: number; height: number },
  cornerRadius: number,
  neckHeight: number,
  pushFactor: number
): string | null {
  if (pushFactor <= 0.02) return null
  const a = e.height
  const o = e.y + a / 2
  const s = Math.min(cornerRadius, a / 2, e.width / 2, t.width / 2)
  if (s <= 0) return null
  const c = e.x + e.width
  const l = t.x
  const u = l - c
  if (u < 0) return null
  const d = Math.min((neckHeight / 2) * pushFactor, a / 2 - 0.5)
  const f = u / 2 + s
  const p = d - a / 2 + s
  const m = 2 * (p - s)
  if (Math.abs(m) < 1e-4) return null
  const h = (s * s - f * f - p * p) / m
  if (!(h > 0) || s + h < f) return null
  const g = Math.sqrt(Math.max(0, (s + h) * (s + h) - f * f))
  const mid = (c + l) / 2
  const v = c - s
  const y = e.y + s
  const ee = mid - v
  const b = e.y + s - g - y
  const hyp = Math.hypot(ee, b) || 1
  const te = v + (s * ee) / hyp
  const S = y + (s * b) / hyp
  const C = 2 * mid - te
  return [
    `M${$(te)} ${$(S)}`,
    `A${$(h)} ${$(h)} 0 0 0 ${$(C)} ${$(S)}`,
    `L${$(C)} ${$(2 * o - S)}`,
    `A${$(h)} ${$(h)} 0 0 0 ${$(te)} ${$(2 * o - S)}`,
    `Z`,
  ].join(" ")
}

let measureCanvas: HTMLCanvasElement | null = null

function measureLabelWidth(label: string, fontSize: number): number {
  const fallback = label.length * fontSize * 0.76
  if (typeof document === "undefined") return fallback
  measureCanvas ??= document.createElement("canvas")
  const ctx = measureCanvas.getContext("2d")
  if (!ctx) return fallback
  ctx.font = `600 ${fontSize}px "Mulish Variable", Mulish, Inter, system-ui, sans-serif`
  return ctx.measureText(label.toUpperCase()).width
}

function isRouteActive(itemLink: string, currentPath: string): boolean {
  if (itemLink === "/") {
    return currentPath === "/" || currentPath === ""
  }
  if (itemLink === "/blocks") {
    return currentPath.startsWith("/blocks") || currentPath.startsWith("/block")
  }
  return currentPath.startsWith(itemLink)
}

function getDisplayLabel(item: NavItemConfig): string {
  if (item.id === "hooks") return "HOOKS"
  if (item.id === "component-ui") return "COMPONENT UI"
  return item.title.toUpperCase()
}

export interface GooeyNavbarProps {
  items?: NavItemConfig[]
  fontSize?: number
  paddingX?: number
  paddingY?: number
  cornerRadius?: number
  gap?: number
  neighborPush?: number
  neckRatio?: number
  stiffness?: number
  damping?: number
  mass?: number
  className?: string
}

export function GooeyNavbar({
  items = MAIN_NAV_ITEMS,
  fontSize = 12,
  paddingX = 14,
  paddingY = 12,
  cornerRadius = 18,
  gap = 0,
  neighborPush = 22,
  neckRatio = 0.36,
  stiffness = 260,
  damping = 30,
  mass = 1,
  className = "",
}: GooeyNavbarProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const textColor = "rgba(255, 255, 255, 0.7)"
  const hoverTextColor = "#ffffff"

  const currentPath = useRouterState({ select: (s) => s.location.pathname })
  const matchedIndex = items.findIndex((item) =>
    isRouteActive(item.link, currentPath)
  )
  const activeIndex = matchedIndex >= 0 ? matchedIndex : 0

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Measure initial rects — calibrated to actual label width + symmetric padding
  const baseRects = useMemo(() => {
    let curX = 0
    return items.map((item) => {
      const label = getDisplayLabel(item)
      const textWidth = Math.ceil(measureLabelWidth(label, fontSize))
      const w = textWidth + paddingX * 2
      const h = fontSize + paddingY * 2
      const r = { x: curX, y: 0, width: w, height: h }
      curX += w + gap
      return r
    })
  }, [items, fontSize, paddingX, paddingY, gap])

  const pillHeight = baseRects[0]?.height ?? 36
  const radius = Math.min(Math.max(cornerRadius, 0), pillHeight / 2)

  // Target separation factors for each gap
  const targetPushFactors = useMemo(() => {
    const isTarget = (idx: number) =>
      idx === hoveredIndex || (hoveredIndex === null && idx === activeIndex)
    return baseRects
      .slice(0, -1)
      .map((_, idx) => (isTarget(idx) || isTarget(idx + 1) ? 1 : 0))
  }, [baseRects, hoveredIndex, activeIndex])

  // Spring Physics Solver Loop
  const [animatedPushFactors, setAnimatedPushFactors] = useState<number[]>(() =>
    baseRects.slice(0, -1).map((_, i) => (i === activeIndex ? 1 : 0))
  )
  const currentPush = useRef<number[]>([1, 0, 0, 0, 0])
  const currentVel = useRef<number[]>([0, 0, 0, 0, 0])

  useEffect(() => {
    let animId: number
    let lastTime = performance.now()

    const updatePhysics = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30)
      lastTime = now

      const pushVals = currentPush.current
      const velVals = currentVel.current
      let isMoving = false

      for (let i = 0; i < targetPushFactors.length; i++) {
        const target = targetPushFactors[i]
        const pos = pushVals[i] ?? target
        const vel = velVals[i] ?? 0

        const force = -stiffness * (pos - target) - damping * vel
        const nextVel = vel + (force / mass) * dt
        const nextPos = pos + nextVel * dt

        if (Math.abs(nextPos - target) > 0.001 || Math.abs(nextVel) > 0.01) {
          pushVals[i] = nextPos
          velVals[i] = nextVel
          isMoving = true
        } else {
          pushVals[i] = target
          velVals[i] = 0
        }
      }

      pushVals.length = targetPushFactors.length
      velVals.length = targetPushFactors.length
      setAnimatedPushFactors([...pushVals])

      if (isMoving) {
        animId = requestAnimationFrame(updatePhysics)
      }
    }

    animId = requestAnimationFrame(updatePhysics)
    return () => cancelAnimationFrame(animId)
  }, [targetPushFactors, stiffness, damping, mass])

  // Calculate exact absolute positions starting at x = 0
  const tabPositions = useMemo(() => {
    const len = baseRects.length
    if (len === 0) return []
    const factors = baseRects
      .slice(0, -1)
      .map((_, i) => animatedPushFactors[i] ?? targetPushFactors[i] ?? 0)

    const positions = new Array(len)
    positions[0] = 0
    for (let i = 1; i < len; i++) {
      positions[i] =
        positions[i - 1] +
        baseRects[i - 1].width +
        gap +
        neighborPush * (factors[i - 1] ?? 0)
    }
    return positions
  }, [baseRects, animatedPushFactors, targetPushFactors, gap, neighborPush])

  // Total expanded width at current frame
  const totalWidth = useMemo(() => {
    const len = baseRects.length
    if (len === 0) return 0
    const lastIdx = len - 1
    return Math.ceil((tabPositions[lastIdx] ?? 0) + baseRects[lastIdx].width)
  }, [baseRects, tabPositions])

  // Current rect for each pill
  const currentRects = useMemo(() => {
    return baseRects.map((rect, i) => ({
      ...rect,
      x: tabPositions[i] ?? 0,
    }))
  }, [baseRects, tabPositions])

  // Full SVG Contour (Pills + Liquid Bridges, zero internal stroke)
  const fullSvgPath = useMemo(() => {
    const paths: string[] = []
    for (const r of currentRects) {
      paths.push(getPillPath(r, radius))
    }
    for (let i = 0; i < currentRects.length - 1; i++) {
      const factor = animatedPushFactors[i] ?? targetPushFactors[i] ?? 0
      const bridge = getGooeyBridgePath(
        currentRects[i],
        currentRects[i + 1],
        radius,
        pillHeight * neckRatio,
        factor
      )
      if (bridge) paths.push(bridge)
    }
    return paths.join(" ")
  }, [
    currentRects,
    radius,
    pillHeight,
    neckRatio,
    animatedPushFactors,
    targetPushFactors,
  ])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left

    let closestIdx: number | null = null
    let minDist = Infinity
    for (let i = 0; i < currentRects.length; i++) {
      const r = currentRects[i]
      const dist =
        x < r.x ? r.x - x : x > r.x + r.width ? x - (r.x + r.width) : 0
      if (dist < minDist) {
        minDist = dist
        closestIdx = i
      }
    }
    setHoveredIndex(closestIdx)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative block select-none ${className}`}
      style={{
        width: `${totalWidth}px`,
        height: `${pillHeight}px`,
      }}
    >
      {/* SVG Liquid Contour Layer — specular gradient + perimeter rim glow */}
      <svg
        width={totalWidth}
        height={pillHeight}
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-0 z-0 overflow-visible"
        style={{
          filter: isDark
            ? "drop-shadow(0 0 1px rgba(255, 255, 255, 0.32)) drop-shadow(0 4px 16px rgba(0, 0, 0, 0.7))"
            : "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.12))",
        }}
      >
        <defs>
          <linearGradient
            id="gooey-gradient-dark"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(45, 45, 52)" />
            <stop offset="100%" stopColor="rgb(22, 22, 26)" />
          </linearGradient>
          <linearGradient
            id="gooey-gradient-light"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgb(24, 24, 28)" />
            <stop offset="100%" stopColor="rgb(10, 10, 12)" />
          </linearGradient>
        </defs>
        <path
          d={fullSvgPath}
          fill={
            isDark ? "url(#gooey-gradient-dark)" : "url(#gooey-gradient-light)"
          }
          stroke="none"
          strokeWidth={0}
          fillRule="nonzero"
        />
      </svg>

      {/* Foreground Navigation Links — accurately positioned at each pill's center */}
      <nav aria-label="Main" className="relative z-10 block h-full w-full">
        {items.map((item, idx) => {
          const isHovered = hoveredIndex === idx
          const isActive = activeIndex === idx
          const label = getDisplayLabel(item)
          const posX = tabPositions[idx] ?? 0
          const itemWidth = baseRects[idx]?.width ?? 0

          return (
            <Link
              key={item.link || `tab-${idx}`}
              to={item.link}
              onMouseEnter={() => setHoveredIndex(idx)}
              style={{
                position: "absolute",
                left: `${posX}px`,
                top: 0,
                width: `${itemWidth}px`,
                height: `${pillHeight}px`,
                fontFamily:
                  '"Mulish Variable", Mulish, Inter, system-ui, sans-serif',
                fontWeight: isActive ? 700 : 600,
                fontSize: `${fontSize}px`,
                lineHeight: 1,
                letterSpacing: "0.2px",
                color: isHovered || isActive ? hoverTextColor : textColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                cursor: "pointer",
                boxSizing: "border-box",
                transition: "color 0.15s ease",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="flex h-full w-full items-center justify-center text-center whitespace-nowrap select-none">
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default GooeyNavbar
