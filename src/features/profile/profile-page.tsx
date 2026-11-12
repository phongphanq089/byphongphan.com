import { GridContainer } from "@/app/layouts"

import {
  ArcBandsBackground,
  ProfileBio,
  ProfileHero,
  ProfileMusicCard,
  ProfileSocialLinks,
} from "./components"

/**
 * Standalone editorial profile served at `/profile`.
 * Completely header-free: identity, Vietnam live clock and theme toggle
 * are unified directly in the hero block. Centered vertically and horizontally
 * within a single GridContainer over the ArcBandsBackground sunset aurora.
 */
export function ProfilePage() {
  return (
    <ArcBandsBackground className="flex min-h-screen w-full flex-col justify-center px-4 py-8 text-foreground selection:bg-primary/20 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <div className="mx-auto my-auto w-full max-w-4xl">
        <GridContainer
          maxWidth="full"
          borderTop
          borderBottom
          borderLeft
          borderRight
          showCrosshairs={false}
          className="bg-background/85 shadow-sm backdrop-blur-md dark:bg-card/50"
        >
          {/* Main content body */}
          <div className="flex w-full flex-col gap-8 px-6 py-8 sm:gap-9 sm:px-10 sm:py-10 lg:px-12">
            {/* Avatar + Name + Vietnam Live Clock + Theme Toggle */}
            <ProfileHero />

            {/* Editorial Bio & Core Stack */}
            <ProfileBio />

            {/* In-content Vinyl Music Player */}
            <ProfileMusicCard />
          </div>

          {/* Social dock */}
          <div className="flex w-full items-center justify-center border-t border-border/80 px-6 py-5 sm:px-10 sm:py-6 lg:px-12">
            <ProfileSocialLinks />
          </div>
        </GridContainer>
      </div>
    </ArcBandsBackground>
  )
}
