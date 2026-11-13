import React, { Suspense } from "react"

import { siteConfig } from "@/shared/config"
import { getCachedContributions } from "@/shared/lib"
import { cn } from "@/shared/lib/utils"
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/shared/ui/system/github-contributions"

import AboutStory from "./about-story"
import DeskStage from "./desk-stage"

export interface SectionAboutProps {
  className?: string
}

export function SectionAbout({ className }: SectionAboutProps) {
  const GITHUB_USERNAME = siteConfig.author.githubUsername
  const GITHUB_PROFILE_URL = siteConfig.social.github.href
  const contributions = getCachedContributions(GITHUB_USERNAME)

  return (
    <section
      id="about"
      className={cn(
        "relative flex w-full flex-col bg-background text-foreground",
        className
      )}
    >
      {/* 1. Floating Desk Workspace Stage */}
      <DeskStage />

      {/* 2. Profile & Bio Editorial Story + GitHub Activity */}
      <div className="w-full p-6 pt-16">
        <div className="mx-auto flex w-full flex-col">
          <AboutStory githubProfileUrl={GITHUB_PROFILE_URL} />

          {/* Live GitHub Contributions Heatmap */}
          <div className="pt-6">
            <Suspense fallback={<GitHubContributionsFallback />}>
              <GitHubContributions
                contributions={contributions}
                githubProfileUrl={GITHUB_PROFILE_URL}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
