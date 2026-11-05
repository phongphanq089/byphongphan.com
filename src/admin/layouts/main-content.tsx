import { Outlet } from "@tanstack/react-router"

import { AdminHeader } from "@/admin/widgets/admin-header"
import { ScrollArea, SidebarInset } from "@/shared/ui"

export function MainContent() {
  return (
    <SidebarInset className="flex h-svh max-h-svh min-w-0 flex-1 flex-col overflow-hidden bg-background md:peer-data-[variant=inset]:h-[calc(100svh-1rem)] md:peer-data-[variant=inset]:max-h-[calc(100svh-1rem)] md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-border/80 md:peer-data-[variant=inset]:shadow-xs">
      <AdminHeader />
      <ScrollArea
        className="min-h-0 flex-1"
        classNameViewport="p-4 md:p-6 lg:p-8"
      >
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
          <Outlet />
        </div>
      </ScrollArea>
    </SidebarInset>
  )
}

export default MainContent
