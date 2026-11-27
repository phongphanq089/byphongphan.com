import { createFileRoute } from "@tanstack/react-router"

import { AdminPostEditorLayout } from "@/admin/features/posts"

export const Route = createFileRoute("/_admin/admin/posts/new")({
  component: AdminNewPostPage,
})

function AdminNewPostPage() {
  return <AdminPostEditorLayout mode="create" />
}
