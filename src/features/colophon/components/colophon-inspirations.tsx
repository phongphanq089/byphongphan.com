import { ArrowUpRight } from "lucide-react"

import { GridContainer } from "@/app/layouts"
import { siteConfig } from "@/shared/config"
import { ExternalLink } from "@/shared/ui/core"

export function ColophonInspirations() {
  const inspirations = siteConfig.inspirations
  const rows: { name: string; href: string }[][] = []
  for (let i = 0; i < inspirations.length; i += 2) {
    const row: { name: string; href: string }[] = [inspirations[i]]
    if (i + 1 < inspirations.length) row.push(inspirations[i + 1])
    rows.push(row)
  }

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
              03 / INFLUENCES &amp; CREDITS
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Inspirations
            </h2>
          </div>

          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
            Design sources and references that influenced this website, in no
            particular order.
          </p>
        </div>
      </GridContainer>

      {/* Inspiration Rows — 2 columns per row */}
      {rows.map((row, rowIndex) => (
        <GridContainer
          key={rowIndex}
          columns={2}
          borderBottom={true}
          showCrosshairs={rowIndex === rows.length - 1}
        >
          {row.map((item) => (
            <ExternalLink
              key={item.name}
              href={item.href}
              utm={{
                source: "byphongphan.com",
                medium: "colophon",
                campaign: "inspirations",
              }}
              className="group flex items-center justify-between px-5 py-4 transition-colors duration-150 hover:bg-accent/50 sm:px-6"
            >
              <span className="text-base font-semibold text-foreground transition-colors group-hover:text-pp-primary">
                {item.name}
              </span>

              <div className="flex items-center gap-1.5 text-muted-foreground transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-pp-primary">
                <ArrowUpRight className="size-4" />
              </div>
            </ExternalLink>
          ))}
        </GridContainer>
      ))}
    </>
  )
}
