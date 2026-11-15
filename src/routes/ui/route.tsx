import { createFileRoute, Outlet } from "@tanstack/react-router"

import { parseStudioSearch } from "@/features/ui-studio"
import { createSeoMeta, siteConfig } from "@/shared/config"

export const Route = createFileRoute("/ui")({
  validateSearch: (raw) => parseStudioSearch(raw),
  head: () => {
    const url = `${siteConfig.url}/ui`
    return {
      meta: createSeoMeta({
        title: "UI Studio • Phong Phan",
        description:
          "Interactive studio for the byphongphan registry — browse, preview and install components, blocks and hooks.",
        url,
      }),
      links: [{ rel: "canonical", href: url }],
    }
  },
  component: UiLayoutRoute,
})

function UiLayoutRoute() {
  return <Outlet />
}
