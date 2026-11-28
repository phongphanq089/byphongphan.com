import { createFileRoute } from "@tanstack/react-router"

import { AdminMediaView } from "@/admin/features/media"

export const Route = createFileRoute("/_admin/admin/media/")({
  component: AdminMediaPage,
})

function AdminMediaPage() {
  return <AdminMediaView />
}
