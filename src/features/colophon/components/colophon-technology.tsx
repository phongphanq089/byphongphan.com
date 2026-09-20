import { ArrowUpRight, Cpu } from "lucide-react"

import { GridContainer } from "@/app/layouts"
import { ExternalLink } from "@/shared/ui/core"
import { iconComponents } from "@/shared/ui/icons"

import { COLOPHON_TECH_CATEGORIES } from "../colophon-data"

export function ColophonTechnology() {
  return (
    <>
      {/* Section Header */}
      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="p-4 md:p-8"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="font-mono text-xs tracking-wider text-pp-primary uppercase">
              01 / ARCHITECTURE
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Technology
            </h2>
          </div>

          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
            Built with React 19 and TypeScript, bundled via Vite 8, routed
            through TanStack Router &amp; Start. Styled with Tailwind CSS v4
            using OKLCH color tokens. Content managed in Sanity Studio v5,
            deployed to Netlify Edge.
          </p>
        </div>
      </GridContainer>

      {COLOPHON_TECH_CATEGORIES.map((category) => {
        const rows: (typeof category.items)[] = []
        for (let i = 0; i < category.items.length; i += 2) {
          rows.push(category.items.slice(i, i + 2))
        }

        return (
          <div key={category.label}>
            {/* Category Label */}
            <GridContainer
              borderBottom={true}
              showCrosshairs={false}
              className="px-4 md:px-8"
            >
              <div className="flex items-center justify-between py-3">
                <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {category.title}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/60">
                  {category.label}
                </span>
              </div>
            </GridContainer>

            {/* Item Rows — 2 columns per row */}
            {rows.map((row, rowIndex) => (
              <GridContainer
                key={rowIndex}
                columns={2}
                borderBottom={true}
                showCrosshairs={
                  rowIndex === rows.length - 1 &&
                  category ===
                    COLOPHON_TECH_CATEGORIES[
                      COLOPHON_TECH_CATEGORIES.length - 1
                    ]
                }
              >
                {row.map((item) => {
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
                      className="group flex h-full flex-col justify-between p-5 transition-colors duration-200 hover:bg-accent/50 sm:p-6"
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
              </GridContainer>
            ))}
          </div>
        )
      })}
    </>
  )
}
