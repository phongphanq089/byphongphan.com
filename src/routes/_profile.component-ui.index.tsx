import { createFileRoute } from "@tanstack/react-router"

import { ComponentGrid } from "@/features/component-ui"
import { createSeoMeta } from "@/shared/config"

export const Route = createFileRoute("/_profile/component-ui/")({
  head: () => ({
    meta: createSeoMeta("componentUi"),
  }),
  component: ComponentUiAllPage,
})

function ComponentUiAllPage() {
  return (
    <div className="w-full">
      <ComponentGrid category="all" />
    </div>
  )
}
