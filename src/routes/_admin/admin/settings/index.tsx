import { createFileRoute } from "@tanstack/react-router"

import { AdminSettingsView } from "@/admin/features/settings"

export const Route = createFileRoute("/_admin/admin/settings/")({
  component: AdminSettingsPage,
})

function AdminSettingsPage() {
  return <AdminSettingsView />
}
