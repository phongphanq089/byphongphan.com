import { createFileRoute } from "@tanstack/react-router"

import { HookGrid } from "@/features/hooks"
import { createSeoMeta } from "@/shared/config"

export const Route = createFileRoute("/_site/hooks/")({
  head: () => ({
    meta: createSeoMeta("hooks"),
  }),
  component: HooksAllPage,
})

function HooksAllPage() {
  return (
    <div className="w-full">
      <HookGrid category="all" />
    </div>
  )
}
