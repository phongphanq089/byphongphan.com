import { DraftingSectionRow } from "@/app/layouts/drafting-section-row"

import AboutGithubcontributions from "./components/about-github-contributions"
import { AboutHeroSocials } from "./components/about-hero-socials"
import { AboutHeroStory } from "./components/about-hero-story"
import { AboutStickerStack } from "./components/about-sticker-stack"
import { PPPixelBadge } from "./components/pp-pixel-badge"

export interface SectionAboutV2Props {
  className?: string
}

/**
 * Section I: Hero & About (V2)
 *
 * Fully integrated into the 1024px Swiss Drafting Architecture:
 * - Left column (224px): Pixel mark badge PL.1 + "I ABOUT" section header
 * - Center column (528px):
 *   - FIG. 01 // ULTRA EGO CAD framed visual banner
 *   - Name & Role identity headline with live availability status
 *   - Editorial craft philosophy statement with interactive avatar popover
 *   - Tactile audio-enhanced social links and quick action CTAs
 *   - Interactive horizontal sticker deck (stick-it-up)
 *   - GitHub contribution graph
 */
export function SectionAbout({ className }: SectionAboutV2Props) {
  return (
    <DraftingSectionRow
      id="about"
      romanIndex="I"
      title="ABOUT"
      leftSlot={<PPPixelBadge />}
      className={className}
    >
      {/* <AboutHeroBanner /> */}

      {/* 3. Editorial Story & Craft Philosophy */}
      <AboutHeroStory />

      {/* 4. Social Links & Quick Actions */}
      <AboutHeroSocials />

      {/* 5. Horizontal Sticker Deck */}
      <AboutStickerStack />

      {/* 6. GitHub Contributions */}
      <AboutGithubcontributions />
    </DraftingSectionRow>
  )
}

export default SectionAbout
