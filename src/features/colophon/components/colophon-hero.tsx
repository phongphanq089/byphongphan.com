import { ArrowUpRight } from "lucide-react"

import { siteConfig } from "@/shared/config"
import { Badge } from "@/shared/ui/core"

export function ColophonHero() {
  return (
    <div className="relative flex flex-col gap-6 py-10 sm:py-16">
      {/* Eyebrow and Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-wider text-pp-primary uppercase">
            // SPECIFICATIONS & COLOPHON
          </span>
          <span className="text-muted-foreground/40">•</span>
          <span className="font-mono text-xs text-muted-foreground">
            REV_2026.04
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="gap-1.5 border-border/80 bg-card/60 font-mono text-[11px] text-muted-foreground"
          >
            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
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

      {/* Main Title & Statement */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Colophon
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          An insight into the architectural foundations, typography, color
          theories, and design inspirations behind{" "}
          <span className="font-semibold text-foreground">
            {siteConfig.title}
          </span>
          . Crafted as an interactive engineering portfolio and production-ready
          UI component sandbox.
        </p>
      </div>

      {/* Technical Spec Ribbon */}
      <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground">
        <span className="font-mono text-[11px] tracking-wider text-muted-foreground/60 uppercase">
          STACK SUMMARY:
        </span>
        <span className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-foreground">
          React 19
        </span>
        <span className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-foreground">
          TanStack Start
        </span>
        <span className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-foreground">
          Tailwind CSS v4
        </span>
        <span className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-foreground">
          TypeScript 5.7+
        </span>
        <span className="rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-foreground">
          Sanity Studio v5
        </span>

        <a
          href={siteConfig.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 font-mono text-[11px] text-pp-primary hover:underline"
        >
          <span>View Source</span>
          <ArrowUpRight className="size-3" />
        </a>
      </div>
    </div>
  )
}
