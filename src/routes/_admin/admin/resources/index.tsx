import { createFileRoute } from "@tanstack/react-router"
import { BookmarkCheck, Plus } from "lucide-react"

import { AdminContentCard, AdminPageHeader } from "@/admin"
import { Button } from "@/shared/ui"

export const Route = createFileRoute("/_admin/admin/resources/")({
  component: AdminResourcesPage,
})

function AdminResourcesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title="Resources & Tools"
        description="Curate design tools, repositories, icons, and inspiration links."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Showcase & Registry" },
          { label: "Resources" },
        ]}
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            <span>Add Resource</span>
          </Button>
        }
      />

      <AdminContentCard variant="dashed" centered>
        <div className="flex size-14 items-center justify-center rounded-full bg-muted/60">
          <BookmarkCheck className="size-7 text-muted-foreground/70" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          Resource Curation
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Curated assets, external repositories, design systems, and utilities.
        </p>
        <Button size="sm" className="mt-6 gap-2">
          <Plus className="size-4" />
          <span>Add first resource</span>
        </Button>
      </AdminContentCard>
    </div>
  )
}
