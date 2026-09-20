import { Link } from "@tanstack/react-router"
import { ArrowDownRight, Terminal } from "lucide-react"
import { useEffect, useState } from "react"

import { PPMarkIsometric } from "@/shared/ui"
import TextBurnNeon from "@/shared/ui/animation/text-burn-neon"

export interface UnderConstructionProps {
  pageName: string
  colorTheme?: string
  colorName?: string
  tagline?: string
  disciplines?: string[]
  className?: string
}

export const UnderConstruction = ({
  pageName,
  className = "",
}: UnderConstructionProps) => {
  const [progress, setProgress] = useState(78)

  const [activeLogIndex, setActiveLogIndex] = useState(0)

  const logs = [
    `Compiling schemas for ${pageName.toLowerCase()}...`,
    `Optimizing semantic tokens & typography...`,
    `Calibrating motion physics & audio cues...`,
    `Generating blueprint crosshair overlays...`,
    `Standing by. Module integrity at ${progress}%.`,
  ]

  useEffect(() => {
    const logTimer = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % logs.length)
      setProgress((prev) => (prev >= 98 ? 75 : prev + 3))
    }, 3000)
    return () => clearInterval(logTimer)
  }, [logs.length])

  return (
    <div className={`relative w-full ${className}`}>
      {/* Background Radial Dotted Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:opacity-30" />

      <div className="relative z-10 mx-auto my-4 w-full">
        <div className="group relative mx-auto flex flex-col items-center justify-center">
          {/* Left Floating Typography & Technical Objectives */}
          <div className="relative z-10 mb-6 flex w-full flex-col gap-3 text-[11px] text-muted-foreground/80 md:absolute md:top-20 md:left-0 md:mb-0 md:max-w-xs lg:max-w-sm">
            <div className="flex flex-col select-none">
              <h1 className="text-3xl leading-[0.88] font-black tracking-tighter whitespace-nowrap text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                {pageName.toUpperCase()}
              </h1>
              <TextBurnNeon className="mt-1 text-3xl leading-[0.88] font-black tracking-tighter text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                BUILDING
              </TextBurnNeon>
            </div>

            <div className="mt-3 flex flex-col gap-1.5 rounded-lg border border-border/40 bg-background/60 p-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Terminal className="h-3 w-3 text-primary" />
                  PIPELINE TELEMETRY
                </span>
                <span className="font-bold text-foreground">{progress}%</span>
              </div>

              <div className="h-1 w-full overflow-hidden rounded-full bg-muted/60">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{
                    width: `${progress}%`,
                    boxShadow: "0 0 8px var(--primary)",
                  }}
                />
              </div>

              <span className="truncate text-[9px] text-muted-foreground/70">
                {logs[activeLogIndex]}
              </span>
            </div>
          </div>

          {/* Central 3D Isometric Artwork */}
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
            <PPMarkIsometric />
          </div>
        </div>
      </div>

      {/* Bottom Technical Meta Status Bar */}
      <div className="relative z-10 mt-6 flex items-center justify-between gap-3 border-t border-border/50 pt-4 sm:gap-0 md:pt-8">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <div className="flex flex-col text-left">
            <span className="font-semibold text-foreground">
              {pageName.toUpperCase()} '26
            </span>
            <span className="text-[10px] text-muted-foreground/70">
              EST. DEPLOYMENT: Q3 2026
            </span>
          </div>
        </div>

        <Link
          to="/"
          className="group flex flex-col items-center text-center sm:items-end sm:text-right"
        >
          <div className="flex items-center gap-1.5 text-[10px] tracking-widest text-muted-foreground uppercase transition-colors group-hover:text-primary">
            <span>RETURN TO BASE</span>
            <ArrowDownRight className="h-3 w-3 text-primary transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </div>
          <span className="text-xs font-black tracking-tight text-foreground uppercase transition-colors group-hover:text-primary sm:text-sm">
            EXPLORE RECENT WORK
          </span>
        </Link>
      </div>
    </div>
  )
}
