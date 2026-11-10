import React from "react"

import { ComponentCard } from "@/features/component-ui/components/component-card"
import { COMPONENTS_DATA } from "@/features/component-ui/components-data"
import { cn } from "@/shared/lib/utils"
import { SectionHeading } from "@/shared/ui/system/section-heading"

const UiComponentsSection = () => {
  // Select 6 top components
  const row1 = COMPONENTS_DATA.slice(0, 3)
  const row2 = COMPONENTS_DATA.slice(3, 6)

  return (
    <section
      id="components-ui"
      className="relative flex w-full flex-col bg-background text-foreground"
    >
      <div className="-mt-px border-y border-border">
        <SectionHeading
          id="components-ui"
          heading="UI Primitives"
          count={COMPONENTS_DATA.length}
          actionHref="/component-ui"
          actionLabel="All components"
        />
      </div>

      {/* Row 1: 3-Column Grid */}
      <div className="grid w-full grid-cols-1 border-b border-border md:grid-cols-3">
        {row1.map((comp, idx) => (
          <div
            key={comp.id}
            className={cn(
              "flex h-full w-full p-4 sm:p-5 md:p-5 lg:p-6",
              idx < 2 && "border-b border-border md:border-r md:border-b-0",
              idx === 2 && "border-b border-border md:border-b-0"
            )}
          >
            <ComponentCard component={comp} />
          </div>
        ))}
      </div>

      {/* Row 2: 3-Column Grid */}
      {row2.length > 0 && (
        <div className="grid w-full grid-cols-1 border-b border-border md:grid-cols-3">
          {row2.map((comp, idx) => (
            <div
              key={comp.id}
              className={cn(
                "flex h-full w-full p-4 sm:p-5 md:p-5 lg:p-6",
                idx < 2 && "border-b border-border md:border-r md:border-b-0",
                idx === 2 && "border-b border-border md:border-b-0"
              )}
            >
              <ComponentCard component={comp} />
            </div>
          ))}
          {row2.length === 2 && (
            <div className="hidden h-full w-full items-center justify-center p-4 sm:p-5 md:p-5 lg:flex lg:p-6">
              <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
                <span className="text-[10px] tracking-widest text-muted-foreground/40 uppercase">
                  More Primitives Coming Soon
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default UiComponentsSection
