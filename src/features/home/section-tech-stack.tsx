import { ArrowUpRight } from "lucide-react"

import { GridContainer } from "@/app/layouts"
import { TECH_STACK } from "@/content"
import { iconComponents } from "@/shared/ui/icons"
import { ExternalLink, SectionHeading } from "@/shared/ui/system"

const SectionTechStack = () => {
  return (
    <section id="tech-stack">
      <GridContainer borderTop className="relative p-0" showCrosshairs={false}>
        <SectionHeading
          id="tech-stack"
          heading="Tech Stack"
          count={TECH_STACK.length}
        />
      </GridContainer>

      {/* Tech Cards Responsive Grid: 4 columns on mobile, no scroll animation */}
      <GridContainer showCrosshairs={false} className="p-3 sm:p-6 md:p-8">
        <div className="grid w-full grid-cols-4 gap-2 sm:grid-cols-4 sm:gap-3.5 md:grid-cols-5 md:gap-4 lg:grid-cols-6 xl:grid-cols-7">
          {TECH_STACK.map((item) => {
            const IconComp = iconComponents[item.icon]
            return (
              <ExternalLink
                key={item.label}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visit ${item.label} official website`}
                utm={{
                  campaign: "tech_stack",
                }}
                className="inline-block"
              >
                <div className="group relative flex flex-col items-center justify-between overflow-hidden rounded-xl border border-border/60 bg-card/60 p-2 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:bg-accent/40 hover:shadow-[0_8px_24px_rgba(220,38,38,0.12)] active:scale-[0.98] sm:p-4 dark:hover:shadow-[0_8px_30px_rgba(255,255,255,0.06)]">
                  {/* Radial ambient glow on hover */}
                  <div className="pointer-events-none absolute -top-10 left-1/2 size-20 -translate-x-1/2 rounded-full bg-primary/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Top card action: external link arrow */}
                  <div className="relative z-10 flex w-full items-center justify-end">
                    <ArrowUpRight className="size-2.5 text-muted-foreground/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary sm:size-3.5" />
                  </div>

                  {/* Icon Area */}
                  <div className="relative z-10 my-1 flex size-8 items-center justify-center sm:my-2 sm:size-12">
                    {IconComp ? (
                      <IconComp
                        size={32}
                        className="size-7 transition-transform duration-300 ease-out group-hover:scale-115 sm:size-10"
                      />
                    ) : null}
                  </div>

                  {/* Label */}
                  <div className="relative z-10 w-full text-center">
                    <span className="block truncate text-[10px] font-semibold tracking-tight text-foreground/90 transition-colors group-hover:text-foreground sm:text-xs">
                      {item.label}
                    </span>
                  </div>
                </div>
              </ExternalLink>
            )
          })}
        </div>
      </GridContainer>
    </section>
  )
}

export default SectionTechStack
