import { Link } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight, BookOpen, Code2, Copy } from "lucide-react"

import { GridContainer } from "@/app/layouts"
import { Button, Skeleton } from "@/shared/ui/core"

export interface ComponentDetailSkeletonProps {
  name?: string
  category?: string
  description?: string
  slug?: string
}

export function ComponentDetailSkeleton({
  name,
  category,
  description,
  slug,
}: ComponentDetailSkeletonProps) {
  return (
    <div className="relative w-full">
      {/* ── TOC Minimap Skeleton (Desktop) ── */}
      <div className="fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 p-4 lg:block">
        <div className="flex flex-col gap-2 rounded-lg border border-border/40 bg-background/80 p-2.5 backdrop-blur-xs">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-18" />
        </div>
      </div>

      {/* ── 1. Overview Header Skeleton ── */}
      <GridContainer
        id="overview"
        borderBottom
        className="relative flex flex-col justify-between gap-6"
      >
        <div className="relative z-10 flex flex-col gap-4 px-4 py-3 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {name ? (
                  <h1 className="section-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                    {name}
                  </h1>
                ) : (
                  <Skeleton className="h-9 w-48 sm:h-12 sm:w-72" />
                )}
                <Skeleton className="h-5 w-12 rounded" />
              </div>

              {description ? (
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {description}
                </p>
              ) : (
                <div className="flex flex-col gap-1.5 pt-1">
                  <Skeleton className="h-4 w-full max-w-xl" />
                  <Skeleton className="h-4 w-3/4 max-w-md" />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex h-7 items-center gap-1.5 rounded-lg border border-border/80 px-2.5 text-xs text-muted-foreground">
                  <BookOpen className="size-3 text-pp-primary opacity-60" />
                  <span>Docs</span>
                </div>
                <div className="flex h-7 items-center gap-1.5 rounded-lg border border-border/80 px-2.5 text-xs text-muted-foreground">
                  <Code2 className="size-3 text-pp-primary opacity-60" />
                  <span>API Reference</span>
                </div>
              </div>
            </div>
          </div>

          {/* CLI Command Box Skeleton */}
          <div className="mt-2 flex h-10 w-full max-w-md items-center justify-between rounded-lg border border-border/80 bg-muted/40 px-3.5 py-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-4 rounded-sm" />
              {slug ? (
                <span className="font-mono text-xs text-muted-foreground">
                  npx shadcn@latest add {slug}
                </span>
              ) : (
                <Skeleton className="h-3.5 w-52" />
              )}
            </div>
            <Skeleton className="size-6 rounded-md" />
          </div>
        </div>

        {/* Sub-bar */}
        <GridContainer
          borderTop
          showCrosshairs={false}
          borderBottom={false}
          borderLeft={false}
          borderRight={false}
          className="relative flex flex-col justify-between gap-4 px-4 py-3 md:px-4"
        >
          <div className="flex items-center justify-between">
            {category ? (
              <Button variant="ghost" asChild>
                <Link to="/component-ui/$category" params={{ category }}>
                  <ArrowLeft className="size-3.5" />
                  <span className="capitalize">{category}</span>
                </Link>
              </Button>
            ) : (
              <Skeleton className="h-8 w-28 rounded-md" />
            )}

            <div className="flex items-center gap-2">
              <div className="flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-xs text-foreground">
                <Copy className="size-3.5" />
                <span>Copy Page</span>
              </div>
              <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-foreground">
                <ArrowLeft className="size-4" />
              </div>
              <div className="flex size-9 items-center justify-center rounded-md bg-secondary text-foreground">
                <ArrowRight className="size-4" />
              </div>
            </div>
          </div>
        </GridContainer>
      </GridContainer>

      {/* ── 2. Component Content (Stage Preview & MDX Documentation) ── */}
      <GridContainer
        id="component-content"
        borderBottom
        showCrosshairs
        className="p-4 lg:p-8"
      >
        <div className="mx-auto w-full space-y-8">
          {/* ComponentStagePreview Skeleton */}
          <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-accent px-2 pb-2 shadow transition-all duration-300 dark:border-white/10">
            {/* Header bar with tabs */}
            <div className="flex h-11 items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-foreground">
                  Preview
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  Code
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="size-7 rounded-md" />
              </div>
            </div>

            <div className="relative flex min-h-[380px] w-full items-center justify-center rounded-lg bg-background p-4 md:p-8">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative flex size-20 items-center justify-center rounded-2xl border">
                  <div className="size-8 animate-pulse rounded-lg border bg-accent" />
                </div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-4 w-full max-w-xl" />
              <Skeleton className="h-4 w-4/5 max-w-lg" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-5 w-28" />
              <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="size-6 rounded-md" />
                </div>
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-3.5 w-full max-w-md" />
                  <Skeleton className="h-3.5 w-3/4 max-w-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </GridContainer>
    </div>
  )
}
