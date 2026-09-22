import { ArrowUpRight } from "lucide-react"

import { GridContainer } from "@/app/layouts"
import { siteConfig } from "@/shared/config"
import { Badge, ExternalLink } from "@/shared/ui/core"

const STACK_ITEMS = [
  { name: "React 19", label: "UI Engine" },
  { name: "TanStack Start", label: "Routing & SSR" },
  { name: "Tailwind CSS v4", label: "Styling" },
  { name: "TypeScript 5.7+", label: "Type System" },
  { name: "Sanity Studio v5", label: "Headless CMS" },
] as const

export function ColophonHero() {
  // Split stack items into rows of 3
  const stackRow1 = STACK_ITEMS.slice(0, 3)
  const stackRow2 = STACK_ITEMS.slice(3, 5)

  return (
    <>
      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="px-4 md:px-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-wider text-pp-primary uppercase">
              COLOPHON
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="font-mono text-xs text-muted-foreground">
              REV_2026
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="gap-1.5 border-border/80 bg-card/60 font-mono text-[11px] text-muted-foreground"
            >
              <span>OPERATIONAL</span>
            </Badge>
            <Badge
              variant="outline"
              className="hidden border-border/80 bg-card/60 font-mono text-[11px] text-muted-foreground sm:inline-flex"
            >
              <span>EDGE_NETLIFY</span>
            </Badge>
          </div>
        </div>
      </GridContainer>

      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="p-4 md:p-8"
      >
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Colophon
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Technical stack, design tokens, and inspirations behind{" "}
            <span className="font-semibold text-foreground">
              {siteConfig.title}
            </span>
            . An interactive portfolio and UI component sandbox.
          </p>
        </div>
      </GridContainer>

      <GridContainer columns={3} borderBottom={true} showCrosshairs={true}>
        {stackRow1.map((item) => (
          <div key={item.name} className="px-5 py-4 sm:px-6 sm:py-5">
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase">
              {item.label}
            </span>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {item.name}
            </p>
          </div>
        ))}
      </GridContainer>

      {/* Stack Grid — Row 2 (3 columns: 2 items + View Source) */}
      <GridContainer columns={3} borderBottom={true} showCrosshairs={true}>
        {stackRow2.map((item) => (
          <div key={item.name} className="px-5 py-4 sm:px-6 sm:py-5">
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase">
              {item.label}
            </span>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {item.name}
            </p>
          </div>
        ))}

        <ExternalLink
          href={siteConfig.repoUrl}
          utm={{
            source: "byphongphan.com",
            medium: "colophon",
            campaign: "hero",
          }}
          className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-accent/50 sm:px-6 sm:py-5"
        >
          <div>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase">
              Source
            </span>
            <p className="mt-1 text-sm font-semibold text-pp-primary">
              View Source
            </p>
          </div>
          <ArrowUpRight className="size-4 text-pp-primary opacity-60 transition-opacity group-hover:opacity-100" />
        </ExternalLink>
      </GridContainer>
    </>
  )
}
