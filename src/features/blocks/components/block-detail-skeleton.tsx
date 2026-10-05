import { Link, useNavigate } from "@tanstack/react-router"
import {
  ArrowLeft,
  ArrowRight,
  Laptop,
  Maximize2,
  RotateCw,
  Smartphone,
  Tablet,
} from "lucide-react"

import { GridContainer } from "@/app/layouts"
import {
  Button,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"

export interface BlockDetailSkeletonProps {
  title?: string
  category?: string
  description?: string
  slug?: string
}

export function BlockDetailSkeleton({
  title,
  category,
  description,
  slug,
}: BlockDetailSkeletonProps) {
  const navigation = useNavigate()
  return (
    <div className="w-full">
      {/* ── 1. Hero Header Skeleton ── */}
      <GridContainer
        borderTop
        borderBottom
        showCrosshairs
        className="relative flex flex-col justify-between gap-6 overflow-hidden px-4 py-8 sm:px-8 md:py-12"
      >
        {/* Ambient Radial Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-pp-primary/10 blur-3xl dark:bg-pp-primary/15" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Title Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                {title ? (
                  <h1 className="section-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                    {title}
                  </h1>
                ) : (
                  <Skeleton className="h-9 w-52 sm:h-12 sm:w-80" />
                )}
                {category ? (
                  <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase">
                    {category}
                  </span>
                ) : (
                  <Skeleton className="h-5 w-20 rounded-full" />
                )}
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
            </div>

            <Button variant="outline" asChild>
              <Link to="/blocks">
                <ArrowLeft className="size-3.5" />
                <span>All Blocks</span>
              </Link>
            </Button>
          </div>

          {/* CLI Install Command Box Skeleton */}
          <div className="mt-2 flex h-10 w-full max-w-xl items-center justify-between rounded-lg border border-border/80 bg-muted/40 px-3.5 py-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-4 rounded-sm" />
              {slug ? (
                <span className="font-mono text-xs text-muted-foreground">
                  npx shadcn@latest add {slug}
                </span>
              ) : (
                <Skeleton className="h-3.5 w-60" />
              )}
            </div>
            <Skeleton className="size-6 rounded-md" />
          </div>
        </div>
      </GridContainer>

      <GridContainer
        borderBottom
        borderTop={false}
        className="flex flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4"
      >
        <Button
          variant="link"
          onClick={() => navigation({ to: `/blocks/${category}` })}
          className="capitalize"
        >
          <ArrowLeft className="size-3.5" />
          <span> {category}</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ArrowLeft className="size-4 opacity-50" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowRight className="size-4 opacity-50" />
          </Button>
        </div>
      </GridContainer>

      {/* ── 2. Interactive Controls Bar Skeleton ── */}
      <GridContainer
        borderBottom
        showCrosshairs
        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8"
      >
        <Tabs defaultValue="Preview">
          <TabsList>
            <TabsTrigger value="Preview">Preview</TabsTrigger>
            <TabsTrigger value="Code">Code</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-muted/30 p-1">
            {(
              [
                { mode: "desktop" as const, icon: Laptop, title: "Desktop" },
                { mode: "tablet" as const, icon: Tablet, title: "Tablet" },
                {
                  mode: "mobile" as const,
                  icon: Smartphone,
                  title: "Mobile",
                },
              ] as const
            ).map(({ mode, icon: Icon, title }) => (
              <Tooltip key={mode}>
                <TooltipTrigger asChild>
                  <Button type="button" size="icon" variant="outline">
                    <Icon className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-[10px]">
                  {title}
                </TooltipContent>
              </Tooltip>
            ))}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"

                  className="size-7"
                >
                  <RotateCw className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px]">
                Reload preview
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"

                  className="size-7"
                >
                  <Maximize2 className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-[10px]">
                Fullscreen
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </GridContainer>

      {/* ── 3. Tab Content (Preview Canvas Area) Skeleton ── */}
      <GridContainer borderBottom showCrosshairs className="p-0">
        <div className="flex w-full items-center justify-center p-3 md:p-4">
          <div className="relative flex min-h-[600px] w-full flex-col justify-between overflow-hidden rounded-md border border-border/60 bg-muted/10 p-6 sm:min-h-[700px] lg:min-h-[800px]">
            <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-border/80" />
                <div className="size-3 rounded-full bg-border/80" />
                <div className="size-3 rounded-full bg-border/80" />
                <Skeleton className="ml-2 h-4 w-20 md:w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-25 rounded-md md:w-20" />
                <Skeleton className="h-7 w-20 rounded-md max-xs:hidden md:w-24" />
              </div>
            </div>

            {/* Center Blueprint Simulation */}
            <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-5 py-12 text-center">
              <Skeleton className="flex size-14 items-center justify-center rounded-2xl text-primary" />
              <Skeleton className="h-8 w-3/4 sm:h-10 sm:w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex items-center gap-3 pt-2">
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-9 w-28 rounded-lg" />
              </div>
            </div>

            {/* Bottom Cards Row Mockup */}
            <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-xl border border-border/40 bg-background/60 p-4"
                >
                  <Skeleton className="size-8 rounded-lg" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </GridContainer>
    </div>
  )
}
