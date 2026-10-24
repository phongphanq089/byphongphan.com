import { PostHogProvider } from "posthog-js/react"

export function PostHogRootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  if (import.meta.env.DEV) {
    return <>{children}</>
  }

  const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!apiKey || !apiHost) {
    return <>{children}</>
  }

  return (
    <PostHogProvider
      apiKey={apiKey}
      options={{
        api_host: apiHost,
        autocapture: false,
        capture_pageview: true,
        capture_pageleave: false,
        disable_session_recording: true,
        person_profiles: "identified_only",
        capture_exceptions: true,
        debug: false,
        defaults: "2025-05-24",
      }}
    >
      {children}
    </PostHogProvider>
  )
}
