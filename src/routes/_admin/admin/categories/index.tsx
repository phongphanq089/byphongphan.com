import { createFileRoute } from "@tanstack/react-router"

import { AdminCategoriesView } from "@/admin/features/categories"

export const Route = createFileRoute("/_admin/admin/categories/")({
  component: AdminCategoriesPage,
})

function AdminCategoriesPage() {
  return <AdminCategoriesView />
}
