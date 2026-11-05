import { createFileRoute } from "@tanstack/react-router"
import { FileText, Plus } from "lucide-react"

import { AdminContentCard, AdminPageHeader } from "@/admin"
import { Button } from "@/shared/ui"

export const Route = createFileRoute("/_admin/admin/posts/")({
  component: AdminPostsPage,
})

function AdminPostsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title="Blog Posts"
        description="Manage, publish, and draft articles for your blog."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Content & Blog" },
          { label: "Posts" },
        ]}
        actions={
          <Button className="gap-2">
            <Plus className="size-4" />
            <span>New Article</span>
          </Button>
        }
      />

      <AdminContentCard variant="dashed" centered>
        <div className="flex size-14 items-center justify-center rounded-full bg-muted/60">
          <FileText className="size-7 text-muted-foreground/70" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No articles created yet
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Articles from your MDX files and Neon DB will be displayed and
          manageable here.
        </p>
        <Button className="mt-6 gap-2">
          <Plus className="size-4" />
          <span>Create your first article</span>
        </Button>
      </AdminContentCard>
    </div>
  )
}
