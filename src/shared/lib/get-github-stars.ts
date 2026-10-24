import { queryOptions } from "@tanstack/react-query"

import { siteConfig } from "@/shared/config"

export const DEFAULT_GITHUB_REPO =
  siteConfig.repoUrl.replace(/^https?:\/\/github\.com\//i, "") ||
  "phongphanq089/byphongphan.com"

const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes cache

/**
 * Fetch stargazers count for a given GitHub repository.
 * Gracefully returns null on network errors, rate limits, or missing repo.
 */
export async function getGitHubStars(
  repo: string = DEFAULT_GITHUB_REPO
): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!res.ok) {
      return null
    }

    const data = (await res.json()) as { stargazers_count?: number }
    if (typeof data.stargazers_count === "number") {
      return data.stargazers_count
    }

    return null
  } catch (error) {
    console.error(`Failed to fetch GitHub stars for ${repo}:`, error)
    return null
  }
}

/**
 * TanStack Query options for GitHub repository stars.
 */
export const githubStarsQueryOptions = (repo: string = DEFAULT_GITHUB_REPO) =>
  queryOptions({
    queryKey: ["github-stars", repo],
    queryFn: () => getGitHubStars(repo),
    staleTime: CACHE_TTL_MS,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  })

/**
 * Format star count into compact notation (e.g. 1.2K).
 */
export function formatStarCount(stars: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(stars)
}
