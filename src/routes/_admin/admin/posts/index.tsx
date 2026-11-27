import { createFileRoute } from "@tanstack/react-router"

import { AdminPostsView } from "@/admin/features/posts"

export const Route = createFileRoute("/_admin/admin/posts/")({
  component: AdminPostsPage,
})

function AdminPostsPage() {
  return <AdminPostsView />
}
