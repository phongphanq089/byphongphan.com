import React from "react"

import { siteConfig } from "@/shared/config"
import { cn } from "@/shared/lib/utils"
import {
  FigmaTextHighlight,
  HighlightWord,
} from "@/shared/ui/animation/figma-text-highlight"

import { NameWithAvatarPopover } from "./name-with-avatar-popover"

export interface AboutHeroStoryProps {
  className?: string
  githubProfileUrl?: string
}

/**
 * Editorial Bio & Craft Philosophy Story
 *
 * Implements the full editorial craft statement from about-story.tsx,
 * featuring interactive Figma-style highlighted keywords, tooltip hints,
 * and an interactive avatar popover on author name.
 */
export function AboutHeroStory({
  className,
  githubProfileUrl = siteConfig.social.github.href,
}: AboutHeroStoryProps) {
  return (
    <div className={cn("space-y-6 pt-8", className)}>
      <FigmaTextHighlight
        className="items-start text-left"
        showDimensions={true}
      >
        <div className="flex flex-col gap-4">
          <div className="text-base leading-relaxed font-normal text-muted-foreground sm:text-lg sm:leading-relaxed md:text-xl md:leading-relaxed">
            <span>Hi, I'm </span>
            <NameWithAvatarPopover />
            <span>. Reimagining how we craft and ship — </span>
            <HighlightWord
              id="clean-components"
              text="Clean Components"
              href="/ui/base"
              hint="view components ↗"
              tooltipVariant="smaug"
              className="font-bold text-foreground"
            />
            <span>, </span>
            <HighlightWord
              id="smooth-motion"
              text="Smooth Motion"
              className="font-semibold text-foreground"
            />
            <span>, and </span>
            <HighlightWord
              id="interfaces"
              text="Interfaces"
              href="/ui/blocks"
              hint="explore blocks ↗"
              tooltipVariant="dori"
              className="font-bold text-foreground"
            />
            <span> that feel </span>
            <span className="font-semibold text-foreground">
              built, not assembled
            </span>
            <span>. 100% free &amp; </span>
            <HighlightWord
              id="open-source"
              text="Open Source"
              href={githubProfileUrl}
              hint="open GitHub ↗"
              tooltipVariant="cora"
              className="font-semibold text-foreground"
            />
            <span> for design engineers and creators.</span> I've seen many UI
            collections, but few that feel truly{" "}
            <HighlightWord
              id="polished"
              text="Polished"
              className="font-medium text-foreground"
            />
            {", "}
            <HighlightWord
              id="thoughtful"
              text="Thoughtful"
              className="font-medium text-foreground"
            />
            {", and "}
            <HighlightWord
              id="tasteful"
              text="Tasteful"
              className="font-medium text-foreground"
            />
            . Many aim to impress quickly, while others feel vibe-coded. Here,
            I'm focused on genuine quality, high-craft details, and purposeful
            motion.
          </div>

          {/* Exploration invitation */}
          <div className="text-base leading-relaxed font-normal text-muted-foreground sm:text-lg sm:leading-relaxed md:text-xl md:leading-relaxed">
            <span>Explore the </span>
            <HighlightWord
              id="components"
              text="Components"
              href="/ui/base"
              hint="browse library ↗"
              tooltipVariant="smaug"
              className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
            />
            <span>. </span>
            <HighlightWord
              id="blocks"
              text="Blocks"
              href="/ui/blocks"
              hint="browse blocks ↗"
              tooltipVariant="sadoc"
              className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
            />
            <span>
              {" "}
              are continuously arriving. Take your time — enjoy the visit.
            </span>
          </div>
        </div>
      </FigmaTextHighlight>
    </div>
  )
}

export default AboutHeroStory
