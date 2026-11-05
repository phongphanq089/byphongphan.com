import { createFileRoute } from "@tanstack/react-router"
import { Save, SlidersHorizontal } from "lucide-react"

import { AdminContentCard, AdminPageHeader } from "@/admin"
import { Button } from "@/shared/ui"

export const Route = createFileRoute("/_admin/admin/settings/")({
  component: AdminSettingsPage,
})

function AdminSettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title="Site Settings & SEO"
        description="Configure global metadata, OpenGraph tags, social accounts, and site preferences."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "System & Media" },
          { label: "Settings" },
        ]}
        actions={
          <Button className="gap-2">
            <Save className="size-4" />
            <span>Save Changes</span>
          </Button>
        }
      />

      <AdminContentCard
        title="General Preferences"
        description="Core website metadata and search engine optimization parameters"
        actions={
          <Button variant="outline" size="sm">
            Discard
          </Button>
        }
      >
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted/60">
            <SlidersHorizontal className="size-7 text-muted-foreground/70" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Settings Editor
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            Site title, meta description, favicon, OpenGraph card preview, and
            Neon database sync parameters will be configured here.
          </p>
        </div>
      </AdminContentCard>
    </div>
  )
}
