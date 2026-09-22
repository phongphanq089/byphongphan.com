import type {
  ExcalidrawElement,
  NonDeleted,
} from "@excalidraw/excalidraw/element/types"
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types"
import * as React from "react"

import { cn } from "@/shared/lib/utils"

import type { Dimension } from "./types"

interface ExcalidrawImageProps {
  elements: readonly NonDeleted<ExcalidrawElement>[]
  files?: BinaryFiles
  appState?: Partial<AppState>
  imageContainerRef?: React.RefObject<HTMLDivElement | null>
  width?: Dimension
  height?: Dimension
  className?: string
  isDark?: boolean
}

// exportToSvg includes fonts and double-sized width/height that need normalization
const normalizeSvg = (svg: SVGElement) => {
  const styleTag = svg?.firstElementChild?.firstElementChild

  const viewBox = svg.getAttribute("viewBox")
  if (viewBox != null) {
    const viewBoxDimensions = viewBox.split(" ")
    if (viewBoxDimensions.length === 4) {
      svg.setAttribute("width", viewBoxDimensions[2])
      svg.setAttribute("height", viewBoxDimensions[3])
    }
  }

  if (styleTag && styleTag.tagName.toLowerCase() === "style") {
    styleTag.remove()
  }
}

export function ExcalidrawImage({
  elements,
  files = {},
  imageContainerRef,
  appState = {},
  width = "inherit",
  height = "inherit",
  className,
  isDark = false,
}: ExcalidrawImageProps) {
  const [svgHtml, setSvgHtml] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    let isSubscribed = true

    const generateSvg = async () => {
      try {
        if (!elements || elements.length === 0) {
          if (isSubscribed) {
            setSvgHtml("")
            setIsLoading(false)
          }
          return
        }

        setIsLoading(true)
        const { exportToSvg } = await import("@excalidraw/excalidraw")

        // Dynamic background adaptation: default light/dark backgrounds adapt to current theme
        const isDefaultBg =
          !appState.viewBackgroundColor ||
          appState.viewBackgroundColor === "#ffffff" ||
          appState.viewBackgroundColor === "#fff" ||
          appState.viewBackgroundColor === "#121212" ||
          appState.viewBackgroundColor === "#18181b"

        const effectiveBgColor = isDefaultBg
          ? isDark
            ? "#18181b"
            : "#ffffff"
          : appState.viewBackgroundColor

        // Clean & export SVG with active theme awareness
        const svg: SVGElement = await exportToSvg({
          appState: {
            ...appState,
            exportBackground: appState.exportBackground ?? true,
            viewBackgroundColor: effectiveBgColor,
            exportWithDarkMode: isDark,
          } as AppState,
          elements: elements as NonDeleted<ExcalidrawElement>[],
          files: files || {},
        })

        if (!isSubscribed) return

        normalizeSvg(svg)
        svg.setAttribute("display", "block")

        const clone = svg.cloneNode(true) as SVGElement
        clone.classList.add("excalidraw-canvas-svg")
        if (width === "inherit" && height === "inherit") {
          clone.style.maxWidth = "100%"
          clone.style.height = "auto"
          clone.style.display = "block"
          clone.style.margin = "0 auto"
        } else {
          clone.setAttribute("width", "100%")
          clone.setAttribute("height", "100%")
          clone.style.display = "block"
        }

        setSvgHtml(clone.outerHTML)
      } catch (err) {
        console.error("Failed to export Excalidraw drawing to SVG:", err)
      } finally {
        if (isSubscribed) {
          setIsLoading(false)
        }
      }
    }

    void generateSvg()

    return () => {
      isSubscribed = false
    }
  }, [elements, files, appState, width, height, isDark])

  const containerStyle: React.CSSProperties = React.useMemo(() => {
    const style: React.CSSProperties = {}
    if (width !== "inherit") {
      style.width = typeof width === "number" ? `${width}px` : width
    } else {
      style.width = "100%"
    }
    if (height !== "inherit") {
      style.height = typeof height === "number" ? `${height}px` : height
    }
    return style
  }, [width, height])

  return (
    <div
      ref={imageContainerRef}
      className={cn(
        "relative flex min-h-[140px] items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-card/60 p-3 shadow-2xs transition-all",
        className
      )}
      style={containerStyle}
    >
      {isLoading && (
        <div className="backdrop-blur-2xs absolute inset-0 flex items-center justify-center bg-card/50">
          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {svgHtml ? (
        <div
          data-excalidraw-svg-container="true"
          className="pointer-events-none flex h-full w-full items-center justify-center select-none [&>svg]:h-auto [&>svg]:max-w-full [&>svg]:rounded-lg"
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />
      ) : (
        !isLoading && (
          <div className="flex flex-col items-center justify-center py-8 text-xs text-muted-foreground">
            <span>Empty drawing</span>
          </div>
        )
      )}
    </div>
  )
}
