import { Turntable } from "@lucasmarkes/hairline/react"

import { DraftingSectionRow } from "@/app/layouts/drafting-section-row"

export interface SectionResourcesProps {
  className?: string
}

export function SectionResources({ className }: SectionResourcesProps) {
  return (
    <DraftingSectionRow
      id="resources"
      romanIndex="VII"
      title="RESOURCES"
      className={className}
    >
      <div className="relative flex w-full flex-col border-t border-border/70 bg-transparent py-5 select-none">
        {/* Center Lucas Markes Interactive Turntable Graphic */}
        <div className="flex w-full items-center justify-center py-4">
          <Turntable
            className="w-full max-w-[240px] sm:max-w-[280px]"
            intensity={0.6}
            label="Coming soon - Curated Library"
          />
        </div>

        {/* Description & Headline */}
        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-transparent px-2.5 py-0.5 font-mono text-[9px] text-muted-foreground uppercase">
            <span>Coming soon</span>
          </div>

          <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase sm:text-base">
            Curated Developer Library
          </h3>

          <p className="mx-auto max-w-sm text-xs leading-relaxed text-muted-foreground">
            A hand-picked index of design systems, micro-libraries, typography
            pairings, and developer bookmarks is being curated.
          </p>
        </div>
      </div>
    </DraftingSectionRow>
  )
}

export default SectionResources
