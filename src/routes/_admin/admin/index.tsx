import { createFileRoute } from "@tanstack/react-router"

import { AdminDashboardView } from "@/admin/features/dashboard"

export const Route = createFileRoute("/_admin/admin/")({
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  return <AdminDashboardView />
}
