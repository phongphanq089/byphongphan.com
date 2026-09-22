import { ArrowRight } from "lucide-react"

import {
  PageHero,
  SectionDivider,
  SectionHeading,
  StripedPattern,
} from "@/shared/ui/system"

import { ShowcaseCard } from "../components/showcase-card"

export function BlueprintSection() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* 1. StripedPattern Inline & Absolute */}
      <ShowcaseCard
        title="StripedPattern (Scale & Ruler Precision)"
        description="1px precision vector hatching with scale marker mathematics and light/dark tokens"
        tag="System"
      >
        <div className="flex w-full flex-col gap-4">
          {/* Inline variant */}
          <div className="flex items-center gap-3 rounded-md border border-border bg-muted/40 p-3">
            <span className="text-xs text-muted-foreground uppercase">
              Inline Spacer
            </span>
            <StripedPattern className="h-6 rounded-xs" size={8} />
            <span className="text-xs text-muted-foreground">End Pin</span>
          </div>

          {/* Scale size comparisons */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1.5 rounded-md border border-border bg-muted/30 p-2 text-center">
              <span className="text-[10px] text-muted-foreground">
                Dense (size=6)
              </span>
              <div className="h-8 overflow-hidden rounded-xs border border-border/60">
                <StripedPattern size={6} className="h-full w-full" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 rounded-md border border-border bg-muted/30 p-2 text-center">
              <span className="text-[10px] text-muted-foreground">
                Default (size=10)
              </span>
              <div className="h-8 overflow-hidden rounded-xs border border-border/60">
                <StripedPattern size={10} className="h-full w-full" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 rounded-md border border-border bg-muted/30 p-2 text-center">
              <span className="text-[10px] text-muted-foreground">
                Airy (size=16)
              </span>
              <div className="h-8 overflow-hidden rounded-xs border border-border/60">
                <StripedPattern size={16} className="h-full w-full" />
              </div>
            </div>
          </div>

          {/* Absolute variant */}
          <div className="relative flex h-20 w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-card/80 p-4 text-center">
            <StripedPattern
              variant="absolute"
              size={10}
              className="opacity-70 dark:opacity-40"
            />
            <div className="relative z-10">
              <span className="text-xs font-bold tracking-wider text-foreground uppercase">
                Absolute Background Mode
              </span>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Covers entire parent surface (inset-0)
              </p>
            </div>
          </div>
        </div>
      </ShowcaseCard>

      {/* 2. SectionHeading & SectionDivider */}
      <ShowcaseCard
        title="SectionHeading & Divider"
        description="Standardized minimal section header with full absolute blueprint background"
        tag="System"
      >
        <div className="flex w-full flex-col gap-4">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <SectionHeading
              heading="Production Blocks"
              count={13}
              action={
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                >
                  <span>View all</span>
                  <ArrowRight className="size-3" />
                </button>
              }
            />
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <SectionDivider label="Section Divider" />
          </div>
        </div>
      </ShowcaseCard>

      {/* 3. PageHero Component */}
      <ShowcaseCard
        title="PageHero Banner"
        description="Standardized subpage header with radial glow, blueprint stripes, and stats bar"
        tag="Layout"
        className="md:col-span-2"
      >
        <div className="w-full overflow-hidden rounded-xl border border-border bg-background">
          <PageHero
            badge={{ label: "Components & Primitives", pulsingDot: true }}
            count="26 PRIMITIVES"
            title="Pixel-perfect, uniquely crafted."
            description="A comprehensive collection of production-ready, beautifully styled UI primitives built with Tailwind CSS v4."
            stats={[
              { label: "26 PRIMITIVES", highlight: true },
              { label: "3-COLUMN BLUEPRINT" },
              { label: "TAILWIND CSS V4", hideOnMobile: true },
            ]}
          />
        </div>
      </ShowcaseCard>
    </div>
  )
}
