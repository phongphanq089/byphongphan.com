import { ArrowUpRight } from "lucide-react"

import { siteConfig } from "@/shared/config"

export function ColophonInspirations() {
  return (
    <div className="space-y-10 py-10 sm:py-14">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-wider text-pp-primary uppercase">
            03 / INFLUENCES & CREDITS
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Inspirations
        </h2>
      </div>

      {/* Editorial Narrative (Exact Match to User Reference Image 2) */}
      <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted-foreground sm:text-[17px]">
        <p>
          The design of this website is inspired by various sources I came
          across. Here&apos;s a list of the inspirations that influenced this
          website, in no particular order.
        </p>
      </div>

      {/* 2-Column Grid (Direct Reference Image 2 Wireframe Hierarchy) */}
      <div className="grid grid-cols-1 gap-x-12 gap-y-3 sm:grid-cols-2">
        {siteConfig.inspirations.map((item) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-md border border-transparent px-3 py-2.5 transition-all duration-150 hover:border-border/60 hover:bg-card/60"
          >
            <div className="flex items-baseline gap-2.5">
              <span className="text-base font-semibold text-foreground transition-colors group-hover:text-pp-primary">
                {item.name}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground transition-all duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-pp-primary">
              <ArrowUpRight className="size-4" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
