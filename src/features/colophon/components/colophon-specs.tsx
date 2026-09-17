import { ArrowUpRight, Terminal } from "lucide-react"

import { COLOPHON_SYSTEM_SPECS } from "../colophon-data"

export function ColophonSpecs() {
  return (
    <div className="space-y-8 py-10 sm:py-14">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-wider text-pp-primary uppercase">
            04 / TECHNICAL MANIFEST
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          System Specifications
        </h2>
      </div>

      <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
        Hardware, build environment metrics, and source repository details
        powering this installation.
      </p>

      {/* Specifications Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {COLOPHON_SYSTEM_SPECS.map((group) => (
          <div
            key={group.category}
            className="flex flex-col justify-between rounded-lg border border-border/60 bg-card/40 p-5"
          >
            <div>
              <div className="flex items-center gap-2 border-b border-border/40 pb-2.5">
                <Terminal className="size-3.5 text-pp-primary" />
                <h3 className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {group.category}
                </h3>
              </div>

              <dl className="mt-4 space-y-3">
                {group.specs.map((spec) => (
                  <div key={spec.property} className="space-y-0.5">
                    <dt className="font-mono text-[11px] text-muted-foreground/70">
                      {spec.property}
                    </dt>
                    <dd className="flex items-center justify-between text-xs font-medium text-foreground">
                      {spec.link ? (
                        <a
                          href={spec.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-pp-primary hover:underline"
                        >
                          <span className="truncate">{spec.value}</span>
                          <ArrowUpRight className="size-3 shrink-0" />
                        </a>
                      ) : (
                        <span>{spec.value}</span>
                      )}
                      {spec.note && (
                        <span className="font-mono text-[10px] text-muted-foreground/60">
                          {spec.note}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
