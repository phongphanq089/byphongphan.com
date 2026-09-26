import { createFileRoute } from "@tanstack/react-router"

import { BlockGrid } from "@/features/blocks"
import { createSeoMeta } from "@/shared/config"

export const Route = createFileRoute("/_site/blocks/")({
  head: () => ({
    meta: createSeoMeta("blocks"),
  }),
  component: BlocksAllPage,
})

function BlocksAllPage() {
  return (
    <div className="w-full">
      <BlockGrid category="all" />
    </div>
  )
}
