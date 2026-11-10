import {
  FigmaTextHighlight,
  HighlightWord,
} from "@/shared/ui/animation/figma-text-highlight"

import { NameWithAvatarPopover } from "./name-with-avatar-popover"

export interface AboutStoryProps {
  githubProfileUrl: string
}

export function AboutStory({ githubProfileUrl }: AboutStoryProps) {
  return (
    <FigmaTextHighlight className="items-start text-left" showDimensions={true}>
      <div className="flex flex-col gap-6">
        {/* Main thesis & craft statement */}
        <p className="text-lg leading-relaxed font-normal text-muted-foreground sm:text-xl md:text-2xl md:leading-relaxed">
          <span>Hi, I&apos;m </span>
          <NameWithAvatarPopover />
          <span>. Reimagining how we craft and ship — </span>
          <HighlightWord
            id="clean-components"
            text="Clean Components"
            href="/component-ui"
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
            href="/blocks"
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
          <span> for design engineers and creators.</span> I&apos;ve seen many
          UI collections, but few that feel truly{" "}
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
          I&apos;m focused on genuine quality, high-craft details, and
          purposeful motion.
        </p>

        {/* Exploration invitation */}
        <p className="text-sm font-medium tracking-wide text-muted-foreground sm:text-base">
          <span>Explore the </span>
          <HighlightWord
            id="components"
            text="Components"
            href="/component-ui"
            hint="browse library ↗"
            tooltipVariant="smaug"
            className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
          />
          <span>. </span>
          <HighlightWord
            id="blocks"
            text="Blocks"
            href="/blocks"
            hint="browse blocks ↗"
            tooltipVariant="sadoc"
            className="font-semibold text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
          />
          <span>
            {" "}
            are continuously arriving. Take your time — enjoy the visit.
          </span>
        </p>
      </div>
    </FigmaTextHighlight>
  )
}

export default AboutStory
