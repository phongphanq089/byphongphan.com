import { PostHogProvider } from "posthog-js/react"

export function PostHogRootProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const apiHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!apiKey || !apiHost) {
    if (import.meta.env.DEV) {
      const missingVariable = !apiKey
        ? "VITE_PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "VITE_PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
      )
    }

    return children
  }

  return (
    <PostHogProvider
      apiKey={apiKey}
      options={{
        api_host: apiHost,
        capture_exceptions: true,
        debug: import.meta.env.DEV,
        defaults: "2025-05-24",
        logs: {
          environment: import.meta.env.MODE,
          serviceName: "byphongphan.com-web",
        },
      }}
    >
      {children}
    </PostHogProvider>
  )
}
