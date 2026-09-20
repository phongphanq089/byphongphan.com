import { createFileRoute, useNavigate } from "@tanstack/react-router"

import {
  BlogPostEditor,
  type PostFormValues,
} from "@/features/admin/blog-editor"

export const Route = createFileRoute("/admin/posts/new")({
  component: AdminNewPostPage,
})

function AdminNewPostPage() {
  const navigate = useNavigate()

  const handleSave = (values: PostFormValues) => {
    console.log("Creating new article:", values)
    // When API is connected, call server function / mutation here.
    // For now, redirect back to posts list:
    navigate({ to: "/admin/posts" })
  }

  return <BlogPostEditor isNew={true} onSave={handleSave} />
}
