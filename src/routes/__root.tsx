import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  type ErrorComponentProps,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { Suspense, useEffect } from "react"
import type { JSX } from "react/jsx-runtime"

import { DefaultCatchBoundary } from "@/app/boundaries/default-catch-boundary"
import NotFoundBoundary from "@/app/boundaries/not-found-boundary"
import {
  createPersonJsonLd,
  createSeoMeta,
  createSiteLinks,
} from "@/shared/config"
import { lazyWithRetry } from "@/shared/lib/lazy-with-retry"
import { ThemeProvider } from "@/shared/providers/theme-provider"
import { TooltipProvider } from "@/shared/ui/core/tooltip"
const LazyCommandMenu = lazyWithRetry(() =>
  import("@/widgets/command-menu").then((m) => ({ default: m.CommandMenu }))
)

import { PostHogRootProvider } from "@/shared/providers/posthog-provider"

import appCss from "../styles/app.css?url"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  loader: async () => {
    try {
      return {}
    } catch {
      return {
        siteSettings: null,
        resources: [],
        categories: [],
        blogPosts: [],
        blogCategories: [],
        blogGroups: [],
      }
    }
  },
  head: ({ loaderData }) => {
    const siteSettings = loaderData?.siteSettings

    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        ...createSeoMeta(undefined, siteSettings),
      ],
      links: [
        ...createSiteLinks(siteSettings),
        { rel: "stylesheet", href: appCss },
      ],
      scripts: [
        {
          tag: "script",
          attrs: {
            type: "application/ld+json",
          },
          children: JSON.stringify(createPersonJsonLd(siteSettings)),
        },
      ],
    }
  },
  errorComponent: (props: JSX.IntrinsicAttributes & ErrorComponentProps) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: NotFoundBoundary,
  component: RootComponent,
})

function RootComponent() {
  const loaderData = Route.useLoaderData()
  return (
    <RootDocument
      siteSettings={loaderData?.siteSettings}
      resources={loaderData?.resources}
      categories={loaderData?.categories}
      blogPosts={loaderData?.blogPosts}
      blogCategories={loaderData?.blogCategories}
      blogGroups={loaderData?.blogGroups}
    >
      <Outlet />
    </RootDocument>
  )
}

const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('vite-ui-theme') || 'dark';
    var resolvedTheme = theme;

    if (theme === 'system') {
      resolvedTheme = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches ? 'dark' : 'light';
    }

    var root = document.documentElement;
    if (resolvedTheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  } catch (error) {}
})();
`

function RootDocument({
  children,
  siteSettings,
  resources,
  categories,
  blogPosts,
  blogCategories,
  blogGroups,
}: {
  children: React.ReactNode
  siteSettings?: unknown
  resources?: unknown
  categories?: unknown
  blogPosts?: unknown
  blogCategories?: unknown
  blogGroups?: unknown
}) {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return

    if (import.meta.env.DEV) {
      // In development, ensure no Service Worker intercepts Vite HMR or caches modules
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister()
        }
      })
      if ("caches" in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key)
          }
        })
      }
      return
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("[PWA] Service Worker registration failed:", err)
      })
    })
  }, [])

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript as string }} />
        <HeadContent />
      </head>
      <body
        className="relative wrap-anywhere antialiased"
        suppressHydrationWarning
      >
        <PostHogRootProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RootLayoutBody
              siteSettings={siteSettings}
              resources={resources}
              categories={categories}
              blogPosts={blogPosts}
              blogCategories={blogCategories}
              blogGroups={blogGroups}
            >
              {children}
            </RootLayoutBody>
          </ThemeProvider>
        </PostHogRootProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootLayoutBody({
  children,
}: {
  children: React.ReactNode
  siteSettings?: unknown
  resources?: unknown
  categories?: unknown
  blogPosts?: unknown
  blogCategories?: unknown
  blogGroups?: unknown
}) {
  return (
    <TooltipProvider>
      {children}
      <Suspense fallback={null}>
        <LazyCommandMenu />
      </Suspense>
    </TooltipProvider>
  )
}
