import { createFileRoute } from "@tanstack/react-router"

import { AdminPostEditorLayout } from "@/admin/features/posts"

export const Route = createFileRoute("/_admin/admin/posts/$postId")({
  component: AdminEditPostPage,
})

function AdminEditPostPage() {
  const { postId } = Route.useParams()
  return <AdminPostEditorLayout mode="edit" postId={postId} />
}
