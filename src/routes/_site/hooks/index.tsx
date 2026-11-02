import { createFileRoute } from "@tanstack/react-router"

import { UnderConstructionBlock } from "@/shared/ui"

export const Route = createFileRoute("/_site/hooks/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full">
      <UnderConstructionBlock
        moduleName="Developer Hooks"
        moduleBadge="HOOK_202"
      />
    </div>
  )
}
