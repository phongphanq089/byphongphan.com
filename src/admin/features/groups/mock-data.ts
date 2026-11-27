import type { AdminPostGroup } from "@/admin/features/posts"
import { MOCK_GROUPS, MOCK_POSTS } from "@/admin/features/posts/mock-data"

import type { AdminGroupWithPosts } from "./types"

const EXTRA_MOCK_GROUPS: AdminPostGroup[] = [
  {
    id: "grp-react-19-patterns",
    title: "React 19 Production Patterns",
    slug: "react-19-production-patterns",
    description:
      "Actions, optimistic state, server boundaries, and zero-rerender island composition.",
    coverImage: "/hero-left.png",
    isCompleted: false,
    createdAt: "2026-10-15T09:00:00.000Z",
    updatedAt: "2026-11-21T16:20:00.000Z",
  },
  {
    id: "grp-base-ui-registry",
    title: "Base UI + Tailwind v4 Registry",
    slug: "base-ui-tailwind-v4-registry",
    description:
      "Building accessible, themeable primitives and distributing them via shadcn CLI.",
    coverImage: "/hero-right.png",
    isCompleted: true,
    createdAt: "2026-07-12T10:00:00.000Z",
    updatedAt: "2026-09-08T11:45:00.000Z",
  },
  {
    id: "grp-neon-edge-auth",
    title: "Session Auth & Security on Edge",
    slug: "session-auth-security-edge",
    description:
      "Cookie sessions, SHA-256 reset tokens, and passwordChangedAt revocation.",
    coverImage: null,
    isCompleted: false,
    createdAt: "2026-11-01T08:30:00.000Z",
    updatedAt: "2026-11-24T19:00:00.000Z",
  },
]

const ALL_GROUPS: AdminPostGroup[] = [...MOCK_GROUPS, ...EXTRA_MOCK_GROUPS]

export const MOCK_GROUPS_WITH_POSTS: AdminGroupWithPosts[] = ALL_GROUPS.map(
  (group) => ({
    ...group,
    posts: MOCK_POSTS.filter((post) => post.groupId === group.id).sort(
      (a, b) => (a.groupOrder ?? 999) - (b.groupOrder ?? 999)
    ),
  })
)
