import React from "react"

import { cn } from "@/shared/lib/utils"

export type BlueprintLintMarkSize = "sm" | "md" | "lg" | "xl" | "full"

export interface BlueprintLintMarkProps {
  /** Text shown in the bottom cutout (default: "lint") */
  text?: string
  /** Link url if used as navigation (default: undefined) */
  href?: string
  /** Explicit custom width: number (px) or CSS string (e.g. 180, "200px", "100%") */
  width?: number | string
  /** Explicit custom height: number (px) or CSS string (e.g. 140, "150px") */
  height?: number | string
  /** Size preset (used when width/height are not set) */
  size?: BlueprintLintMarkSize
  className?: string
  containerClassName?: string
  style?: React.CSSProperties
  /** Always active/glowing state */
  isStaticActive?: boolean
  onClick?: () => void
}

const sizeConfig: Record<
  BlueprintLintMarkSize,
  { container: string; text: string }
> = {
  sm: {
    container: "h-[75px] w-[95px]",
    text: "text-xs",
  },
  md: {
    container: "h-[105px] w-[135px]",
    text: "text-base",
  },
  lg: {
    container: "h-[130px] w-[170px]",
    text: "text-xl",
  },
  xl: {
    container: "h-[180px] w-[240px]",
    text: "text-2xl",
  },
  full: {
    container: "w-full h-full min-h-[70px] min-w-[90px]",
    text: "text-[clamp(11px,1.2rem,28px)]",
  },
}

/**
 * Responsive & Scalable Blueprint Grid "P" / "Lint" Component
 * Features:
 * - Direct `width` and `height` prop support
 * - Top & Bottom border closure
 * - Proportional grid scaling without layout breaking
 */
