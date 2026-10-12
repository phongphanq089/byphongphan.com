import { Suspense } from "react"

import { lazyWithRetry } from "@/shared/lib"

const LazyNotFound = lazyWithRetry(() => import("@/shared/ui/block/not-found"))

export default function NotFoundBoundary() {
  return (
    <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
      <LazyNotFound />
    </Suspense>
  )
}
