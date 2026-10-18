import {
  ArrowUpRight,
  Cpu,
  FileCode,
  Globe,
  Layers,
  Shapes,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { GridContainer } from "@/app/layouts"
import { COLOPHON_TECH_CATEGORIES } from "@/content/colophon"
import { StripedPattern } from "@/shared/ui"
import { iconComponents } from "@/shared/ui/icons"
import { ExternalLink } from "@/shared/ui/system"

function getTechFallbackIcon(name: string) {
  if (name.includes("Base UI")) return Layers
  if (name.includes("Shiki")) return FileCode
  if (name.includes("Three.js") || name.includes("Shaders")) return Sparkles
  if (name.includes("Lucide")) return Shapes
  if (name.includes("Netlify")) return Globe
  if (name.includes("Better Auth")) return ShieldCheck
  return Cpu
}

export function ColophonTechnology() {
  return (
    <>
      <GridContainer
        borderBottom={true}
        showCrosshairs={true}
        className="relative px-4 py-2"
      >
        <StripedPattern variant="absolute" />
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Technology
        </h2>
      </GridContainer>

      {COLOPHON_TECH_CATEGORIES.map((category) => {
        const rows: (typeof category.items)[] = []
        for (let i = 0; i < category.items.length; i += 2) {
          rows.push(category.items.slice(i, i + 2))
        }

        return (
          <div key={category.label}>
            <GridContainer
              borderBottom={true}
              showCrosshairs={false}
              className="px-4 md:px-8"
            >
              <div className="flex items-center justify-between py-3">
                <span className="text-xs font-semibold tracking-wider text-foreground uppercase">
                  {category.title}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {category.label}
                </span>
              </div>
            </GridContainer>
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
                  const FallbackIcon = getTechFallbackIcon(item.name)

                  return (
                    <ExternalLink
                      key={item.name}
                      href={item.link}
                      utm={{
                        medium: "colophon",
                        campaign: "tech_stack",
                      }}
                      className="group relative flex h-full min-h-[148px] w-full flex-col items-center justify-center p-5 text-center transition-colors duration-200 hover:bg-accent/50 sm:p-6"
                    >
                      {item.badge && (
                        <span className="absolute top-3 right-3 inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-amber-500 sm:top-3.5 sm:right-3.5 dark:text-amber-400">
                          {item.badge}
                        </span>
                      )}

                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/20 text-foreground transition-all duration-200 group-hover:scale-105 group-hover:border-border group-hover:bg-muted/40 group-hover:text-pp-primary">
                        {IconComponent ? (
                          <IconComponent className="size-5" />
                        ) : (
                          <FallbackIcon className="size-5 text-muted-foreground group-hover:text-pp-primary" />
                        )}
                      </div>

                      <div className="mt-3.5 flex flex-col items-center justify-center space-y-1">
                        <div className="flex items-center justify-center gap-1 text-sm font-semibold text-foreground group-hover:text-pp-primary">
                          <span>{item.name}</span>
                          <ArrowUpRight className="size-3.5 opacity-40 transition-opacity group-hover:opacity-100" />
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
