import { createFileRoute } from "@tanstack/react-router"

import {
  ColophonDesignSystem,
  ColophonHero,
  ColophonInspirations,
  ColophonTechnology,
} from "@/features/colophon"
import { createSeoMeta, siteConfig } from "@/shared/config"

export const Route = createFileRoute("/_site/colophon/")({
  head: () => ({
    meta: createSeoMeta({
      title: "Engineering Blog • Phong Phan",
      description: "Writing on engineering, architecture, and UI.",
      url: `${siteConfig.url}/blog`,
    }),
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
