import { createFileRoute } from "@tanstack/react-router"

import { BLOCKS_DATA } from "@/features/blocks"
import { COMPONENTS_DATA } from "@/features/component-ui"
import { HOOKS_DATA } from "@/features/hooks"
import {
  siteConfig,
  VALID_BLOCK_CATEGORY_IDS,
  VALID_COMPONENT_CATEGORY_IDS,
  VALID_HOOK_CATEGORY_IDS,
} from "@/shared/config"

interface SitemapRoute {
  path: string
  lastmod: string
  changefreq:
    "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority: string
}

/**
 * Sitemap generation for TanStack Start.
 * Registry pages live under the unified `/ui` studio.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = new Date().toISOString()

        const staticRoutes: SitemapRoute[] = [
          {
            path: "",
            lastmod: now,
            changefreq: "daily",
            priority: "1.0",
          },
          {
            path: "/ui",
            lastmod: now,
            changefreq: "weekly",
            priority: "0.9",
          },
          {
            path: "/mcp",
            lastmod: now,
            changefreq: "weekly",
            priority: "0.85",
          },
          {
            path: "/blog",
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          },
          {
            path: "/resources",
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          },
          {
            path: "/ui/base",
            lastmod: now,
            changefreq: "weekly",
            priority: "0.9",
          },
          {
            path: "/ui/blocks",
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          },
          {
            path: "/ui/hooks",
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          },
          {
            path: "/design-system",
            lastmod: now,
            changefreq: "monthly",
            priority: "0.7",
          },
        ]

        const dynamicRoutes: SitemapRoute[] = []

        // 1. Dynamic category listing pages (components, blocks, hooks)
        VALID_COMPONENT_CATEGORY_IDS.forEach((cat) => {
          dynamicRoutes.push({
            path: `/ui/${cat}`,
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          })
        })

        VALID_BLOCK_CATEGORY_IDS.forEach((cat) => {
          dynamicRoutes.push({
            path: `/ui/${cat}`,
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          })
        })

        VALID_HOOK_CATEGORY_IDS.forEach((cat) => {
          dynamicRoutes.push({
            path: `/ui/${cat}`,
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          })
        })

        // 2. Dynamic component detail pages
        COMPONENTS_DATA.forEach((component) => {
          dynamicRoutes.push({
            path: `/ui/${component.category}/${component.slug}`,
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          })
        })

        // 3. Dynamic block detail pages
        BLOCKS_DATA.forEach((block) => {
          dynamicRoutes.push({
            path: `/ui/${block.category}/${block.slug}`,
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          })
        })

        // 4. Dynamic hook detail pages
        HOOKS_DATA.forEach((hook) => {
          dynamicRoutes.push({
            path: `/ui/${hook.category}/${hook.slug}`,
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          })
        })

        const allRoutes = [...staticRoutes, ...dynamicRoutes]

        const host = import.meta.env.VITE_SITE_URL || siteConfig.url
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `
  <url>
    <loc>${host.replace(/\/$/, "")}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`

        return new Response(sitemap, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        })
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any)
