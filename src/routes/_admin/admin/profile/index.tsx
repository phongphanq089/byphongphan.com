import { createFileRoute } from "@tanstack/react-router"

import { AdminProfileView } from "@/admin/features/profile"

export const Route = createFileRoute("/_admin/admin/profile/")({
  component: AdminProfilePage,
})

function AdminProfilePage() {
  return <AdminProfileView />
}
