import { queryOptions } from "@tanstack/react-query"

import type { Activity } from "@/shared/ui/system/contribution-graph"

type GitHubContributionsResponse = {
  contributions: Activity[]
}

const DEFAULT_API_URL = "https://github-contributions-api.jogruber.de/v4"
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes TTL to reflect today's commits promptly

type CacheEntry = {
  promise: Promise<Activity[]>
  timestamp: number
}

const contributionsCache = new Map<string, CacheEntry>()

/**
 * Fetch and cache GitHub contribution activity for a given username.
 * Replaces Next.js `unstable_cache` with an in-memory TTL promise cache
 * compatible with React 19 `use()` and TanStack Start SSR/prerender.
 */
export function getCachedContributions(
  username: string,
  year: number | string = "last",
  ttlMs = CACHE_TTL_MS
): Promise<Activity[]> {
  const cacheKey = `github-contributions-${username}-${year}`
  const now = Date.now()
  const cached = contributionsCache.get(cacheKey)

  if (cached && now - cached.timestamp < ttlMs) {
    return cached.promise
  }

  const promise = (async () => {
    try {
      const apiUrl =
        import.meta.env.VITE_SITE_PUBLIC_GITHUB_CONTRIBUTIONS_API_URL ||
        DEFAULT_API_URL

      const res = await fetch(`${apiUrl}/${username}?y=${year}`)
      if (!res.ok) {
        return []
      }
      const data = (await res.json()) as GitHubContributionsResponse
      return data.contributions ?? []
    } catch (error) {
      console.error(
        `Failed to fetch GitHub contributions for ${username}:`,
        error
      )
      return []
    }
  })()

  contributionsCache.set(cacheKey, { promise, timestamp: now })
  return promise
}

/**
 * TanStack Query options for GitHub contributions (if using useQuery / useSuspenseQuery)
 */
export const githubContributionsQueryOptions = (
  username: string,
  year: number | string = "last"
) =>
  queryOptions({
    queryKey: ["github-contributions", username, year],
    queryFn: () => getCachedContributions(username, year),
    staleTime: CACHE_TTL_MS,
    gcTime: CACHE_TTL_MS,
  })
