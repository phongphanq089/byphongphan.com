import { createFileRoute } from "@tanstack/react-router"

import { siteConfig } from "@/shared/config"

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const host = import.meta.env.VITE_SITE_URL || siteConfig.url
        const robots = `User-agent: *
					Allow: /
					Disallow: /admin
					Sitemap: ${host.replace(/\/$/, "")}/sitemap.xml`
        return new Response(robots, {
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
          },
        })
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any)
