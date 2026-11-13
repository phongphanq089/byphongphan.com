import { createFileRoute } from "@tanstack/react-router"

import { ProfilePage } from "@/features/profile"
import { createSeoMeta } from "@/shared/config"

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: createSeoMeta("home"),
  }),
  component: ProfilePage,
})
