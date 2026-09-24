import { createFileRoute } from "@tanstack/react-router"

import { ProfileLayout } from "@/app/layouts"

export const Route = createFileRoute("/_site")({
  component: ProfileLayout,
})
