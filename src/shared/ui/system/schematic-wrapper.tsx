import React, { useEffect, useRef, useState } from "react"

import { cn } from "@/shared/lib/utils"

export interface SchematicWrapperRenderProps {
  isSchematicActive: boolean
  dimensions: {
    width: number
    height: number
  }
}

export interface SchematicWrapperProps {
  children:
    React.ReactNode | ((props: SchematicWrapperRenderProps) => React.ReactNode)
  /** Top horizontal dimension label (e.g. "w-full - max 448"). Defaults to dynamic measured width `w-{width}px` */
  widthLabel?: string
  /** Fallback height if not measured yet (default: 152) */
  defaultHeight?: number
  /** Left vertical dimension label. Defaults to dynamic measured height */
  heightLabel?: string
  /** Bottom technical specifications text (e.g. "p16 - r4 - btn h36 - gap 8") */
  specsLabel?: string
  /** 9-slice padding guideline distance from edges in pixels (default: 16) */
  paddingPx?: number
  /**
   * Explicitly control whether schematic blueprint is visible.
   * If omitted, defaults to active when not hovered, and disappears on hover.
   */
  isSchematicActive?: boolean
  /**
   * Whether to automatically hide the schematic when ancestor `.group` is hovered (default: true).
   */
  groupHover?: boolean
  /** Additional container className */
  className?: string
  /** Additional inner content container className */
  contentClassName?: string
  /** Blueprint frame corner radius in pixels (default: 4) */
  borderRadius?: number
}

/**
 * ============================================================================
 * COMPONENT KHUNG ĐO BLUEPRINT / SCHEMATIC
 * - Mặc định: Hiện thước đo ngang/dọc, 4 chấm vuông xanh ở góc, 4 đường nét đứt
 *   chạy xuyên suốt 4 cạnh, thông số đáy và nút bấm sọc chéo.
 * - Khi Hover vào Card: Toàn bộ thước đo biến mất, chuyển sang UI thật.
 * ============================================================================
 */
