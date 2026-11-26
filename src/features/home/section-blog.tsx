import { Riffle } from "@lucasmarkes/hairline/react"
import React from "react"

import { DraftingSectionRow } from "@/app/layouts/drafting-section-row"

export interface SectionBlogProps {
  className?: string
}

/**
 * Section VI: Writing / Blog
 *
 * Implements a clean, compact coming soon state within the 1024px Swiss Drafting Architecture:
 * - Roman Numeral: VI
 * - Title: WRITING
 * - Interactive hairline figure: Riffle by Lucas Markes
 * - Clean, minimal framed CAD container
 */
export function SectionBlog({ className }: SectionBlogProps) {
  return (
    <DraftingSectionRow
      id="blog"
      romanIndex="VI"
      title="WRITING"
      className={className}
    >
      <div className="relative flex w-full flex-col border-t border-border/70 bg-transparent py-5 select-none">
        {/* Center Lucas Markes Interactive Riffle Graphic */}
        <div className="flex w-full items-center justify-center py-4">
          <Riffle
            className="w-full max-w-[240px] sm:max-w-[280px]"
            intensity={0.6}
            label="Coming soon - Technical Essays"
          />
        </div>

        <div className="space-y-1.5 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-transparent px-2.5 py-0.5 font-mono text-[9px] text-muted-foreground uppercase">
            <span>Coming soon</span>
          </div>

          <h3 className="font-mono text-sm font-semibold tracking-wide text-foreground uppercase sm:text-base">
            Engineering Notes &amp; Thoughts
          </h3>

          <p className="mx-auto max-w-sm text-xs leading-relaxed text-muted-foreground">
            Essays on frontend craft, interactive graphics, shaders, and web
            performance patterns are currently in progress.
          </p>
        </div>
      </div>
    </DraftingSectionRow>
  )
}

export default SectionBlog
