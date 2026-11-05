import { createFileRoute } from "@tanstack/react-router"
import { Plus, Tags } from "lucide-react"

import { AdminContentCard, AdminPageHeader } from "@/admin"
import { Button } from "@/shared/ui"

export const Route = createFileRoute("/_admin/admin/categories/")({
  component: AdminCategoriesPage,
})

function AdminCategoriesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title="Categories & Tags"
        description="Taxonomy management for blog articles, registry components, and guides."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Content & Blog" },
          { label: "Categories" },
        ]}
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            <span>New Category</span>
          </Button>
        }
      />

      <AdminContentCard variant="dashed" centered>
        <div className="flex size-14 items-center justify-center rounded-full bg-muted/60">
          <Tags className="size-7 text-muted-foreground/70" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          Categories & Taxonomy
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Configure tags and taxonomies to help readers filter and explore your
          site.
        </p>
        <Button size="sm" className="mt-6 gap-2">
          <Plus className="size-4" />
          <span>Add first category</span>
        </Button>
      </AdminContentCard>
    </div>
  )
}
