import React from "react"

import { cn } from "@/shared/lib/utils"
import { useTheme } from "@/shared/providers/theme-provider"

export interface PPPixelMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  color?: string
  variant?: "solid" | "glow" | "outline"
  withBackground?: boolean
  isDowndload?: boolean
  downloadPosition?: "bottom-right" | "top-right" | "bottom-left" | "top-left"
  wrapperClassName?: string
}

export function PPPixelMark({
  size = 48,
  className,
  color = "currentColor",
  variant = "solid",
  withBackground = false,

  isDowndload,
  downloadPosition = "bottom-right",
  wrapperClassName,
  ...props
}: PPPixelMarkProps) {
  const shouldDownload = isDowndload
  const { theme } = useTheme()

  const p1Path =
    "M8,8 H34 V16 H44 V34 H34 V42 H18 V56 H8 Z M18,20 H34 V30 H18 Z"
  const p2Path =
    "M52,8 H78 V16 H88 V34 H78 V42 H62 V56 H52 Z M62,20 H78 V30 H62 Z"

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()

    let isDark = false
    if (theme === "dark") {
      isDark = true
    } else if (theme === "light") {
      isDark = false
    } else if (theme === "system" && typeof window !== "undefined") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    const bgColor = isDark ? "#000" : "#fff"
    const iconColor = isDark ? "#fff" : "#000"

    // 3. Chuỗi SVG chuẩn 640x640: không viền, không bo góc, full nền
    const svgData = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 640 640">
  <path fill="${bgColor}" d="M0 0h640v640H0z"/>
  <g transform="translate(32, 128) scale(6)" fill="${iconColor}" fill-rule="evenodd" clip-rule="evenodd">
    <path d="${p1Path}" />
    <path d="${p2Path}" />
  </g>
</svg>`.trim()

    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `favicon-${isDark ? "dark" : "light"}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const svgContent = (
    <svg
      viewBox="0 0 96 64"
      width={size}
      height={typeof size === "number" ? (size * 64) / 96 : size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "inline-block shrink-0 transition-all duration-300",
        variant === "glow" && "drop-shadow-[0_0_12px_var(--pp-primary)]",
        className
      )}
      {...props}
    >
      {withBackground && (
        <rect
          width="96"
          height="64"
          rx="6"
          className="fill-zinc-950 stroke-border/40"
        />
      )}

      <g>
        <path
          d={p1Path}
          fill={color}
          fillRule="evenodd"
          clipRule="evenodd"
          className={cn(
            variant === "outline"
              ? "fill-transparent stroke-current stroke-2"
              : "fill-current"
          )}
        />
        <path
          d={p2Path}
          fill={color}
          fillRule="evenodd"
          clipRule="evenodd"
          className={cn(
            variant === "outline"
              ? "fill-transparent stroke-current stroke-2"
              : "fill-current"
          )}
        />
      </g>
    </svg>
  )

  if (!shouldDownload) return svgContent

  const positionClasses = {
    "bottom-right": "-bottom-2 -right-2",
    "top-right": "-top-2 -right-2",
    "bottom-left": "-bottom-2 -left-2",
    "top-left": "-top-2 -left-2",
  }[downloadPosition]

  return (
    <div
      className={cn(
        "group relative inline-flex shrink-0 items-center justify-center",
        wrapperClassName
      )}
    >
      {svgContent}

      <button
        type="button"
        onClick={handleDownload}
        title="Favicon (640x640)"
        aria-label="Favicon (640x640)"
        className={cn(
          "absolute z-10 flex items-center justify-center",
          "h-5 w-5 rounded-full border border-border/80",
          "bg-background/90 text-foreground/70 hover:bg-background hover:text-foreground",
          "cursor-pointer shadow-sm backdrop-blur-sm transition-all duration-200",
          "opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-90",
          positionClasses
        )}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3 w-3"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
    </div>
  )
}

export default PPPixelMark
