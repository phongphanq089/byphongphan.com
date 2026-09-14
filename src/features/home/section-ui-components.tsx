import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"

import { GridContainer } from "@/app/layouts"
import { ComponentCard } from "@/features/component-ui/components/component-card"
import { COMPONENTS_DATA } from "@/features/component-ui/components-data"
import { SectionHeading } from "@/shared/ui/system/section-heading"

const UiComponentsSection = () => {
  // Select 6 top components
  const row1 = COMPONENTS_DATA.slice(0, 3)
  const row2 = COMPONENTS_DATA.slice(3, 6)

  return (
    <>
      <GridContainer className="p-0" showCrosshairs={false}>
        <SectionHeading
          id="components-ui"
          heading="UI Primitives"
          action={
            <Link
              to="/component-ui"
              className="group flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:bg-accent/60 hover:text-foreground active:scale-98"
            >
              <span>View all components</span>
              <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          }
        />
      </GridContainer>

      {/* Row 1: 3-Column Grid */}
      <GridContainer
        columns={3}
        borderTop={false}
        borderBottom={true}
        showCrosshairs={true}
        className="w-full"
      >
        {row1.map((comp, idx) => (
          <div
            key={comp.id}
            className={`flex h-full w-full p-4 sm:p-5 md:p-5 lg:p-6 ${
              idx < 2 ? "border-b border-border md:border-b-0" : ""
            }`}
          >
            <ComponentCard component={comp} />
          </div>
        ))}
      </GridContainer>

      {/* Row 2: 3-Column Grid */}
      {row2.length > 0 && (
        <GridContainer
          columns={3}
          borderTop={false}
          borderBottom={true}
          showCrosshairs={true}
          className="w-full"
        >
          {row2.map((comp, idx) => (
            <div
              key={comp.id}
              className={`flex h-full w-full p-4 sm:p-5 md:p-5 lg:p-6 ${
                idx < 2 ? "border-b border-border md:border-b-0" : ""
              }`}
            >
              <ComponentCard component={comp} />
            </div>
          ))}
          {row2.length === 2 && (
            <div className="hidden h-full w-full items-center justify-center p-4 sm:p-5 md:p-5 lg:flex lg:p-6">
              <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground/40 uppercase">
                  More Primitives Coming Soon
                </span>
              </div>
            </div>
          )}
        </GridContainer>
      )}
    </>
  )
}

export default UiComponentsSection
