import { Turntable } from "@lucasmarkes/hairline/react"

import { SectionHeading } from "@/shared/ui/system/section-heading"

export const SectionResources = () => {
  return (
    <section
      id="resources"
      className="relative flex w-full flex-col bg-background text-foreground"
    >
      <div className="-mt-px border-y border-border">
        <SectionHeading id="resources" heading="Resources" />
      </div>

      <div className="flex flex-col items-center justify-center border-b border-border p-4 text-center sm:p-6 md:p-8">
        <Turntable
          style={{ width: 400 }}
          label="Coming soon"
          className="-mt-10"
        />

        <h3 className="text-lg font-bold text-foreground sm:text-xl">
          Coming soon
        </h3>

        <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
          We’re currently building for this resources. Check back soon!
        </p>
      </div>
    </section>
  )
}
