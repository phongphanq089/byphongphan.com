# Not Found Gravity

> Interactive 404 error page with 2D physics gravity, falling blocks, and draggable elements.

## Installation

```bash
npx shadcn@latest add https://byphongphan.com/r/not-found-02.json
```

## Source Code

### `block/not-found-02/app/not-found.tsx`

```tsx
import { Dices, Lightbulb, RotateCcw } from "lucide-react"
import { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"

import { Gravity, type GravityRef, MatterBody } from "../components/gravity"

export default function NotFound({ children }: { children?: React.ReactNode }) {
  const gravityRef = useRef<GravityRef | null>(null)

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
    }
  }, [])

  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  return (
    <main className="fixed inset-0 z-50 flex h-[100dvh] w-screen flex-col overflow-hidden bg-background text-foreground transition-colors duration-300 select-none">
      {/* ── Background Blueprint Grid ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 grid grid-cols-[1fr_repeat(2,min(560px,42vw))_1fr] grid-rows-[24px_60px_auto_60px_1fr]"
      >
        <div className="border-r border-b border-border/40" />
        <div className="border-r border-b border-border/40" />
        <div className="border-r border-b border-border/40" />
        <div className="border-b border-border/40" />

        <div className="border-r border-b border-border" />
        <div className="border-r border-b border-border/40" />
        <div className="border-r border-b border-border" />
        <div className="border-b border-border" />

        <div className="border-r border-b border-border" />
        <div className="border-r border-b border-border" />
        <div className="border-r border-b border-border" />
        <div className="border-b border-border" />
        <div className="border-r border-b border-border" />
        <div className="border-r border-b border-border/40" />
        <div className="border-r border-b border-border" />
        <div className="border-b border-border" />

        <div className="border-r border-border" />
        <div className="border-r border-border" />
        <div className="border-r border-border" />
        <div />
      </div>

      {/* ── 2D Gravity Physics Stage ── */}
      <div className="absolute inset-0 z-10 h-full w-full">
        <Gravity
          ref={gravityRef}
          gravity={{ x: 0, y: 1 }}
          addTopWall={false}
          grabCursor={true}
          className="h-full w-full"
        >
          {/* Block 1: Lightbulb */}
          <MatterBody
            x="14%"
            y="-10%"
            angle={-3}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="flex h-[110px] w-[75px] flex-col items-center justify-center rounded-xl border border-black/10 bg-[#9cd517] text-[#05461c] shadow-lg transition-colors select-none sm:h-[170px] sm:w-[140px] md:h-[230px] md:w-[200px] dark:border-white/10 dark:bg-[#1d320d] dark:text-[#a3e635]">
              <Lightbulb className="size-10 stroke-[2] sm:size-18 md:size-28" />
            </div>
          </MatterBody>

          {/* Block 2: File Icon */}
          <MatterBody
            x="14%"
            y="-38%"
            angle={2}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="flex h-[110px] w-[75px] flex-col items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-[#f97316] shadow-lg transition-colors select-none sm:h-[170px] sm:w-[140px] sm:gap-3 md:h-[230px] md:w-[200px] md:gap-4 dark:border-white/10 dark:bg-[#3a1306]">
              <svg
                className="size-10 sm:size-16 md:size-20"
                viewBox="0 0 20 20"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g
                    transform="translate(-260.000000, -1319.000000)"
                    className="fill-white/80"
                  >
                    <g transform="translate(56.000000, 160.000000)">
                      <path d="M214.25,1177.0005 L213.75,1177.0005 L213,1171.0005 L211,1171.0005 L212,1179.0005 L213,1179.0005 L214,1179.0005 L215,1179.0005 L216,1179.0005 L217,1171.0005 L215,1171.0005 L214.25,1177.0005 Z M218,1175.0005 C218,1177.2095 219.791,1179.0005 222,1179.0005 L224,1179.0005 L224,1175.0005 L222,1175.0005 L222,1177.1055 C220.895,1177.1055 220,1176.1575 220,1175.0525 C220,1173.9485 220.895,1173.0005 222,1173.0005 L224,1173.0005 L224,1171.0005 L222,1171.0005 C219.791,1171.0005 218,1172.7915 218,1175.0005 L218,1175.0005 Z M206,1171.0005 C204.895,1171.0005 204,1172.0005 204,1173.1055 L204,1174.1055 C204,1175.2095 204.895,1176.0005 206,1176.0005 L207.5,1176.0005 C207.776,1176.0005 208,1176.2245 208,1176.5005 C208,1176.7765 207.776,1177.0005 207.5,1177.0005 L204,1177.0005 L204,1179.0005 L208,1179.0005 L208.021,1179.0005 C209.114,1179.0005 210,1178.2195 210,1177.1255 L210,1176.0845 C210,1174.9915 209.114,1174.0005 208.021,1174.0005 L208,1174.0005 L206.5,1174.0005 C206.224,1174.0005 206,1173.7765 206,1173.5005 C206,1173.2245 206.224,1173.0005 206.5,1173.0005 L210,1173.0005 L210,1171.0005 L206,1171.0005 Z M224,1165.4385 L224,1169.0005 L222,1169.0005 L222,1167.0005 L216,1167.0005 L216,1161.0005 L206,1161.0005 L206,1169.0005 L204,1169.0005 L204,1159.0005 L217.979,1159.0005 L224,1165.4385 Z" />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </MatterBody>

          {/* Block 3: Code window */}
          <MatterBody
            x="28%"
            y="-18%"
            angle={-2}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="flex h-[75px] w-[100px] items-center justify-center rounded-xl border border-black/10 bg-[#fad246] p-2 text-[#3f1d0b] shadow-lg transition-colors select-none sm:h-[110px] sm:w-[150px] sm:p-4 md:h-[135px] md:w-[200px] md:p-6 dark:border-white/10 dark:bg-[#352605] dark:text-[#fde047]">
              <svg
                className="size-10 fill-white/90 stroke-4 sm:size-16 md:size-20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
              >
                <path d="M31,31.36H1v-0.72h30V31.36z M31,28.36H1v-0.72h30V28.36z M31,25.36H1v-0.72h30V25.36z M31,22.36H1c-0.199,0-0.36-0.161-0.36-0.36V1c0-0.199,0.161-0.36,0.36-0.36h30c0.199,0,0.36,0.161,0.36,0.36v21 C31.36,22.199,31.199,22.36,31,22.36z M1.36,21.64h29.28V4.36H1.36V21.64z M1.36,3.64h29.28V1.36H1.36V3.64z M29,2.5 C29,2.776,28.776,3,28.5,3S28,2.776,28,2.5S28.224,2,28.5,2S29,2.224,29,2.5z M26.5,2C26.224,2,26,2.224,26,2.5S26.224,3,26.5,3 S27,2.776,27,2.5S26.776,2,26.5,2z M24.5,2C24.224,2,24,2.224,24,2.5S24.224,3,24.5,3S25,2.776,25,2.5S24.776,2,24.5,2z M10,14.36H4 v-0.72h6V14.36z M10,11.36H4v-0.72h6V11.36z M10,8.36H4V7.64h6V8.36z" />
              </svg>
            </div>
          </MatterBody>

          {/* Block 4: Code brackets */}
          <MatterBody
            x="28%"
            y="-42%"
            angle={3}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="relative flex h-[110px] w-[75px] items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-[#67164b] p-2 shadow-lg transition-colors select-none sm:h-[160px] sm:w-[110px] sm:p-3 md:h-[220px] md:w-[150px] md:p-4 dark:border-white/10 dark:bg-[#2b0720]">
              <svg
                className="size-12 fill-white/90 sm:size-20 md:size-28"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1.293,11.293l4-4A1,1,0,1,1,6.707,8.707L3.414,12l3.293,3.293a1,1,0,1,1-1.414,1.414l-4-4A1,1,0,0,1,1.293,11.293Zm17.414-4a1,1,0,1,0-1.414,1.414L20.586,12l-3.293,3.293a1,1,0,1,0,1.414,1.414l4-4a1,1,0,0,0,0-1.414ZM13.039,4.726l-4,14a1,1,0,0,0,.686,1.236A1.053,1.053,0,0,0,10,20a1,1,0,0,0,.961-.726l4-14a1,1,0,1,0-1.922-.548Z" />
              </svg>
            </div>
          </MatterBody>

          {/* Block 5: Monitor screen */}
          <MatterBody
            x="48%"
            y="-16%"
            angle={-2}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="relative flex h-[130px] w-[85px] items-center justify-center rounded-xl border border-black/10 bg-[#1e293b] p-2 shadow-lg transition-colors select-none sm:h-[210px] sm:w-[180px] sm:p-3 md:h-[290px] md:w-[250px] md:p-4 dark:border-white/10 dark:bg-[#0f172a]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="size-14 fill-white/90 sm:size-22 md:size-28"
              >
                <path d="M29,4H3C1.343,4,0,5.343,0,7v16c0,1.657,1.343,3,3,3h9v3h-1.5c-0.276,0-0.5,0.224-0.5,0.5l0,0 c0,0.276,0.224,0.5,0.5,0.5h11c0.276,0,0.5-0.224,0.5-0.5l0,0c0-0.276-0.224-0.5-0.5-0.5H20v-3h9c1.657,0,3-1.343,3-3V7 C32,5.343,30.657,4,29,4z M19,29h-6v-3h6V29z M31,23c0,1.105-0.895,2-2,2H3c-1.105,0-2-0.895-2-2V7c0-1.105,0.895-2,2-2h26 c1.105,0,2,0.895,2,2V23z M25.805,9.03c-0.782-0.154-1.475,0.3-1.713,0.97H18V9h-4v1H7.908C7.67,9.33,6.976,8.876,6.195,9.03 c-0.573,0.113-1.04,0.572-1.16,1.144C4.83,11.145,5.565,12,6.5,12c0.652,0,1.202-0.419,1.408-1H14v0.224 c-4.388,0.897-7.745,4.658-7.986,9.246C5.999,20.757,6.227,21,6.515,21h0c0.263,0,0.484-0.204,0.497-0.467 c0.209-4.065,3.134-7.41,6.988-8.289V13h4v-0.757c3.854,0.88,6.779,4.225,6.988,8.289C25.002,20.796,25.222,21,25.485,21h0 c0.288,0,0.516-0.243,0.501-0.53c-0.241-4.588-3.598-8.349-7.986-9.246V11h6.092c0.207,0.581,0.756,1,1.408,1 c0.935,0,1.67-0.855,1.466-1.826C26.845,9.602,26.378,9.143,25.805,9.03z M6.5,11C6.224,11,6,10.776,6,10.5S6.224,10,6.5,10 S7,10.224,7,10.5S6.776,11,6.5,11z M17,12h-2v-2h2V12z M25.5,11c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5s0.5,0.224,0.5,0.5 S25.776,11,25.5,11z" />
              </svg>
            </div>
          </MatterBody>

          {/* Block 6: Figma logo */}
          <MatterBody
            x="58%"
            y="-32%"
            angle={3}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="relative flex h-[130px] w-[85px] items-center justify-center rounded-xl border border-black/10 bg-[#c5b4f8] p-2 shadow-lg transition-colors select-none sm:h-[210px] sm:w-[120px] sm:p-3 md:h-[290px] md:w-[150px] md:p-4 dark:border-white/10 dark:bg-[#240f3b]">
              <svg
                className="size-14 sm:size-20 md:size-28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.5"
                  d="M11.9999 2H8.66659C6.82564 2 5.33325 3.49238 5.33325 5.33333C5.33325 7.17428 6.82563 8.66667 8.66658 8.66667H11.9999V2Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <path
                  d="M11.9999 8.6665H8.66659C6.82564 8.6665 5.33325 10.1589 5.33325 11.9998C5.33325 13.8408 6.82563 15.3332 8.66658 15.3332H11.9999V8.6665Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <path
                  opacity="0.5"
                  d="M18.6667 11.9998C18.6667 13.8408 17.1743 15.3332 15.3333 15.3332C13.4924 15.3332 12 13.8408 12 11.9998C12 10.1589 13.4924 8.6665 15.3333 8.6665C17.1743 8.6665 18.6667 10.1589 18.6667 11.9998Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <path
                  opacity="0.5"
                  d="M8.66658 15.3335H11.9999V18.6668C11.9999 20.5078 10.5075 22.0002 8.66659 22.0002C6.82564 22.0002 5.33325 20.5078 5.33325 18.6668C5.33325 16.8259 6.82563 15.3335 8.66658 15.3335Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 2H15.3333C17.1743 2 18.6667 3.49238 18.6667 5.33333C18.6667 7.17428 17.1743 8.66667 15.3333 8.66667H12V2Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </MatterBody>

          {/* Block 7: Typography Aa */}
          <MatterBody
            x="72%"
            y="-14%"
            angle={-2}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="flex h-[80px] w-[80px] items-center justify-end rounded-xl border border-black/10 bg-[#fa501e] pr-2 shadow-lg transition-colors select-none sm:h-[130px] sm:w-[130px] sm:pr-3 md:h-[180px] md:w-[180px] md:pr-4 dark:border-white/10 dark:bg-[#441208]">
              <span className="text-[36px] leading-none font-black text-[#3b0764] select-none sm:text-[56px] md:text-[80px] dark:text-[#fca5a5]">
                Aa
              </span>
            </div>
          </MatterBody>

          {/* Block 8: Diamond / Hourglass */}
          <MatterBody
            x="82%"
            y="-26%"
            angle={4}
            matterBodyOptions={{ friction: 0.3, restitution: 0.2 }}
          >
            <div className="relative flex h-[140px] w-[80px] items-center justify-center rounded-xl border border-black/10 bg-[#30c6e8] p-2 shadow-lg transition-colors select-none sm:h-[220px] sm:w-[140px] sm:p-3 md:h-[310px] md:w-[200px] md:p-4 dark:border-white/10 dark:bg-[#082f49]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="size-14 fill-white/90 sm:size-22 md:size-28"
              >
                <rect x="9" y="1" width="13" height="2" />
                <path d="M24.598,12.998C22.318,11.098,21,8.284,21,5.316V4H10v1.316c0,2.968-1.318,5.782-3.598,7.682 L4,15l11,16V19.95c-1.141-0.232-2-1.24-2-2.45c0-1.381,1.119-2.5,2.5-2.5s2.5,1.119,2.5,2.5c0,1.209-0.859,2.218-2,2.45V31l11-16 L24.598,12.998z" />
              </svg>
            </div>
          </MatterBody>
        </Gravity>
      </div>

      <div className="pointer-events-none h-[60px] w-full shrink-0" />

      {/* ── 404 Headline & Actions ── */}
      <header className="pointer-events-none relative z-20 mx-auto flex w-full max-w-4xl shrink-0 flex-col items-center px-4 py-6 text-center sm:py-8 md:py-10">
        <h1 className="pointer-events-auto mb-2 text-2xl font-extrabold tracking-tight text-foreground sm:mb-4 sm:text-4xl md:text-5xl">
          Page not found
        </h1>
        <p className="pointer-events-auto mb-4 text-xs text-muted-foreground sm:text-sm md:text-base">
          We couldn&apos;t find the page you were looking for.{" "}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-auto p-0 text-xs font-semibold underline sm:text-sm md:text-base"
          >
            Go back
          </Button>
        </p>

        {children && (
          <div className="pointer-events-auto mb-3 max-w-lg text-sm text-muted-foreground md:text-base">
            {children}
          </div>
        )}

        <nav
          aria-label="404 Actions"
          className="pointer-events-auto flex flex-wrap items-center justify-center gap-2.5"
        >
          <Button
            size="default"
            variant="outline"
            type="button"
            onClick={() => gravityRef.current?.reset()}
            className="gap-2 rounded-xl"
          >
            <RotateCcw className="size-3.5" />
            <span>Reassemble</span>
          </Button>

          <Button
            size="default"
            variant="secondary"
            type="button"
            onClick={() => gravityRef.current?.scatter()}
            className="gap-2 rounded-xl"
          >
            <Dices className="size-3.5" />
            <span>Scatter</span>
          </Button>
        </nav>
      </header>
    </main>
  )
}

```

