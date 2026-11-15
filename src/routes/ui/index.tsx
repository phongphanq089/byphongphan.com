import { createFileRoute } from "@tanstack/react-router"

import { StudioShell } from "@/features/ui-studio"

export const Route = createFileRoute("/ui/")({
  component: UiStudioPage,
})

function UiStudioPage() {
  return <StudioShell />
}
