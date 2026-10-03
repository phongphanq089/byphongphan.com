import { Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
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
          action={
            <Link
              to="/blocks"
              className="group flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-foreground/30 hover:bg-accent/60 hover:text-foreground active:scale-98"
            >
              <span>View all blocks</span>
              <ArrowRight className="size-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          }
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
