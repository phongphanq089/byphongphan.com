import React from "react"

import { BLOCKS_DATA } from "@/features/blocks/blocks-data"
import { BlockCard } from "@/features/blocks/components/block-card"
import { cn } from "@/shared/lib/utils"
import { SectionHeading } from "@/shared/ui/system/section-heading"

export const SectionBlocks = () => {
  // Select 2 featured / top blocks for clean 2-column layout
  const featuredBlocks = BLOCKS_DATA.slice(0, 2)

  return (
    <section
      id="blocks"
      className="relative flex w-full flex-col bg-background text-foreground"
    >
      <div className="-mt-px border-y border-border">
        <SectionHeading
          id="blocks"
          heading="Production Blocks"
          count={BLOCKS_DATA.length}
          actionHref="/blocks"
          actionLabel="All blocks"
        />
      </div>

      {/* 2-Column Grid of Featured Blocks */}
      <div className="grid w-full grid-cols-1 border-b border-border md:grid-cols-2">
        {featuredBlocks.map((block, idx) => (
          <div
            key={block.id}
            className={cn(
              "flex h-full w-full p-4 sm:p-5 md:p-6",
              idx === 0 && "border-b border-border md:border-r md:border-b-0"
            )}
          >
            <BlockCard block={block} />
          </div>
        ))}
      </div>
    </section>
  )
}
