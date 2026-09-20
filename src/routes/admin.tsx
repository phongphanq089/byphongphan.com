import { createFileRoute } from "@tanstack/react-router"

import { AdminLayout } from "@/app/layouts"

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
})
