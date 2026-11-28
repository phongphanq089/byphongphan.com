import {
  MOCK_CATEGORIES,
  MOCK_POSTS,
  MOCK_TAGS,
} from "@/admin/features/posts/mock-data"

import type { AdminCategoryWithCount, AdminTagWithCount } from "./types"

const EXTRA_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  react: "Component composition, hooks, concurrent rendering, and React 19.",
  typescript: "Type-level patterns, strict inference, and end-to-end safety.",
  "tanstack-start": "SSR routing, server functions, and streaming loaders.",
  webgl2: "Shaders, framebuffers, and GPU-accelerated UI rendering.",
  "drizzle-orm": "Relational schemas, migrations, and edge SQL queries.",
  "tailwind-v4": "CSS-first tokens, OKLCH palettes, and responsive utilities.",
  "base-ui": "Accessible unstyled primitives and polymorphic render props.",
  performance: "Render isolation, bundle splitting, and Core Web Vitals.",
}

export const MOCK_CATEGORIES_WITH_COUNT: AdminCategoryWithCount[] =
  MOCK_CATEGORIES.map((category) => ({
    ...category,
    postsCount: MOCK_POSTS.filter((post) =>
      post.categories.some((c) => c.id === category.id)
    ).length,
  }))

export const MOCK_TAGS_WITH_COUNT: AdminTagWithCount[] = MOCK_TAGS.map(
  (tag) => ({
    ...tag,
    description:
      EXTRA_CATEGORY_DESCRIPTIONS[tag.slug] ?? tag.description ?? null,
    postsCount: MOCK_POSTS.filter((post) =>
      post.tags.some((t) => t.id === tag.id)
    ).length,
  })
)
