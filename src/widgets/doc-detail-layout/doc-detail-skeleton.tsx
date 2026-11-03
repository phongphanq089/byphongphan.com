import React from "react"

import { GridContainer } from "@/app/layouts"
import { cn } from "@/shared/lib/utils"
import { Skeleton } from "@/shared/ui/core"

export interface DocDetailSkeletonProps {
  sidebarTitle?: string
  children?: React.ReactNode
  className?: string
  showTocSkeleton?: boolean
}

export function DocDetailSkeleton({
  sidebarTitle = "Navigation",
  children,
  className,
  showTocSkeleton = true,
}: DocDetailSkeletonProps) {
  return (
    <div className="relative w-full">
      {/* ── TOC Minimap Skeleton (Desktop) ── */}
      {showTocSkeleton && (
        <div className="fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 p-4 lg:block">
          <div className="flex flex-col gap-2 rounded-lg border border-border/40 bg-background/80 p-2.5 backdrop-blur-xs">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3 w-18" />
          </div>
        </div>
      )}

      <GridContainer maxWidth="wide" borderBottom={false} className="p-0">
        <div
          className={cn(
            "flex min-h-[calc(100vh-3rem)] w-full flex-col lg:flex-row",
            className
          )}
        >
          {/* ── Left Sidebar Skeleton (Desktop only) ── */}
          <div className="sticky top-12 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col border-r border-border/70 bg-background/50 p-4 lg:flex xl:w-70">
            <div className="flex h-11 items-center justify-between border-b border-border/60 pb-3">
              {sidebarTitle ? (
                <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">
                  {sidebarTitle}
                </span>
              ) : (
                <Skeleton className="h-4 w-28" />
              )}
            </div>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
      </GridContainer>
    </div>
  )
}
