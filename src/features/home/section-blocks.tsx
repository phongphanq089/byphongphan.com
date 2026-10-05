import React from "react"

import { GridContainer } from "@/app/layouts"
import { BLOCKS_DATA } from "@/features/blocks/blocks-data"
import { BlockCard } from "@/features/blocks/components/block-card"
import { SectionHeading } from "@/shared/ui/system/section-heading"

export const SectionBlocks = () => {
  // Select 2 featured / top blocks for clean 2-column layout
  const featuredBlocks = BLOCKS_DATA.slice(0, 2)

  return (
    <>
      <GridContainer className="p-0" showCrosshairs={false}>
        <SectionHeading
          id="blocks"
          heading="Production Blocks"
          count={BLOCKS_DATA.length}
          actionHref="/blocks"
          actionLabel="All blocks"
        />
      </GridContainer>

      {/* 2-Column Grid of Featured Blocks */}
      <GridContainer
        columns={2}
        borderTop={false}
        borderBottom={true}
        showCrosshairs={true}
        className="w-full"
      >
        {featuredBlocks.map((block, idx) => (
          <div
            key={block.id}
            className={`flex h-full w-full p-4 sm:p-5 md:p-6 ${
              idx === 0 ? "border-b border-border md:border-b-0" : ""
            }`}
          >
            <BlockCard block={block} />
          </div>
        ))}
      </GridContainer>
    </>
  )
}
