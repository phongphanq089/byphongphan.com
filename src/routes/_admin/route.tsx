import { createFileRoute } from "@tanstack/react-router"

import AdminLayout from "@/admin/layouts/admin-layout"

export const Route = createFileRoute("/_admin")({
  head: () => ({
    meta: [
      {
        name: "title",
        content: "Admin Dashboard Overview | byphongphan.com",
      },
    ],
  }),
  component: AdminLayout,
})
