import { createFileRoute } from "@tanstack/react-router"

import {
  ColophonDesignSystem,
  ColophonHero,
  ColophonInspirations,
  ColophonTechnology,
} from "@/features/colophon"
import { createSeoMeta, pagesSeoConfig, siteConfig } from "@/shared/config"

export const Route = createFileRoute("/_site/colophon/")({
  head: () => ({
    meta: createSeoMeta({
      title: pagesSeoConfig.colophon.title,
      description: pagesSeoConfig.colophon.description,
      url: `${siteConfig.url}/colophon`,
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
