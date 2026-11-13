import React from "react"

import { TECH_STACK } from "@/content"
import { cn } from "@/shared/lib/utils"
import { iconComponents } from "@/shared/ui/icons"
import { ExternalLink, SectionHeading } from "@/shared/ui/system"

export interface SectionTechStackProps {
  className?: string
}

export function SectionTechStack({ className }: SectionTechStackProps) {
  return (
    <section
      id="tech-stack"
      className={cn(
        "relative flex w-full flex-col bg-background text-foreground",
        className
      )}
    >
      {/* ── Section Header ── */}
      <div className="border-y border-border">
        <SectionHeading
          id="tech-stack"
          heading="Tech Stack"
          count={TECH_STACK.length}
        />
      </div>

      {/* ── Main Content Area: All Tech Badges ── */}
      <div className="w-full p-4 sm:p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {TECH_STACK.map((item) => {
            const IconComp = iconComponents[item.icon]
            return (
              <ExternalLink
                key={item.label}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                utm={{ campaign: "tech_stack" }}
                title={`Visit ${item.label} official website`}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-lg border border-dashed border-border/80 bg-background/50 px-3 py-1.5 transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-foreground/50 hover:bg-accent/40 active:scale-95"
                )}
              >
                {/* Icon Area */}
                <span className="flex size-4.5 shrink-0 items-center justify-center">
                  {IconComp ? (
                    <IconComp
                      size={18}
                      className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
                    />
                  ) : null}
                </span>

                {/* Tech Label */}
                <span className="text-xs font-medium tracking-tight text-foreground/90 transition-colors group-hover:text-foreground sm:text-[13px]">
                  {item.label}
                </span>
              </ExternalLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SectionTechStack
