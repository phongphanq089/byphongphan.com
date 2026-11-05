import { MainContent } from "@/admin/layouts/main-content"
import { SidebarAdmin } from "@/admin/widgets/admin-sidebar"
import { SidebarProvider } from "@/shared/ui"

export function AdminLayout() {
  return (
    <SidebarProvider
      defaultOpen
      className="h-svh max-h-svh w-full overflow-hidden has-data-[variant=inset]:bg-muted"
    >
      <SidebarAdmin />
      <MainContent />
    </SidebarProvider>
  )
}

export { MainContent }
export default AdminLayout
