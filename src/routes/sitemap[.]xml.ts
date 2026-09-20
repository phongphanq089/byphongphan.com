import { createFileRoute } from "@tanstack/react-router"

import { BLOCKS_DATA } from "@/features/blocks"
import { COMPONENTS_DATA } from "@/features/component-ui"
import { siteConfig } from "@/shared/config"
import { client } from "@/shared/lib/sanity"

interface SitemapRoute {
  path: string
  lastmod: string
  changefreq:
    "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority: string
}

/**
 * Sitemap generation for TanStack Start.
 * This route lists both static and dynamic pages.
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
            path: "/block",
            lastmod: now,
            changefreq: "weekly",
            priority: "0.9",
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
            path: "/component-ui",
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          },
          {
            path: "/component-ui/primitives",
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          },
          {
            path: "/component-ui/animations",
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          },
          {
            path: "/component-ui/foundations",
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

        try {
          // 1. Dynamic Sanity Blog Posts
          const sanityPosts = await client.fetch<
            Array<{
              slug: string
              _updatedAt?: string
              publishedAt?: string
            }>
          >(
            `*[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt, publishedAt }`
          )

          if (Array.isArray(sanityPosts)) {
            sanityPosts.forEach((post) => {
              if (post.slug) {
                dynamicRoutes.push({
                  path: `/blog/${post.slug}`,
                  lastmod: post._updatedAt || post.publishedAt || now,
                  changefreq: "weekly",
                  priority: "0.8",
                })
              }
            })
          }
        } catch (error) {
          console.error("Error fetching dynamic blog posts for sitemap:", error)
        }

        // 2. Dynamic Component UI Pages
        COMPONENTS_DATA.forEach((component) => {
          dynamicRoutes.push({
            path: `/component-ui/${component.category}/${component.slug}`,
            lastmod: now,
            changefreq: "weekly",
            priority: "0.8",
          })
        })

        // 3. Dynamic Blocks Pages
        BLOCKS_DATA.forEach((block) => {
          dynamicRoutes.push({
            path: `/blocks/${block.category}/${block.slug}`,
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
