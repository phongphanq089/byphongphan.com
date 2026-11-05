import { Container } from "@/admin/layouts/container"
import { MainContent } from "@/admin/layouts/main-content"
import { AdminHeader } from "@/admin/widgets/admin-header"
import { SidebarAdmin } from "@/admin/widgets/admin-sidebar"
import { SidebarProvider } from "@/shared/ui"

export function AdminLayout() {
  return (
    <SidebarProvider
      defaultOpen
      className="flex min-h-svh w-full flex-col bg-background text-foreground"
    >
      <AdminHeader />

      {/* Main Admin Workspace with Sidebar + Inset Content */}
      <div className="flex min-h-0 w-full flex-1">
        <SidebarAdmin />
        <MainContent />
      </div>
    </SidebarProvider>
  )
}

export { Container, MainContent }
export default AdminLayout
