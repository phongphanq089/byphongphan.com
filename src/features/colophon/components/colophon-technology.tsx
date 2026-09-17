import { ArrowUpRight, Cpu } from "lucide-react"

import { ExternalLink } from "@/shared/ui/core"
import { iconComponents } from "@/shared/ui/icons"

import { COLOPHON_TECH_CATEGORIES } from "../colophon-data"

export function ColophonTechnology() {
  return (
    <div className="space-y-10 py-10 sm:py-14">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-wider text-pp-primary uppercase">
            01 / ARCHITECTURE
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Technology
        </h2>
      </div>

      {/* Editorial Narrative (Matching User Reference Image 1) */}
      <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground sm:text-[17px]">
        <p>
          This website is crafted using{" "}
          <ExternalLink
            href="https://react.dev/"
            utm={{
              source: "byphongphan.com",
              medium: "colophon",
              campaign: "editorial",
            }}
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-pp-primary hover:decoration-pp-primary"
          >
            React 19
          </ExternalLink>{" "}
          and{" "}
          <ExternalLink
            href="https://www.typescriptlang.org/"
            utm={{
              source: "byphongphan.com",
              medium: "colophon",
              campaign: "editorial",
            }}
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-pp-primary hover:decoration-pp-primary"
          >
            TypeScript
          </ExternalLink>
          , bundled and served via{" "}
          <ExternalLink
            href="https://vite.dev/"
            utm={{
              source: "byphongphan.com",
              medium: "colophon",
              campaign: "editorial",
            }}
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-pp-primary hover:decoration-pp-primary"
          >
            Vite 8
          </ExternalLink>
          . For type-safe routing, pre-rendering, and SSR capabilities, it
          relies on{" "}
          <ExternalLink
            href="https://tanstack.com/router"
            utm={{
              source: "byphongphan.com",
              medium: "colophon",
              campaign: "editorial",
            }}
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-pp-primary hover:decoration-pp-primary"
          >
            TanStack Router
          </ExternalLink>{" "}
          and{" "}
          <span className="font-medium text-foreground">TanStack Start</span>.
          Production deployments are continuously delivered to{" "}
          <ExternalLink
            href="https://www.netlify.com/"
            utm={{
              source: "byphongphan.com",
              medium: "colophon",
              campaign: "editorial",
            }}
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-pp-primary hover:decoration-pp-primary"
          >
            Netlify Edge
          </ExternalLink>
          , an edge runtime optimized for instant response times and global CDN
          caching.
        </p>

        <p>
          For styling, I opted for{" "}
          <ExternalLink
            href="https://tailwindcss.com/"
            utm={{
              source: "byphongphan.com",
              medium: "colophon",
              campaign: "editorial",
            }}
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-pp-primary hover:decoration-pp-primary"
          >
            Tailwind CSS v4
          </ExternalLink>
          , a utility-first styling engine utilizing modern{" "}
          <span className="font-mono text-xs text-foreground">@theme</span>{" "}
          directives and native CSS variables. Colors are defined within the{" "}
          <span className="font-medium text-foreground">OKLCH</span> color
          space, ensuring uniform perceived lightness across both light and dark
          modes without custom runtime bloat.
        </p>

        <p>
          Application state follows a modular duality: client global state is
          kept lightweight with{" "}
          <ExternalLink
            href="https://zustand-demo.pmnd.rs/"
            utm={{
              source: "byphongphan.com",
              medium: "colophon",
              campaign: "editorial",
            }}
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-pp-primary hover:decoration-pp-primary"
          >
            Zustand
          </ExternalLink>
          , while asynchronous query invalidation and server caching are handled
          by{" "}
          <ExternalLink
            href="https://tanstack.com/query"
            utm={{
              source: "byphongphan.com",
              medium: "colophon",
              campaign: "editorial",
            }}
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-pp-primary hover:decoration-pp-primary"
          >
            TanStack Query v5
          </ExternalLink>
          . Headless content is authored in an embedded{" "}
          <ExternalLink
            href="https://www.sanity.io/"
            utm={{
              source: "byphongphan.com",
              medium: "colophon",
              campaign: "editorial",
            }}
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-pp-primary hover:decoration-pp-primary"
          >
            Sanity Studio v5
          </ExternalLink>{" "}
          backed by a serverless{" "}
          <ExternalLink
            href="https://neon.tech/"
            utm={{
              source: "byphongphan.com",
              medium: "colophon",
              campaign: "editorial",
            }}
            className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:text-pp-primary hover:decoration-pp-primary"
          >
            Neon PostgreSQL
          </ExternalLink>{" "}
          database and{" "}
          <span className="font-medium text-foreground">Drizzle ORM</span>.
        </p>
      </div>

      {/* Structured Category Breakdowns & Interactive Cards */}
      <div className="space-y-8 pt-4">
        {COLOPHON_TECH_CATEGORIES.map((category) => (
          <div key={category.label} className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {category.title}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground/60">
                {category.label}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {category.items.map((item) => {
                const IconComponent = item.icon
                  ? iconComponents[item.icon]
                  : null

                return (
                  <ExternalLink
                    key={item.name}
                    href={item.link}
                    utm={{
                      source: "byphongphan.com",
                      medium: "colophon",
                      campaign: "tech_stack",
                    }}
                    className="group relative flex h-full flex-col justify-between rounded-lg border border-border/60 bg-card/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-pp-primary/60 hover:bg-accent hover:shadow-[0_4px_16px_rgba(220,38,38,0.1)]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background text-foreground transition-transform duration-200 group-hover:scale-105 group-hover:text-pp-primary">
                        {IconComponent ? (
                          <IconComponent className="size-5" />
                        ) : (
                          <Cpu className="size-5 text-muted-foreground" />
                        )}
                      </div>

                      {item.version && (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {item.version}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 space-y-1">
                      <div className="flex items-center gap-1 text-sm font-semibold text-foreground group-hover:text-pp-primary">
                        <span>{item.name}</span>
                        <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="text-xs leading-snug text-muted-foreground">
                        {item.role}
                      </p>
                    </div>
                  </ExternalLink>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
