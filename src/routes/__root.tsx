import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  type ErrorComponentProps,
  HeadContent,
  Outlet,
  Scripts,
  useLocation,
} from "@tanstack/react-router"
import { useEffect } from "react"
import type { JSX } from "react/jsx-runtime"

import {
  BLOG_CATEGORIES_QUERY,
  BLOG_GROUPS_QUERY,
  BLOG_POSTS_QUERY,
  blogCategoriesQueryOptions,
  blogGroupsQueryOptions,
  blogPostsQueryOptions,
  getBlogCategories,
  getBlogGroups,
  getBlogPosts,
} from "@/features/blog"
import {
  getResourceCategories,
  getResources,
  RESOURCE_CATEGORIES_QUERY,
  resourceCategoriesQueryOptions,
  RESOURCES_QUERY,
  resourcesQueryOptions,
} from "@/features/resources"
import {
  createPersonJsonLd,
  createSeoMeta,
  createSiteLinks,
} from "@/shared/config"
import { getSiteSettings, siteSettingsQueryOptions } from "@/shared/lib/sanity"
import { ThemeProvider } from "@/shared/providers/theme-provider"
import {
  ApiInspectorDrawer,
  ApiInspectorProvider,
  DevApiInspectorFloatingTrigger,
} from "@/shared/tools/api-inspector"
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
  const location = useLocation()
  const isStudio = location.pathname.startsWith("/studio")

  if (isStudio) {
    return <>{children}</>
  }

  const initialEntries = [
    ...(siteSettings
      ? [
          {
            id: "sanity-site-settings",
            title: "Sanity Site Settings",
            endpoint: "*[_type == 'setting'][0]",
            method: "GROQ" as const,
            status: 200,
            data: siteSettings,
            fetcher: () => getSiteSettings(),
            description:
              "Global site metadata, theme, and SEO settings fetched from Sanity CMS",
          },
        ]
      : []),
    {
      id: "sanity-resources",
      title: "Sanity Resources",
      endpoint: RESOURCES_QUERY,
      method: "GROQ" as const,
      status: 200,
      data: resources,
      fetcher: () => getResources(),
      description:
        "Curated developer tools, UI libraries, and design resources fetched via GROQ",
    },
    {
      id: "sanity-resource-categories",
      title: "Sanity Resource Categories",
      endpoint: RESOURCE_CATEGORIES_QUERY,
      method: "GROQ" as const,
      status: 200,
      data: categories,
      fetcher: () => getResourceCategories(),
      description:
        "Developer resource categories and navigation filters fetched via GROQ",
    },
    {
      id: "sanity-blog-posts",
      title: "Sanity Blog Posts",
      endpoint: BLOG_POSTS_QUERY,
      method: "GROQ" as const,
      status: 200,
      data: blogPosts,
      fetcher: () => getBlogPosts(),
      description:
        "Full list of articles and engineering writeups fetched from Sanity CMS",
    },
    {
      id: "sanity-blog-categories",
      title: "Sanity Blog Categories",
      endpoint: BLOG_CATEGORIES_QUERY,
      method: "GROQ" as const,
      status: 200,
      data: blogCategories,
      fetcher: () => getBlogCategories(),
      description: "Blog categories for filtering posts fetched via GROQ",
    },
    {
      id: "sanity-blog-groups",
      title: "Sanity Blog Series",
      endpoint: BLOG_GROUPS_QUERY,
      method: "GROQ" as const,
      status: 200,
      data: blogGroups,
      fetcher: () => getBlogGroups(),
      description:
        "Curated multi-part engineering series and learning collections fetched via GROQ",
    },
  ]

  return (
    <ApiInspectorProvider initialEntries={initialEntries}>
      <TooltipProvider>
        {children}
        <CommandMenu />
        <DevApiInspectorFloatingTrigger />
        <ApiInspectorDrawer />
      </TooltipProvider>
    </ApiInspectorProvider>
  )
}
