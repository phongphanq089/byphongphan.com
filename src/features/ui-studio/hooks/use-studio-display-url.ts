import { useRouterState } from "@tanstack/react-router"
import * as React from "react"

import { siteConfig } from "@/shared/config"

function getClientHost(): string {
  if (typeof window !== "undefined") return window.location.host
  return getServerHost()
}

function getServerHost(): string {
  try {
    return new URL(siteConfig.url).host
  } catch {
    return "byphongphan.com"
  }
}

const noopSubscribe = () => () => {}

/**
 * Returns the current host and pathname formatted as a clean browser display URL
 * (e.g. "byphongphan.com/ui/auth/login-01" or "localhost:5731/ui/auth/login-01").
 */
export function useStudioDisplayUrl(): string {
  const currentPath = useRouterState({ select: (s) => s.location.pathname })
  const host = React.useSyncExternalStore(
    noopSubscribe,
    getClientHost,
    getServerHost
  )

  return `${host}${currentPath}`
}
