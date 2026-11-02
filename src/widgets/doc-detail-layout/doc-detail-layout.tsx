import React from "react"

import { GridContainer } from "@/app/layouts"
import {
  RailScrollScrubber,
  type RailSection,
} from "@/registry/animated/rail-scroll-scrubber"
import { cn } from "@/shared/lib/utils"

export interface DocDetailLayoutProps {
  sidebar: React.ReactNode
  railSections?: RailSection[]
  children: React.ReactNode
  className?: string
  showDesktopSectionMenu?: boolean
}

export function DocDetailLayout({
  sidebar,
  railSections,
  children,
  className,
  showDesktopSectionMenu = true,
}: DocDetailLayoutProps) {
  return (
    <div className="relative w-full">
      {railSections && railSections.length > 0 && (
        <RailScrollScrubber
          sections={railSections}
          accentColor="var(--primary)"
          showDesktopSectionMenu={showDesktopSectionMenu}
        />
      )}

      <GridContainer maxWidth="wide" borderBottom={false} className="p-0">
        <div
          className={cn(
            "flex min-h-[calc(100vh-3rem)] w-full flex-col lg:flex-row",
            className
          )}
        >
          {sidebar}

          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
      </GridContainer>
    </div>
  )
}
