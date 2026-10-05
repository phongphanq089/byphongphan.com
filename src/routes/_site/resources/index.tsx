import { createFileRoute } from "@tanstack/react-router"

import { createSeoMeta } from "@/shared/config"
import { UnderConstructionBlock } from "@/shared/ui/system/under-construction-block"

export const Route = createFileRoute("/_site/resources/")({
  head: () => ({
    meta: createSeoMeta("resources"),
  }),
  component: ResourcesPage,
})

function ResourcesPage() {
  return (
    <div className="w-full">
      <UnderConstructionBlock
        moduleName="Developer Resources"
        moduleBadge="RESOURCES_202"
      />
    </div>
  )
}
