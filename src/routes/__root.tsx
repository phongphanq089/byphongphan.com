import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  type ErrorComponentProps,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { useEffect } from "react"
import type { JSX } from "react/jsx-runtime"

import {
  blogCategoriesQueryOptions,
  blogGroupsQueryOptions,
  blogPostsQueryOptions,
} from "@/features/blog"
import {
  resourceCategoriesQueryOptions,
  resourcesQueryOptions,
} from "@/features/resources"
import {
  createPersonJsonLd,
  createSeoMeta,
  createSiteLinks,
} from "@/shared/config"
import { siteSettingsQueryOptions } from "@/shared/lib"
import { ThemeProvider } from "@/shared/providers/theme-provider"
import { TooltipProvider } from "@/shared/ui"
import { NotFound } from "@/shared/ui/block/not-found"
import { DefaultCatchBoundary } from "@/shared/ui/system/default-catch-boundary"
import { CommandMenu } from "@/widgets/command-menu"

import appCss from "../styles/app.css?url"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  loader: async ({ context }) => {
    try {
      const [
        siteSettings,
        resources,
        categories,
        blogPosts,
        blogCategories,
        blogGroups,
      ] = await Promise.all([
        context.queryClient.ensureQueryData(siteSettingsQueryOptions()),
        context.queryClient.ensureQueryData(resourcesQueryOptions()),
        context.queryClient.ensureQueryData(resourceCategoriesQueryOptions()),
        context.queryClient.ensureQueryData(blogPostsQueryOptions()),
        context.queryClient.ensureQueryData(blogCategoriesQueryOptions()),
        context.queryClient.ensureQueryData(blogGroupsQueryOptions()),
      ])

      return {
        siteSettings,
        resources,
        categories,
        blogPosts,
        blogCategories,
        blogGroups,
      }
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
  notFoundComponent: () => <NotFound />,
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

const themeScript = `(function(){try{var t=localStorage.getItem('vite-ui-theme')||'dark',r=document.documentElement,s=t==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;r.classList.remove('light','dark');r.classList.add(s);}catch(e){}})()`

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
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err)
        })
      })
    }
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript as string }} />
        <HeadContent />
      </head>
      <body
        className="relative wrap-anywhere antialiased"
        suppressHydrationWarning
      >
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
      <CommandMenu />
    </TooltipProvider>
  )
}
