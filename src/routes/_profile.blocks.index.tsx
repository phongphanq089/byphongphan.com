import { createFileRoute } from "@tanstack/react-router"

import { BlockGrid } from "@/features/blocks"
import { createSeoMeta } from "@/shared/config"
import { IS_PUBLIC_UI } from "@/shared/constants"
import { UnderConstructionBlock } from "@/shared/ui"

export const Route = createFileRoute("/_profile/blocks/")({
  head: () => ({
    meta: createSeoMeta("blocks"),
  }),
  component: BlocksAllPage,
})

function BlocksAllPage() {
  return (
    <div className="w-full">
      {IS_PUBLIC_UI ? (
        <BlockGrid category="all" />
      ) : (
        <UnderConstructionBlock
          moduleName="Engineering Block ui"
          moduleBadge="BLOCK"
        />
      )}
    </div>
  )
}