export function BlueprintLintMark({
  text = "lint",
  href,
  width,
  height,
  size = "lg",
  className,
  containerClassName,
  style,
  isStaticActive = false,
  onClick,
}: BlueprintLintMarkProps) {
  const Component = href ? "a" : "div"
  const currentSize = sizeConfig[size] ?? sizeConfig.lg

  // Calculate inline styles if custom width/height is passed
  const containerStyle: React.CSSProperties = {
    ...(width !== undefined
      ? {
          width: typeof width === "number" ? `${width}px` : width,
          height:
            height !== undefined
              ? typeof height === "number"
                ? `${height}px`
                : height
              : typeof width === "number"
                ? `${Math.round(width * 0.77)}px`
                : "auto",
        }
      : height !== undefined
        ? {
            height: typeof height === "number" ? `${height}px` : height,
            width:
              typeof height === "number"
                ? `${Math.round(height * 1.3)}px`
                : "auto",
          }
        : {}),
    ...style,
  }

  return (
    <div
      style={containerStyle}
      className={cn(
        "relative inline-flex items-center justify-center select-none",
        width === undefined && height === undefined && currentSize.container,
        containerClassName
      )}
    >
      <Component
        href={href}
        onClick={onClick}
        className={cn(
          "group relative flex h-full w-full flex-col items-start gap-[2px] overflow-hidden border-r font-bold tracking-tighter transition-colors select-none",
          "border-zinc-200 text-zinc-400 hover:border-r-0 hover:border-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:border-zinc-200 dark:hover:text-cyan-400",
          isStaticActive &&
            "border-r-0 border-zinc-900 text-zinc-600 dark:border-zinc-200 dark:text-white",
          className
        )}
      >
        <div className="absolute inset-0 grid h-full w-full grid-cols-12 gap-[2px]">
          <div
            className={cn(
              "relative col-span-2 h-full border-x border-b border-zinc-200 transition-colors group-hover:border-zinc-900 dark:border-white/20 dark:group-hover:border-zinc-200",
              isStaticActive && "border-zinc-900 dark:border-zinc-200"
            )}
          >
            {/* Fluid Text Label: Sticks directly to the right of Col 1, at the bottom */}
            <span
              className={cn(
                "absolute bottom-0 left-[115%] z-20 text-[10px]! font-bold tracking-tight whitespace-nowrap text-zinc-400 transition-colors group-hover:text-zinc-600 dark:text-white/40 dark:group-hover:text-white",
                currentSize.text,
                isStaticActive && "text-zinc-600 dark:text-white"
              )}
            >
              {text}
            </span>
          </div>

          {/* Column 3-4: Inner Loop Hole with Glowing Core (69% Height) */}
          <div
            className={cn(
              "relative col-span-2 h-[69%] border-x border-zinc-200 transition-colors group-hover:border-zinc-900 dark:border-white/20 dark:group-hover:border-zinc-200",
              isStaticActive && "border-zinc-900 dark:border-zinc-200"
            )}
          >
            {/* Core Box (Dim Gray -> Glowing Solid on Hover) */}
            <div
              className={cn(
                "absolute top-[48%] left-0 z-10 h-[28%] w-full -translate-y-1/2 bg-zinc-200 transition-colors group-hover:bg-zinc-900 dark:bg-white/20 dark:group-hover:bg-white",
                isStaticActive && "bg-zinc-900 dark:bg-white"
              )}
            />
          </div>

          {/* Column 5-6: Right Wall of "P" (69% Height) */}
          <div
            className={cn(
              "col-span-2 h-[69%] border-x border-zinc-200 transition-colors group-hover:border-zinc-900 dark:border-white/20 dark:group-hover:border-zinc-200",
              isStaticActive && "border-zinc-900 dark:border-zinc-200"
            )}
          />

          {/* Column 7-12: Extended Right Grid Track (69% Height) */}
          <div
            className={cn(
              "col-span-6 h-[69%] border-l border-zinc-200 transition-colors group-hover:border-zinc-900 dark:border-white/20 dark:group-hover:border-zinc-200",
              isStaticActive && "border-zinc-900 dark:border-zinc-200"
            )}
          />
        </div>

        {/* ─── 4 Proportional Horizontal Grid Bands (Sum = 100%) ─── */}
        {/* Row 1: Top horizontal band with border-y (23% height) */}
        <div
          className={cn(
            "h-[23%] w-full border-y border-zinc-200 transition-all group-hover:w-[51%] group-hover:border-zinc-900 dark:border-white/20 dark:group-hover:border-zinc-200",
            isStaticActive && "w-[51%] border-zinc-900 dark:border-zinc-200"
          )}
        />

        {/* Row 2: Middle horizontal band with border-y (23% height) */}
        <div
          className={cn(
            "h-[23%] w-full border-y border-zinc-200 transition-all group-hover:w-[51%] group-hover:border-zinc-900 dark:border-white/20 dark:group-hover:border-zinc-200",
            isStaticActive && "w-[51%] border-zinc-900 dark:border-zinc-200"
          )}
        />

        {/* Row 3: Lower loop horizontal band with border-y (23% height) */}
        <div
          className={cn(
            "h-[23%] w-full border-y border-zinc-200 transition-all group-hover:w-[51%] group-hover:border-zinc-900 dark:border-white/20 dark:group-hover:border-zinc-200",
            isStaticActive && "w-[51%] border-zinc-900 dark:border-zinc-200"
          )}
        />

        {/* Row 4: Bottom stem horizontal guide with border-y for bottom border (31% height) */}
        <div
          className={cn(
            "relative h-[31%] w-full border-y border-zinc-200 transition-all group-hover:w-[51%] group-hover:border-zinc-900 dark:border-white/20 dark:group-hover:border-zinc-200",
            isStaticActive && "w-[51%] border-zinc-900 dark:border-zinc-200"
          )}
        >
          <div
            className={cn(
              "absolute bottom-0 left-0 hidden h-px w-[30%] transition-colors group-hover:block group-hover:bg-black dark:group-hover:bg-white",
              isStaticActive && "block bg-black dark:bg-white"
            )}
          />
        </div>
      </Component>
    </div>
  )
}

export default BlueprintLintMark
