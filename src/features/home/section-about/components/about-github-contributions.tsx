import { Suspense } from "react"

import { siteConfig } from "@/shared/config"
import { getCachedContributions } from "@/shared/lib"
import {
  GitHubContributions,
  GitHubContributionsFallback,
} from "@/shared/ui/system/github-contributions"

const AboutGithubcontributions = () => {
  const GITHUB_USERNAME = siteConfig.author.githubUsername
  const GITHUB_PROFILE_URL = siteConfig.social.github.href
  const contributions = getCachedContributions(GITHUB_USERNAME)
  return (
    <div className="pt-6">
      <Suspense fallback={<GitHubContributionsFallback />}>
        <GitHubContributions
          contributions={contributions}
          githubProfileUrl={GITHUB_PROFILE_URL}
        />
      </Suspense>
    </div>
  )
}

export default AboutGithubcontributions
