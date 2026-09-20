import { ArrowRight } from "lucide-react"

import {
  PageHero,
  SectionDivider,
  SectionHeading,
  StripedPattern,
  TableOfContents,
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

      {/* 4. TableOfContents (Stepped Chamfer Rail) */}
      <ShowcaseCard
        title="TableOfContents (Stepped Chamfer Rail)"
        description="Fumadocs-inspired 45-degree chamfered tree rail with continuous Framer Motion path animation"
        tag="Navigation"
        className="md:col-span-2"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full max-w-sm rounded-xl border border-border/80 bg-background/90 p-5 shadow-lg dark:bg-black/60">
            <TableOfContents
              items={[
                { id: "demo-prerequisites", title: "Prerequisites", depth: 2 },
                { id: "demo-installation", title: "Installation", depth: 2 },
                { id: "demo-env", title: "Environment Variables", depth: 2 },
                { id: "demo-server", title: "Server Setup", depth: 2 },
                {
                  id: "demo-basic-cfg",
                  title: "Basic Configuration",
                  depth: 3,
                },
                { id: "demo-client", title: "Client Setup", depth: 2 },
                {
                  id: "demo-basic-client",
                  title: "Basic Client Configuration",
                  depth: 3,
                },
                { id: "demo-expo", title: "Expo and React Native", depth: 3 },
                { id: "demo-plugin", title: "Plugin Overview", depth: 3 },
                { id: "demo-next", title: "Next Steps", depth: 2 },
              ]}
              scrollOffset={100}
            />
          </div>

          <div className="flex flex-1 flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 p-5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-foreground">
                High-Craft Stepped Rail Mathematics
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Calculates dynamic SVG coordinate paths based on heading depth:
              level 0 sits at base coordinate X, while level 1 and beyond step
              inwards with clean 45-degree diagonal chamfers (dx = dy).
            </p>
            <div className="grid grid-cols-2 gap-3 text-[11px] sm:grid-cols-4">
              <div className="rounded border border-border/50 bg-background/60 p-2 text-center">
                <span className="text-muted-foreground">Level 0 Rail</span>
                <p className="font-bold text-foreground">X = 14px</p>
              </div>
              <div className="rounded border border-border/50 bg-background/60 p-2 text-center">
                <span className="text-muted-foreground">Level 1 Rail</span>
                <p className="font-bold text-foreground">X = 30px</p>
              </div>
              <div className="rounded border border-border/50 bg-background/60 p-2 text-center">
                <span className="text-muted-foreground">Chamfer Angle</span>
                <p className="font-bold text-emerald-400">45° (dx = dy)</p>
              </div>
              <div className="rounded border border-border/50 bg-background/60 p-2 text-center">
                <span className="text-muted-foreground">Motion Engine</span>
                <p className="font-bold text-pp-primary">Framer Motion</p>
              </div>
            </div>
          </div>
        </div>
      </ShowcaseCard>
    </div>
  )
}
