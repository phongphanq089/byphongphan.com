import { Riffle } from "@lucasmarkes/hairline/react"

import { GridContainer } from "@/app/layouts"
import { SectionHeading } from "@/shared/ui/system/section-heading"

export const SectionBlog = () => {
  return (
    <section>
      <GridContainer borderTop className="relative p-0" showCrosshairs={false}>
        <SectionHeading id="#blog" heading="Blog" />
      </GridContainer>

      <GridContainer
        showCrosshairs={false}
        className="flex flex-col items-center justify-center p-4 text-center sm:p-6 md:p-8"
      >
        <Riffle style={{ width: 400 }} label="Coming soon" />

        <h3 className="text-lg font-bold text-foreground sm:text-xl">
          Coming soon
        </h3>

        <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
          We’re currently building for this blog. Check back soon!
        </p>
      </GridContainer>
    </section>
  )
}
