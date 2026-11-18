import { createFileRoute } from "@tanstack/react-router"

import { McpGuide } from "@/features/mcp"
import { createSeoMeta, pagesSeoConfig, siteConfig } from "@/shared/config"

export const Route = createFileRoute("/_site/mcp")({
  head: () => ({
    meta: createSeoMeta({
      title: pagesSeoConfig.mcp.title,
      description: pagesSeoConfig.mcp.description,
      url: `${siteConfig.url}/mcp`,
    }),
  }),
  component: McpPage,
})

function McpPage() {
  return (
    <main className="w-full">
      <McpGuide />
    </main>
  )
}
