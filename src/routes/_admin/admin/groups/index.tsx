import { createFileRoute } from "@tanstack/react-router"

import { AdminGroupsView } from "@/admin/features/groups"

export const Route = createFileRoute("/_admin/admin/groups/")({
  component: AdminGroupsPage,
})

function AdminGroupsPage() {
  return <AdminGroupsView />
}