### `block/not-found-02/components/gravity.tsx`

```tsx
import type {
  Body as MatterBodyType,
  Engine as MatterEngineType,
  IChamferableBodyDefinition,
  MouseConstraint as MatterMouseConstraintType,
  Render as MatterRenderType,
  Runner as MatterRunnerType,
  Vector as MatterVectorType,
} from "matter-js"
import MatterPkg from "matter-js"
import decompPkg from "poly-decomp"
import {
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import SVGPathCommanderPkg from "svg-path-commander"

import { cn } from "@/lib/utils"

// Robust resolution for CommonJS / ESM interop across Vite and SSR
const Matter =
  (MatterPkg as unknown as { default?: typeof MatterPkg }).default || MatterPkg
const {
  Bodies,
  Body,
  Common,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Query,
  Render,
  Runner,
  Sleeping,
  World,
} = Matter

const decomp =
  (decompPkg as unknown as { default?: typeof decompPkg }).default || decompPkg
const SVGPathCommander =
  (SVGPathCommanderPkg as unknown as { default?: typeof SVGPathCommanderPkg })
    .default || SVGPathCommanderPkg

// Set poly-decomp for concave polygon decomposition in Matter.js
if (typeof window !== "undefined" && Common) {
  ;(window as unknown as { decomp: unknown }).decomp = decomp
  Common.setDecomp(decomp)
}

export function calculatePosition(
  value: number | string | undefined,
  containerSize: number,
  elementSize: number
): number {
  if (typeof value === "string" && value.endsWith("%")) {
    const percentage = parseFloat(value) / 100
    return containerSize * percentage
  }
  if (typeof value === "number") {
    return value
  }
  return (containerSize - elementSize) / 2
}

export function parsePathToVertices(path: string, sampleLength = 15) {
  const commander = new SVGPathCommander(path)
  const points: { x: number; y: number }[] = []
  let lastPoint: { x: number; y: number } | null = null
  const totalLength = commander.getTotalLength()
  let length = 0

  while (length < totalLength) {
    const point = commander.getPointAtLength(length)
    if (!lastPoint || point.x !== lastPoint.x || point.y !== lastPoint.y) {
      points.push({ x: point.x, y: point.y })
      lastPoint = point
    }
    length += sampleLength
  }

  const finalPoint = commander.getPointAtLength(totalLength)
  if (
    lastPoint &&
    (finalPoint.x !== lastPoint.x || finalPoint.y !== lastPoint.y)
  ) {
    points.push({ x: finalPoint.x, y: finalPoint.y })
  }

  return points
}

function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms = 300
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined
  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
  debounced.cancel = () => {
    if (timer) clearTimeout(timer)
  }
  return debounced
}

export interface MatterBodyProps {
  children: ReactNode
  matterBodyOptions?: IChamferableBodyDefinition
  isDraggable?: boolean
  bodyType?: "rectangle" | "circle" | "svg"
  sampleLength?: number
  x?: number | string
  y?: number | string
  angle?: number
  className?: string
}

interface PhysicsBody {
  element: HTMLElement
  body: MatterBodyType
  props: MatterBodyProps
  halfWidth: number
  halfHeight: number
}

export interface GravityRef {
  start: () => void
  stop: () => void
  reset: () => void
  scatter: () => void
}

export interface GravityProps {
  children: ReactNode
  debug?: boolean
  gravity?: { x: number; y: number }
  resetOnResize?: boolean
  grabCursor?: boolean
  addTopWall?: boolean
  autoStart?: boolean
  className?: string
}

interface GravityContextValue {
  registerElement: (
    id: string,
    element: HTMLElement,
    props: MatterBodyProps
  ) => void
  unregisterElement: (id: string) => void
  isReady: boolean
}

const GravityContext = createContext<GravityContextValue | null>(null)

export function MatterBody({
  children,
  className,
  matterBodyOptions = {
    friction: 0.2,
    restitution: 0.2,
    density: 0.001,
    isStatic: false,
  },
  bodyType = "rectangle",
  isDraggable = true,
  sampleLength = 15,
  x = 0,
  y = 0,
  angle = 0,
  ...props
}: MatterBodyProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const context = useContext(GravityContext)
  const isReady = context?.isReady ?? false

  useEffect(() => {
    if (!elementRef.current || !context) return
    const activeId = id
    context.registerElement(activeId, elementRef.current, {
      children,
      matterBodyOptions,
      bodyType,
      sampleLength,
      isDraggable,
      x,
      y,
      angle,
      ...props,
    })

    return () => context.unregisterElement(activeId)
  }, [
    props,
    children,
    matterBodyOptions,
    isDraggable,
    bodyType,
    sampleLength,
    x,
    y,
    angle,
    context,
    id,
  ])

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute top-0 left-0 touch-none will-change-transform",
        !isReady
          ? "pointer-events-none opacity-0"
          : "opacity-100 transition-opacity duration-300",
        className,
        isDraggable && "pointer-events-none"
      )}
    >
      {children}
    </div>
  )
}

export const Gravity = forwardRef<GravityRef, GravityProps>(function Gravity(
  {
    children,
    debug = false,
    gravity = { x: 0, y: 1 },
    grabCursor = true,
    resetOnResize = true,
    addTopWall = false,
    autoStart = true,
    className,
    ...props
  },
  ref
) {
  const canvasContainer = useRef<HTMLDivElement>(null)
  const engine = useRef<MatterEngineType | null>(null)
  const render = useRef<MatterRenderType | undefined>(undefined)
  const runner = useRef<MatterRunnerType | undefined>(undefined)

  // Master elements map (preserved across React StrictMode / renderer reinits)
  const elementsMap = useRef(
    new Map<string, { element: HTMLElement; props: MatterBodyProps }>()
  )
  const bodiesMap = useRef(new Map<string, PhysicsBody>())

  const frameId = useRef<number | undefined>(undefined)
  const mouseConstraint = useRef<MatterMouseConstraintType | undefined>(
    undefined
  )
  const mouseDown = useRef(false)
  const [, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isReady, setIsReady] = useState(false)
  const isRunning = useRef(false)

  // Store active cleanup listeners to avoid memory leaks
  const cleanupsRef = useRef<(() => void)[]>([])

  // One-time manual DOM sync
  const syncElements = useCallback(() => {
    bodiesMap.current.forEach(({ element, body, halfWidth, halfHeight }) => {
      const { x: posX, y: posY } = body.position
      const rotation = (body.angle * 180) / Math.PI

      element.style.transform = `translate3d(${
        posX - halfWidth
      }px, ${posY - halfHeight}px, 0px) rotate(${rotation}deg)`
    })
  }, [])

  // Start continuous RAF loop with sleeping optimization
  const startLoop = useCallback(() => {
    if (frameId.current) {
      cancelAnimationFrame(frameId.current)
    }

    const loop = () => {
      bodiesMap.current.forEach(({ element, body, halfWidth, halfHeight }) => {
        if (body.isSleeping) return

        const { x: posX, y: posY } = body.position
        const rotation = (body.angle * 180) / Math.PI

        element.style.transform = `translate3d(${
          posX - halfWidth
        }px, ${posY - halfHeight}px, 0px) rotate(${rotation}deg)`
      })
      frameId.current = requestAnimationFrame(loop)
    }
    frameId.current = requestAnimationFrame(loop)
  }, [])

  // Helper to create a single PhysicsBody instance
  const createPhysicsBody = useCallback(
    (element: HTMLElement, bodyProps: MatterBodyProps): PhysicsBody | null => {
      if (!canvasContainer.current || !engine.current) return null
      const width = element.offsetWidth || 100
      const height = element.offsetHeight || 100
      const halfWidth = width / 2
      const halfHeight = height / 2
      const canvasRect = canvasContainer.current.getBoundingClientRect()
      const containerW =
        canvasRect.width ||
        canvasContainer.current.offsetWidth ||
        (typeof window !== "undefined" ? window.innerWidth : 1200)
      const containerH =
        canvasRect.height ||
        canvasContainer.current.offsetHeight ||
        (typeof window !== "undefined" ? window.innerHeight : 800)

      const angleRad = ((bodyProps.angle || 0) * Math.PI) / 180
      const posX = calculatePosition(bodyProps.x, containerW, width)
      const posY = calculatePosition(bodyProps.y, containerH, height)

      const { chamfer, ...restOptions } = bodyProps.matterBodyOptions || {}
      const safeOptions: IChamferableBodyDefinition = {
        ...restOptions,
        ...(chamfer ? { chamfer } : {}),
      }

      let body: MatterBodyType | undefined
      if (bodyProps.bodyType === "circle") {
        const radius = Math.max(width, height) / 2
        body = Bodies.circle(posX, posY, radius, {
          ...safeOptions,
          angle: angleRad,
          render: {
            fillStyle: debug ? "#888888" : "#00000000",
            strokeStyle: debug ? "#333333" : "#00000000",
            lineWidth: debug ? 3 : 0,
          },
        })
      } else if (bodyProps.bodyType === "svg") {
        const paths = element.querySelectorAll("path")
        const vertexSets: MatterVectorType[][] = []

        paths.forEach((path) => {
          const d = path.getAttribute("d")
          if (d) {
            const p = parsePathToVertices(d, bodyProps.sampleLength)
            vertexSets.push(p)
          }
        })

        if (vertexSets.length > 0) {
          body = Bodies.fromVertices(posX, posY, vertexSets, {
            ...safeOptions,
            angle: angleRad,
            render: {
              fillStyle: debug ? "#888888" : "#00000000",
              strokeStyle: debug ? "#333333" : "#00000000",
              lineWidth: debug ? 3 : 0,
            },
          })
        }
      }

      if (!body) {
        body = Bodies.rectangle(posX, posY, width, height, {
          ...safeOptions,
          angle: angleRad,
          render: {
            fillStyle: debug ? "#888888" : "#00000000",
            strokeStyle: debug ? "#333333" : "#00000000",
            lineWidth: debug ? 3 : 0,
          },
        })
      }

      if (!body) return null

      return {
        element,
        body,
        props: bodyProps,
        halfWidth,
        halfHeight,
      }
    },
    [debug]
  )

  // Register Matter.js body in the physics world
  const registerElement = useCallback(
    (id: string, element: HTMLElement, bodyProps: MatterBodyProps) => {
      elementsMap.current.set(id, { element, props: bodyProps })

      if (engine.current && canvasContainer.current) {
        const existing = bodiesMap.current.get(id)
        if (existing) {
          World.remove(engine.current.world, existing.body)
        }

        const pb = createPhysicsBody(element, bodyProps)
        if (pb) {
          World.add(engine.current.world, [pb.body])
          bodiesMap.current.set(id, pb)

          const { x: posX, y: posY } = pb.body.position
          const rotation = (pb.body.angle * 180) / Math.PI
          element.style.transform = `translate3d(${posX - pb.halfWidth}px, ${posY - pb.halfHeight}px, 0px) rotate(${rotation}deg)`
        }
      }
    },
    [createPhysicsBody]
  )

  // Unregister Matter.js body from the physics world
  const unregisterElement = useCallback((id: string) => {
    elementsMap.current.delete(id)
    if (engine.current) {
      const bodyObj = bodiesMap.current.get(id)
      if (bodyObj) {
        World.remove(engine.current.world, bodyObj.body)
        bodiesMap.current.delete(id)
      }
    }
  }, [])

  const startEngine = useCallback(() => {
    if (!engine.current) return
    if (runner.current) {
      runner.current.enabled = true
      Runner.run(runner.current, engine.current)
    }
    if (debug && render.current) {
      Render.run(render.current)
    }
    startLoop()
    isRunning.current = true
  }, [debug, startLoop])

  const stopEngine = useCallback(() => {
    if (!isRunning.current) return

    if (runner.current) {
      Runner.stop(runner.current)
    }
    if (render.current) {
      Render.stop(render.current)
    }
    if (frameId.current) {
      cancelAnimationFrame(frameId.current)
      frameId.current = undefined
    }
    isRunning.current = false
  }, [])

  // Clear the Matter.js world and all event listeners
  const clearRenderer = useCallback(() => {
    setIsReady(false)
    if (frameId.current) {
      cancelAnimationFrame(frameId.current)
      frameId.current = undefined
    }

    cleanupsRef.current.forEach((fn) => fn())
    cleanupsRef.current = []

    if (mouseConstraint.current && engine.current) {
      World.remove(engine.current.world, mouseConstraint.current)
      mouseConstraint.current = undefined
    }

    if (render.current) {
      Mouse.clearSourceEvents(render.current.mouse)
      Render.stop(render.current)
      render.current.canvas?.remove()
      render.current = undefined
    }

    if (runner.current) {
      Runner.stop(runner.current)
      runner.current = undefined
    }

    if (engine.current) {
      Events.off(engine.current, "beforeUpdate", undefined)
      World.clear(engine.current.world, false)
      Engine.clear(engine.current)
      engine.current = null
    }

    bodiesMap.current.clear()
  }, [])

  const initializeRenderer = useCallback(() => {
    if (!canvasContainer.current) return
    if (!engine.current) {
      engine.current = Engine.create({
        enableSleeping: true,
      })
    }

    const rect = canvasContainer.current.getBoundingClientRect()
    const width =
      canvasContainer.current.offsetWidth ||
      rect.width ||
      (typeof window !== "undefined" ? window.innerWidth : 1200)
    const height =
      canvasContainer.current.offsetHeight ||
      rect.height ||
      (typeof window !== "undefined" ? window.innerHeight : 800)

    if (width <= 0 || height <= 0) return

    engine.current.gravity.x = gravity.x
    engine.current.gravity.y = gravity.y

    render.current = Render.create({
      element: canvasContainer.current,
      engine: engine.current,
      options: {
        width,
        height,
        wireframes: false,
        background: "#00000000",
      },
    })

    if (render.current.canvas) {
      render.current.canvas.style.position = "absolute"
      render.current.canvas.style.top = "0"
      render.current.canvas.style.left = "0"
      render.current.canvas.style.width = "100%"
      render.current.canvas.style.height = "100%"
      render.current.canvas.style.pointerEvents = "auto"
      render.current.canvas.style.touchAction = "none"
      render.current.canvas.style.zIndex = "1"
    }

    const mouse = Mouse.create(render.current.canvas)
    mouseConstraint.current = MouseConstraint.create(engine.current, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: debug,
        },
      },
    })

    // Add boundaries (floor, left, right, top)
    const walls = [
      Bodies.rectangle(width / 2, height + 25, width * 2, 50, {
        isStatic: true,
        friction: 0.8,
        render: { visible: debug },
      }),
      Bodies.rectangle(width + 25, height / 2, 50, height * 4, {
        isStatic: true,
        friction: 0.8,
        render: { visible: debug },
      }),
      Bodies.rectangle(-25, height / 2, 50, height * 4, {
        isStatic: true,
        friction: 0.8,
        render: { visible: debug },
      }),
    ]

    if (addTopWall) {
      walls.push(
        Bodies.rectangle(width / 2, -25, width * 2, 50, {
          isStatic: true,
          friction: 0.8,
          render: { visible: debug },
        })
      )
    }

    const touchingMouse = () =>
      mouseConstraint.current && engine.current
        ? Query.point(
            engine.current.world.bodies,
            mouseConstraint.current.mouse.position || { x: 0, y: 0 }
          ).length > 0
        : false

    const container = canvasContainer.current
    if (grabCursor && container) {
      let lastCheck = 0
      const handleBeforeUpdate = () => {
        const now = performance.now()
        if (now - lastCheck < 50) return
        lastCheck = now

        if (!mouseDown.current && !touchingMouse()) {
          container.style.cursor = "default"
        } else if (touchingMouse()) {
          container.style.cursor = mouseDown.current ? "grabbing" : "grab"
        }
      }

      Events.on(engine.current, "beforeUpdate", handleBeforeUpdate)

      const handleDown = () => {
        mouseDown.current = true
        container.style.cursor = touchingMouse() ? "grabbing" : "default"
      }
      const handleUp = () => {
        mouseDown.current = false
        container.style.cursor = touchingMouse() ? "grab" : "default"
      }

      container.addEventListener("mousedown", handleDown)
      container.addEventListener("mouseup", handleUp)
      container.addEventListener("touchstart", handleDown, { passive: true })
      container.addEventListener("touchend", handleUp, { passive: true })

      cleanupsRef.current.push(() => {
        if (engine.current) {
          Events.off(engine.current, "beforeUpdate", handleBeforeUpdate)
        }
        container.removeEventListener("mousedown", handleDown)
        container.removeEventListener("mouseup", handleUp)
        container.removeEventListener("touchstart", handleDown)
        container.removeEventListener("touchend", handleUp)
      })
    }

    World.add(engine.current.world, [mouseConstraint.current, ...walls])

    // Recreate and add all registered element bodies into physics world
    elementsMap.current.forEach(({ element, props }, id) => {
      const pb = createPhysicsBody(element, props)
      if (pb) {
        World.add(engine.current!.world, [pb.body])
        bodiesMap.current.set(id, pb)
      }
    })

    if (render.current) {
      render.current.mouse = mouse
    }
    runner.current = Runner.create()

    if (debug) {
      Render.run(render.current)
    }
    syncElements()
    setIsReady(true)
    runner.current.enabled = false

    if (autoStart) {
      runner.current.enabled = true
      startEngine()
    }
  }, [
    createPhysicsBody,
    syncElements,
    debug,
    autoStart,
    gravity.x,
    gravity.y,
    addTopWall,
    grabCursor,
    startEngine,
  ])

  const handleResize = useCallback(() => {
    if (!canvasContainer.current || !resetOnResize) return

    const rect = canvasContainer.current.getBoundingClientRect()
    const newWidth = canvasContainer.current.offsetWidth || rect.width
    const newHeight = canvasContainer.current.offsetHeight || rect.height
    if (newWidth <= 0 && newHeight <= 0) return

    setCanvasSize({ width: newWidth, height: newHeight })

    clearRenderer()
    initializeRenderer()
  }, [clearRenderer, initializeRenderer, resetOnResize])

  const reset = useCallback(() => {
    stopEngine()
    if (!canvasContainer.current) return
    const rect = canvasContainer.current.getBoundingClientRect()
    const containerW =
      canvasContainer.current.offsetWidth ||
      rect.width ||
      (typeof window !== "undefined" ? window.innerWidth : 1200)
    const containerH =
      canvasContainer.current.offsetHeight ||
      rect.height ||
      (typeof window !== "undefined" ? window.innerHeight : 800)

    bodiesMap.current.forEach((item) => {
      const { element, body, props: bProps } = item
      item.halfWidth = (element.offsetWidth || 100) / 2
      item.halfHeight = (element.offsetHeight || 100) / 2

      Sleeping.set(body, false)
      Body.setAngle(body, ((bProps.angle || 0) * Math.PI) / 180)
      Body.setVelocity(body, { x: 0, y: 0 })
      Body.setAngularVelocity(body, 0)

      const posX = calculatePosition(bProps.x, containerW, element.offsetWidth)
      const posY = calculatePosition(bProps.y, containerH, element.offsetHeight)
      Body.setPosition(body, { x: posX, y: posY })
    })
    syncElements()
    startEngine()
  }, [stopEngine, startEngine, syncElements])

  const scatter = useCallback(() => {
    bodiesMap.current.forEach(({ body }) => {
      Sleeping.set(body, false)
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 30,
        y: -15 - Math.random() * 20,
      })
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3)
    })
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      start: startEngine,
      stop: stopEngine,
      reset,
      scatter,
    }),
    [startEngine, stopEngine, reset, scatter]
  )

  useEffect(() => {
    if (!resetOnResize || !canvasContainer.current) return

    const debouncedResize = debounce(handleResize, 300)
    let resizeObserver: ResizeObserver | null = null

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        debouncedResize()
      })
      resizeObserver.observe(canvasContainer.current)
    } else {
      window.addEventListener("resize", debouncedResize)
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      } else {
        window.removeEventListener("resize", debouncedResize)
      }
      debouncedResize.cancel()
    }
  }, [handleResize, resetOnResize])

  useEffect(() => {
    initializeRenderer()
    return clearRenderer
  }, [initializeRenderer, clearRenderer])

  return (
    <GravityContext.Provider
      value={{ registerElement, unregisterElement, isReady }}
    >
      <div
        ref={canvasContainer}
        className={cn(
          className,
          "absolute top-0 left-0 h-full w-full touch-none overflow-hidden",
          !isReady
            ? "pointer-events-none opacity-0"
            : "opacity-100 transition-opacity duration-300"
        )}
        {...props}
      >
        {children}
      </div>
    </GravityContext.Provider>
  )
})

```
