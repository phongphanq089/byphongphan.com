// src/shared/api/site-settings.ts
import { queryOptions } from "@tanstack/react-query"

import type { DynamicSiteSettings } from "../config"

export async function getSiteSettings(): Promise<DynamicSiteSettings | null> {
  //  when BE have API, replace with fetch reality:
  // const res = await fetch(`${import.meta.env.VITE_API_URL}/api/site-settings`)
  // if (!res.ok) return null
  // return res.json()

  // BE not yet connected: return null to fall back to defaultSeoConfig.
  return null
}

export const siteSettingsQueryOptions = () =>
  queryOptions({
    queryKey: ["site-settings"],
    queryFn: () => getSiteSettings(),
    staleTime: 1000 * 60 * 60, // Cache 1h
  })
