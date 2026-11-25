import { createFileRoute } from "@tanstack/react-router"

import { SiteDraftingLayout } from "@/app/layouts/site-drafting-layout"

export const Route = createFileRoute("/_site")({
  component: SiteDraftingLayout,
})
