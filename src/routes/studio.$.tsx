import { createFileRoute } from "@tanstack/react-router"
import { lazy, Suspense } from "react"

import { createSeoMeta } from "@/shared/config"

const StudioComponent = lazy(async () => {
  const [{ Studio }, sanityConfig] = await Promise.all([
    import("sanity"),
    import("../../sanity.config").then((m) => m.default),
  ])
  return {
    default: () => <Studio config={sanityConfig} />,
  }
})

export const Route = createFileRoute("/studio/$")({
  ssr: false,
  head: () => ({
    meta: createSeoMeta("studio"),
  }),
  component: StudioPage,
})

function StudioPage() {
  return (
    <div className="fixed inset-0 z-[9999] h-[100dvh] w-full overflow-hidden bg-black">
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
            Loading Sanity Studio...
          </div>
        }
      >
        <StudioComponent />
      </Suspense>
    </div>
  )
}
