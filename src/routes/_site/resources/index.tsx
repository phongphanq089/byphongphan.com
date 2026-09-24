import { createFileRoute } from "@tanstack/react-router"

import {
  resourceCategoriesQueryOptions,
  ResourceGrid,
  resourcesQueryOptions,
} from "@/features/resources"
import { createSeoMeta } from "@/shared/config"
import { IS_PUBLIC_UI } from "@/shared/constants"
import { UnderConstructionBlock } from "@/shared/ui"

export const Route = createFileRoute("/_site/resources/")({
  loader: async ({ context }) => {
    try {
      const [resources, categories] = await Promise.all([
        context.queryClient.ensureQueryData(resourcesQueryOptions()),
        context.queryClient.ensureQueryData(resourceCategoriesQueryOptions()),
      ])
      return { resources, categories }
    } catch {
      return { resources: undefined, categories: undefined }
    }
  },
  head: () => ({
    meta: createSeoMeta("resources"),
  }),
  component: ResourcesPage,
})

function ResourcesPage() {
  const loaderData = Route.useLoaderData()

  return (
    <div className="w-full">
      {IS_PUBLIC_UI ? (
        <ResourceGrid
          initialResources={loaderData?.resources}
          initialCategories={loaderData?.categories}
        />
      ) : (
        <UnderConstructionBlock
          moduleName="Developer Resources"
          moduleBadge="RESOURCES_202"
        />
      )}
    </div>
  )
}
