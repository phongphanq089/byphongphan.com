import { SidebarProvider } from "@/shared/ui"
import { SidebarAdmin } from "@/widgets/admin-sidebar"

import { AdminHeader } from "./admin/admin-header"
import { MainContent } from "./admin/main-content"

export function AdminLayout() {
  return (
    <SidebarProvider
      defaultOpen={true}
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      {/* 1. Full-width Top Header across the entire top of the screen */}
      <AdminHeader />

      {/* 2. Body section below the Header */}
      <div className="flex w-full flex-1">
        <SidebarAdmin />
        <MainContent />
      </div>
    </SidebarProvider>
  )
}

export default AdminLayout
