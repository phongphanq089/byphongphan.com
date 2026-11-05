import React from "react"

import { GridContainer } from "@/app/layouts"
import { cn } from "@/shared/lib/utils"
import { type TOCItemType, TOCMinimap } from "@/shared/ui/system/toc-minimap"

export interface DocDetailLayoutProps {
  sidebar: React.ReactNode
  tocItems?: TOCItemType[]
  /** @deprecated Kept for backward compatibility */
  railSections?: unknown[]
  children: React.ReactNode
  className?: string
  /** @deprecated Kept for backward compatibility */
  showDesktopSectionMenu?: boolean
}

export function DocDetailLayout({
  sidebar,
  tocItems,
  children,
  className,
}: DocDetailLayoutProps) {
  return (
    <div className="relative w-full">
      {tocItems && tocItems.length > 0 && (
        <div className="fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 lg:block">
          <TOCMinimap items={tocItems} />
        </div>
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
