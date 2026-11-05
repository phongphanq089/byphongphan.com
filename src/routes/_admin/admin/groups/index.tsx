import { createFileRoute } from "@tanstack/react-router"
import { Library, Plus } from "lucide-react"

import { AdminContentCard, AdminPageHeader } from "@/admin"
import { Button } from "@/shared/ui"

export const Route = createFileRoute("/_admin/admin/groups/")({
  component: AdminGroupsPage,
})

function AdminGroupsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title="Series & Groups"
        description="Organize articles into curated collections and sequential learning series."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Content & Blog" },
          { label: "Series & Groups" },
        ]}
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            <span>New Series</span>
          </Button>
        }
      />

      <AdminContentCard variant="dashed" centered>
        <div className="flex size-14 items-center justify-center rounded-full bg-muted/60">
          <Library className="size-7 text-muted-foreground/70" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No series or groups created
        </h3>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Create serialized collections to bundle multi-part engineering deep
          dives together.
        </p>
        <Button size="sm" className="mt-6 gap-2">
          <Plus className="size-4" />
          <span>Create new series</span>
        </Button>
      </AdminContentCard>
    </div>
  )
}
