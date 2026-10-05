import React from "react"

import { GridContainer } from "@/app/layouts"
import { SectionHeading } from "@/shared/ui/system/section-heading"

export const SectionBlog = () => {
  return (
    <>
      <GridContainer className="p-0" showCrosshairs={false}>
        <SectionHeading
          id="blog"
          heading="Articles & Notes"
          actionHref="/blog"
          actionLabel="All articles"
        />
      </GridContainer>

      {/* 2-Column Grid of Featured Blog Posts */}
      <GridContainer
        columns={2}
        borderTop={false}
        borderBottom={true}
        showCrosshairs={true}
        className="w-full"
      >
        {/* {displayPosts.map((post, idx) => (
          <div
            key={post._id}
            className={`flex h-full w-full ${
              idx === 0 && displayPosts.length > 1
                ? "border-b border-border md:border-r md:border-b-0"
                : ""
            }`}
          >
            <BlogCard post={post} />
          </div>
        ))} */}
        <span></span>
      </GridContainer>
    </>
  )
}
