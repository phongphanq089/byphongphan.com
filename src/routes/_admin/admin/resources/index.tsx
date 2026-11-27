import { createFileRoute } from "@tanstack/react-router"

import { AdminResourcesView } from "@/admin/features/resources"

export const Route = createFileRoute("/_admin/admin/resources/")({
  component: AdminResourcesPage,
})

function AdminResourcesPage() {
  return <AdminResourcesView />
}
