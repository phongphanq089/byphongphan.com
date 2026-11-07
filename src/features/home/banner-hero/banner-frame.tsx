import { Layers } from "lucide-react"

import { cn } from "@/shared/lib/utils"

import { Actions } from "./actions"
import { Cursor } from "./cursor"
import { PhongPhan3DHeadline } from "./phong-phan-3d-headline"

export interface BannerV2FrameProps {
  subheadline?: string
  className?: string
}

const CORNER_HANDLE_POSITIONS = [
  "-left-1.5 -top-1.5",
  "-right-1.5 -top-1.5",
  "-left-1.5 -bottom-1.5",
  "-right-1.5 -bottom-1.5",
] as const

export function Frame({
  subheadline = "An open-source UI registry and engineering showcase for crafted components and production-ready blocks. Resilient primitives and fluid micro-interactions crafted with intention.",
  className,
}: BannerV2FrameProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative grid place-items-center border border-primary/30 bg-card/40 px-6 py-8 shadow-[0_0_35px_rgba(255,255,255,0.06)] backdrop-blur-[3px] sm:border-2 sm:px-12 sm:py-12 md:py-14">
        {/* Figma Layer Label */}
        <div className="absolute -top-3 left-4 flex items-center gap-1.5 rounded bg-primary px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-primary-foreground uppercase shadow-md sm:left-6 sm:text-[11px]">
          <Layers className="size-2.5" />
          <span>Layer: Creative Engineer</span>
        </div>

        {/* 4 Corner Resize Handles */}
        {CORNER_HANDLE_POSITIONS.map((pos) => (
          <span
            key={pos}
            aria-hidden="true"
            className={cn(
              "absolute size-3 rounded-[2px] bg-background shadow-xs ring-1 ring-primary/50 transition-transform hover:scale-125 sm:ring-2",
              pos
            )}
          />
        ))}

        <div className="flex w-full items-center justify-center">
          <PhongPhan3DHeadline />
        </div>

        <p className="mt-4 w-full max-w-4xl text-sm font-normal text-balance sm:text-base md:text-lg dark:text-white/80">
          {subheadline}
        </p>

        <Actions />
      </div>

      <Cursor name="Phong Phan" />
    </div>
  )
}
