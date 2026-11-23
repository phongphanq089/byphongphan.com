import { createFileRoute } from "@tanstack/react-router"

import { HomePreviewPage } from "@/features/home-preview"
import { createSeoMeta } from "@/shared/config"

export const Route = createFileRoute("/home-preview")({
  head: () => ({
    meta: createSeoMeta({
      title: "Home Layout Concept (Preview) | Phong Phan",
      description:
        "Architectural blueprint layout concept wireframe for home redesign.",
    }),
  }),
  component: HomePreviewPage,
})