export function SchematicWrapper({
  children,
  widthLabel,
  defaultHeight = 152,
  heightLabel,
  specsLabel = "p16 - r4 - btn h36 - gap 8",
  paddingPx = 16,
  isSchematicActive,
  groupHover = true,
  className,
  contentClassName,
  borderRadius = 4,
}: SchematicWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({
    width: 388,
    height: defaultHeight,
  })
  const [isHovered, setIsHovered] = useState(false)

  // Measure dynamic dimensions of the target container
  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === "undefined") return

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { offsetWidth, offsetHeight } = entry.target as HTMLElement
        if (offsetWidth > 0 && offsetHeight > 0) {
          setDimensions({
            width: Math.round(offsetWidth),
            height: Math.round(offsetHeight),
          })
        }
      }
    })

    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Resolve whether blueprint mode is active:
  // If explicitly controlled via prop, respect it; otherwise active when not hovered.
  const effectiveActive =
    isSchematicActive !== undefined ? isSchematicActive : !isHovered

  const renderProps: SchematicWrapperRenderProps = {
    isSchematicActive: effectiveActive,
    dimensions,
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative mx-auto flex w-full max-w-[360px] items-center justify-center pt-7 pr-4 pb-7 pl-10 select-none sm:max-w-[388px]",
        className
      )}
    >
      <div
        ref={containerRef}
        className={cn("relative z-10 w-full", contentClassName)}
      >
        {/* 1. THƯỚC ĐO CHIỀU NGANG PHÍA TRÊN */}
        <div
          className={cn(
            "pointer-events-none absolute -top-7 right-0 left-0 flex flex-col items-center",
            "font-mono text-[11px] tracking-tight text-zinc-400 dark:text-zinc-400",
            "transition-all duration-200 ease-out",
            effectiveActive
              ? "translate-y-0 opacity-100"
              : "translate-y-1 opacity-0",
            groupHover && "group-hover:translate-y-1 group-hover:opacity-0"
          )}
        >
          <span className="mb-1 text-[10.5px] leading-none text-zinc-400">
            {widthLabel || `w-full - max ${dimensions.width}`}
          </span>
          <div className="flex w-full items-center">
            <span className="h-2.5 w-[1px] bg-zinc-600" />
            <span className="h-[1px] flex-1 bg-zinc-700" />
            <span className="h-2.5 w-[1px] bg-zinc-600" />
          </div>
        </div>

        {/* 2. THƯỚC ĐO CHIỀU DỌC BÊN TRÁI */}
        <div
          className={cn(
            "pointer-events-none absolute top-0 bottom-0 -left-10 flex items-center",
            "font-mono text-[11px] text-zinc-400 dark:text-zinc-400",
            "transition-all duration-200 ease-out",
            effectiveActive
              ? "translate-x-0 opacity-100"
              : "translate-x-1 opacity-0",
            groupHover && "group-hover:translate-x-1 group-hover:opacity-0"
          )}
        >
          <span className="mr-2 text-[10.5px] leading-none text-zinc-400">
            {heightLabel || dimensions.height || defaultHeight}
          </span>
          <div className="flex h-full flex-col items-center">
            <span className="h-[1px] w-2.5 bg-zinc-600" />
            <span className="w-[1px] flex-1 bg-zinc-700" />
            <span className="h-[1px] w-2.5 bg-zinc-600" />
          </div>
        </div>

        {/* 3. VÙNG CHỨA COMPONENT THỰC TẾ + LỚP PHỦ BLUEPRINT */}
        <div className="relative z-10 w-full">
          {typeof children === "function" ? children(renderProps) : children}

          {/* LỚP BLUEPRINT OVERLAY */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-20",
              "transition-opacity duration-200 ease-out",
              effectiveActive ? "opacity-100" : "opacity-0",
              groupHover && "group-hover:opacity-0"
            )}
          >
            {/* Viền khung blueprint */}
            <div
              className="absolute inset-0 border border-[#688ce8]/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
              style={{ borderRadius: `${borderRadius}px` }}
            />

            {/* 4 Điểm neo hình vuông màu xanh ở 4 góc */}
            <span className="absolute -top-[3.5px] -left-[3.5px] size-[7px] border border-[#5b8bf7] bg-[#141824]" />
            <span className="absolute -top-[3.5px] -right-[3.5px] size-[7px] border border-[#5b8bf7] bg-[#141824]" />
            <span className="absolute -bottom-[3.5px] -left-[3.5px] size-[7px] border border-[#5b8bf7] bg-[#141824]" />
            <span className="absolute -right-[3.5px] -bottom-[3.5px] size-[7px] border border-[#5b8bf7] bg-[#141824]" />

            {/* 4 Đường gióng nét đứt (9-slice padding guidelines) */}
            <div
              className="absolute right-0 left-0 border-t border-dashed border-[#5b8bf7]/35"
              style={{ top: `${paddingPx}px` }}
            />
            <div
              className="absolute right-0 left-0 border-b border-dashed border-[#5b8bf7]/35"
              style={{ bottom: `${paddingPx}px` }}
            />
            <div
              className="absolute top-0 bottom-0 border-l border-dashed border-[#5b8bf7]/35"
              style={{ left: `${paddingPx}px` }}
            />
            <div
              className="absolute top-0 bottom-0 border-r border-dashed border-[#5b8bf7]/35"
              style={{ right: `${paddingPx}px` }}
            />
          </div>
        </div>

        {/* 4. THÔNG SỐ SPECS PHÍA DƯỚI CẠNH TRÁI */}
        {specsLabel && (
          <div
            className={cn(
              "pointer-events-none absolute right-0 -bottom-6 left-0 text-left",
              "font-mono text-[10.5px] tracking-tight text-zinc-400 dark:text-zinc-400",
              "transition-all duration-200 ease-out",
              effectiveActive
                ? "-translate-y-0 opacity-100"
                : "-translate-y-1 opacity-0",
              groupHover && "group-hover:-translate-y-1 group-hover:opacity-0"
            )}
          >
            {specsLabel}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Nút bấm schematic sọc chéo theo chuẩn bản vẽ kỹ thuật blueprint.
 * Khi active / hover chuyển sang giao diện nút bấm thực tế.
 */
export interface SchematicStripedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  label?: string
  className?: string
}

export function SchematicStripedButton({
  active = false,
  label = "Action",
  className,
  children,
  ...props
}: SchematicStripedButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex h-9 items-center justify-center rounded px-4 font-mono text-xs font-medium transition-all duration-200 select-none",
        active
          ? "bg-primary text-primary-foreground shadow-xs"
          : "border border-[#5b8bf7]/50 bg-[repeating-linear-gradient(45deg,rgba(91,139,247,0.18)_0,rgba(91,139,247,0.18)_2px,transparent_2px,transparent_6px)] text-zinc-300",
        className
      )}
      {...props}
    >
      {children || label}
    </button>
  )
}

export default SchematicWrapper
