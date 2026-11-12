import { createFileRoute, redirect } from "@tanstack/react-router"

import { ProfilePage } from "@/features/profile"
import { createSeoMeta } from "@/shared/config"

export const Route = createFileRoute("/_site/")({
  beforeLoad: () => {
    throw redirect({
      to: "/profile",
    })
  },
  head: () => ({
    meta: createSeoMeta("home"),
  }),
  component: ProfilePage,
})
