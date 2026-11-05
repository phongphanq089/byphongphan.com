import { Outlet } from "@tanstack/react-router"

import { SidebarInset } from "@/shared/ui"

export function MainContent() {
  return (
    <SidebarInset className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-background/50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
        <Outlet />
      </div>
    </SidebarInset>
  )
}

export default MainContent
