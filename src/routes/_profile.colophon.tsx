import { createFileRoute } from "@tanstack/react-router"

import {
  ColophonDesignSystem,
  ColophonHero,
  ColophonInspirations,
  ColophonTechnology,
} from "@/features/colophon"
import { createSeoMeta } from "@/shared/config"

export const Route = createFileRoute("/_profile/colophon")({
  head: () => ({
    meta: createSeoMeta("colophon"),
  }),
  component: ColophonPage,
})

function ColophonPage() {
  return (
    <div className="w-full">
      <ColophonHero />

      <ColophonTechnology />

      <ColophonDesignSystem />

      <ColophonInspirations />
    </div>
  )
}
