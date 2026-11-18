import { createFileRoute } from "@tanstack/react-router"

import { StudioShell } from "@/features/ui-studio"
import { createSeoMeta, siteConfig } from "@/shared/config"

export const Route = createFileRoute("/ui")({
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
  component: UiStudioLayout,
})

function UiStudioLayout() {
  // StudioShell owns the 3-column chrome and renders <Outlet /> internally.
  return <StudioShell />
}
