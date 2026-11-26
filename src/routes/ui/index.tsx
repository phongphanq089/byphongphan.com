import { createFileRoute } from "@tanstack/react-router"

import { StudioCatalogGrid } from "@/features/ui-studio"

export const Route = createFileRoute("/ui/")({
  component: UiStudioMasterPage,
})

function UiStudioMasterPage() {
  return <StudioCatalogGrid segment={null} />
}
