import type {
  AdminCategory,
  AdminPost,
  AdminPostGroup,
  AdminTag,
} from "./types"

export const MOCK_CATEGORIES: AdminCategory[] = [
  {
    id: "cat-frontend",
    title: "Frontend",
    slug: "frontend",
    description: "UI architecture, React 19, and modern browser rendering.",
    color: "#3b82f6",
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "cat-graphics",
    title: "Graphics & Shaders",
    slug: "graphics-shaders",
    description: "WebGL2, GLSL shaders, canvas physics, and motion craft.",
    color: "#8b5cf6",
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "cat-backend",
    title: "Backend & DB",
    slug: "backend-db",
    description: "Drizzle ORM, PostgreSQL, Neon, and full-stack TypeScript.",
    color: "#10b981",
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "cat-design-system",
    title: "Design Systems",
    slug: "design-systems",
    description:
      "Design tokens, accessibility, Base UI, and shadcn registries.",
    color: "#f59e0b",
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
]

export const MOCK_TAGS: AdminTag[] = [
  {
    id: "tag-react",
    title: "react",
    slug: "react",
    description: null,
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "tag-typescript",
    title: "typescript",
    slug: "typescript",
    description: null,
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "tag-tanstack",
    title: "tanstack-start",
    slug: "tanstack-start",
    description: null,
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "tag-webgl",
    title: "webgl2",
    slug: "webgl2",
    description: null,
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "tag-drizzle",
    title: "drizzle-orm",
    slug: "drizzle-orm",
    description: null,
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "tag-tailwind",
    title: "tailwind-v4",
    slug: "tailwind-v4",
    description: null,
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "tag-base-ui",
    title: "base-ui",
    slug: "base-ui",
    description: null,
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
  {
    id: "tag-performance",
    title: "performance",
    slug: "performance",
    description: null,
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-01T08:00:00.000Z",
  },
]

export const MOCK_GROUPS: AdminPostGroup[] = [
  {
    id: "grp-liquid-glass",
    title: "WebGL2 Liquid Glass UI",
    slug: "webgl2-liquid-glass-ui",
    description:
      "Building refractive, physically inspired glass surfaces on the web.",
    coverImage: "/og-image.png",
    isCompleted: false,
    createdAt: "2026-09-10T08:00:00.000Z",
    updatedAt: "2026-11-12T10:30:00.000Z",
  },
  {
    id: "grp-tanstack-cms",
    title: "TanStack Start + Drizzle CMS",
    slug: "tanstack-start-drizzle-cms",
    description:
      "End-to-end architecture for a high-craft portfolio and headless CMS.",
    coverImage: "/OGimage.jpg",
    isCompleted: false,
    createdAt: "2026-10-02T08:00:00.000Z",
    updatedAt: "2026-11-20T14:00:00.000Z",
  },
  {
    id: "grp-drafting-architecture",
    title: "Swiss Drafting Layout System",
    slug: "swiss-drafting-layout-system",
    description:
      "Hairlines, caliper rulers, and disciplined grid proportions in CSS.",
    coverImage: "/hero-center.png",
    isCompleted: true,
    createdAt: "2026-08-05T08:00:00.000Z",
    updatedAt: "2026-09-28T09:15:00.000Z",
  },
]

const byId = <T extends { id: string }>(items: T[], id: string): T => {
  const found = items.find((item) => item.id === id)
  if (!found) {
    throw new Error(`Missing mock reference: ${id}`)
  }
  return found
}

export const MOCK_POSTS: AdminPost[] = [
  {
    id: "post-01",
    title: "Refractive Liquid Glass Select with WebGL2 and Base UI",
    slug: "refractive-liquid-glass-select-webgl2-base-ui",
    excerpt:
      "How to pair accessible Base UI primitives with a lightweight WebGL2 displacement pass without sacrificing 60fps scroll or keyboard navigation.",
    coverImage: "/og-image.png",
    coverImageAlt: "Liquid Glass Select shader refraction preview",
    groupId: "grp-liquid-glass",
    groupOrder: 1,
    group: byId(MOCK_GROUPS, "grp-liquid-glass"),
    status: "published",
    publishedAt: "2026-11-22T09:00:00.000Z",
    readTime: 11,
    isFeatured: true,
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Capturing DOM Geometry" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Synchronizing DOM bounding boxes with shader uniforms in real time.",
            },
          ],
        },
      ],
    },
    categories: [
      byId(MOCK_CATEGORIES, "cat-graphics"),
      byId(MOCK_CATEGORIES, "cat-frontend"),
    ],
    tags: [
      byId(MOCK_TAGS, "tag-webgl"),
      byId(MOCK_TAGS, "tag-base-ui"),
      byId(MOCK_TAGS, "tag-react"),
    ],
    createdAt: "2026-11-18T11:20:00.000Z",
    updatedAt: "2026-11-22T09:00:00.000Z",
  },
  {
    id: "post-02",
    title: "Designing a Relational Blog Schema with Drizzle ORM & Neon",
    slug: "designing-relational-blog-schema-drizzle-orm-neon",
    excerpt:
      "Structuring posts, many-to-many taxonomies, series ordering, and JSON AST content for sub-10ms edge queries on Neon Serverless PostgreSQL.",
    coverImage: "/OGimage.jpg",
    coverImageAlt: "Drizzle ORM entity relationship diagram",
    groupId: "grp-tanstack-cms",
    groupOrder: 1,
    group: byId(MOCK_GROUPS, "grp-tanstack-cms"),
    status: "published",
    publishedAt: "2026-11-18T14:30:00.000Z",
    readTime: 9,
    isFeatured: true,
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Why Separate Categories & Tags" }],
        },
      ],
    },
    categories: [byId(MOCK_CATEGORIES, "cat-backend")],
    tags: [
      byId(MOCK_TAGS, "tag-drizzle"),
      byId(MOCK_TAGS, "tag-typescript"),
      byId(MOCK_TAGS, "tag-tanstack"),
    ],
    createdAt: "2026-11-14T10:00:00.000Z",
    updatedAt: "2026-11-19T08:45:00.000Z",
  },
  {
    id: "post-03",
    title: "Zero Re-Render Scroll Thresholds in TanStack Start Layouts",
    slug: "zero-rerender-scroll-thresholds-tanstack-start",
    excerpt:
      "Isolating scroll listeners into leaf islands so sticky headers and progress indicators never trigger full-tree reconciliation.",
    coverImage: "/hero-center.png",
    coverImageAlt: "React profiler flamegraph showing isolated scroll state",
    groupId: null,
    groupOrder: null,
    group: null,
    status: "published",
    publishedAt: "2026-11-10T07:15:00.000Z",
    readTime: 7,
    isFeatured: false,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Moving window.scrollY state down into FloatingSiteHeader.",
            },
          ],
        },
      ],
    },
    categories: [byId(MOCK_CATEGORIES, "cat-frontend")],
    tags: [
      byId(MOCK_TAGS, "tag-react"),
      byId(MOCK_TAGS, "tag-performance"),
      byId(MOCK_TAGS, "tag-tanstack"),
    ],
    createdAt: "2026-11-08T16:10:00.000Z",
    updatedAt: "2026-11-10T07:15:00.000Z",
  },
  {
    id: "post-04",
    title: "DOM Snapshot Atlases for Live Backdrop Sampling in WebGL",
    slug: "dom-snapshot-atlases-live-backdrop-sampling-webgl",
    excerpt:
      "Strategies for keeping offscreen canvas snapshots crisp across theme transitions, DPI scaling, and dynamic viewport resizes.",
    coverImage: null,
    coverImageAlt: null,
    groupId: "grp-liquid-glass",
    groupOrder: 2,
    group: byId(MOCK_GROUPS, "grp-liquid-glass"),
    status: "draft",
    publishedAt: "2026-11-26T10:00:00.000Z",
    readTime: 13,
    isFeatured: false,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Draft notes on mipmap generation and DPR clamping.",
            },
          ],
        },
      ],
    },
    categories: [byId(MOCK_CATEGORIES, "cat-graphics")],
    tags: [
      byId(MOCK_TAGS, "tag-webgl"),
      byId(MOCK_TAGS, "tag-performance"),
      byId(MOCK_TAGS, "tag-typescript"),
    ],
    createdAt: "2026-11-23T13:20:00.000Z",
    updatedAt: "2026-11-26T18:05:00.000Z",
  },
  {
    id: "post-05",
    title: "Building a Shadcn-Compatible Registry Pipeline with Vite & TSX",
    slug: "shadcn-compatible-registry-pipeline-vite-tsx",
    excerpt:
      "Generating deterministic component manifests, source previews, and installable CLI payloads directly from your portfolio codebase.",
    coverImage: "/hero-left.png",
    coverImageAlt: "Shadcn registry JSON manifest structure",
    groupId: null,
    groupOrder: null,
    group: null,
    status: "published",
    publishedAt: "2026-10-29T12:00:00.000Z",
    readTime: 8,
    isFeatured: true,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Automating registry.json from typed component descriptors.",
            },
          ],
        },
      ],
    },
    categories: [
      byId(MOCK_CATEGORIES, "cat-design-system"),
      byId(MOCK_CATEGORIES, "cat-frontend"),
    ],
    tags: [byId(MOCK_TAGS, "tag-typescript"), byId(MOCK_TAGS, "tag-tailwind")],
    createdAt: "2026-10-25T09:00:00.000Z",
    updatedAt: "2026-10-29T12:00:00.000Z",
  },
  {
    id: "post-06",
    title: "Server Functions & Session Rotation in TanStack Start",
    slug: "server-functions-session-rotation-tanstack-start",
    excerpt:
      "Implementing passwordChangedAt invalidation and SHA-256 reset tokens alongside Drizzle session tables.",
    coverImage: null,
    coverImageAlt: null,
    groupId: "grp-tanstack-cms",
    groupOrder: 2,
    group: byId(MOCK_GROUPS, "grp-tanstack-cms"),
    status: "draft",
    publishedAt: "2026-11-27T08:00:00.000Z",
    readTime: 10,
    isFeatured: false,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Outline for cookie signing and multi-device revocation.",
            },
          ],
        },
      ],
    },
    categories: [byId(MOCK_CATEGORIES, "cat-backend")],
    tags: [
      byId(MOCK_TAGS, "tag-tanstack"),
      byId(MOCK_TAGS, "tag-drizzle"),
      byId(MOCK_TAGS, "tag-typescript"),
    ],
    createdAt: "2026-11-24T19:30:00.000Z",
    updatedAt: "2026-11-26T22:10:00.000Z",
  },
  {
    id: "post-07",
    title: "Swiss Drafting Grids: Caliper Rulers & Hairline Architecture",
    slug: "swiss-drafting-grids-caliper-rulers-hairline-architecture",
    excerpt:
      "How a 1024px architectural spine, sub-pixel borders, and monospace readouts establish calm visual rhythm across dense portfolios.",
    coverImage: "/hero-right.png",
    coverImageAlt: "Architectural drafting grid guidelines",
    groupId: "grp-drafting-architecture",
    groupOrder: 1,
    group: byId(MOCK_GROUPS, "grp-drafting-architecture"),
    status: "published",
    publishedAt: "2026-09-15T10:30:00.000Z",
    readTime: 6,
    isFeatured: false,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Establishing 6 continuous vertical hairlines across sections.",
            },
          ],
        },
      ],
    },
    categories: [byId(MOCK_CATEGORIES, "cat-design-system")],
    tags: [byId(MOCK_TAGS, "tag-tailwind"), byId(MOCK_TAGS, "tag-react")],
    createdAt: "2026-09-12T08:00:00.000Z",
    updatedAt: "2026-09-15T10:30:00.000Z",
  },
  {
    id: "post-08",
    title: "Proximity-Aware Line Navigation & Magnetic Scroll Indicators",
    slug: "proximity-aware-line-navigation-scroll-indicators",
    excerpt:
      "Using spring physics and pointer-distance curves to make table-of-contents rails feel physical without distracting from reading.",
    coverImage: "/og-image.jpg",
    coverImageAlt: "Line navigation proximity wave animation",
    groupId: "grp-drafting-architecture",
    groupOrder: 2,
    group: byId(MOCK_GROUPS, "grp-drafting-architecture"),
    status: "published",
    publishedAt: "2026-09-24T15:45:00.000Z",
    readTime: 8,
    isFeatured: false,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Gaussian falloff across active TOC ticks with Motion.",
            },
          ],
        },
      ],
    },
    categories: [
      byId(MOCK_CATEGORIES, "cat-frontend"),
      byId(MOCK_CATEGORIES, "cat-design-system"),
    ],
    tags: [byId(MOCK_TAGS, "tag-react"), byId(MOCK_TAGS, "tag-typescript")],
    createdAt: "2026-09-20T11:00:00.000Z",
    updatedAt: "2026-09-24T15:45:00.000Z",
  },
  {
    id: "post-09",
    title: "Base UI Render Props vs Radix asChild in Tailwind v4",
    slug: "base-ui-render-props-vs-radix-aschild-tailwind-v4",
    excerpt:
      "Practical migration notes for polymorphic triggers, data-slot selectors, and OKLCH semantic tokens in component libraries.",
    coverImage: null,
    coverImageAlt: null,
    groupId: null,
    groupOrder: null,
    group: null,
    status: "published",
    publishedAt: "2026-10-12T09:20:00.000Z",
    readTime: 5,
    isFeatured: false,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Comparing mergeProps and useRender ergonomics.",
            },
          ],
        },
      ],
    },
    categories: [byId(MOCK_CATEGORIES, "cat-design-system")],
    tags: [
      byId(MOCK_TAGS, "tag-base-ui"),
      byId(MOCK_TAGS, "tag-tailwind"),
      byId(MOCK_TAGS, "tag-typescript"),
    ],
    createdAt: "2026-10-09T14:00:00.000Z",
    updatedAt: "2026-10-12T09:20:00.000Z",
  },
  {
    id: "post-10",
    title: "Tiptap JSON AST Serialization & Code Highlighting with Shiki",
    slug: "tiptap-json-ast-serialization-shiki-highlighting",
    excerpt:
      "Rendering typed ProseMirror JSON nodes cleanly on the server while keeping bundle size near zero on blog detail pages.",
    coverImage: null,
    coverImageAlt: null,
    groupId: "grp-tanstack-cms",
    groupOrder: 3,
    group: byId(MOCK_GROUPS, "grp-tanstack-cms"),
    status: "draft",
    publishedAt: "2026-11-27T09:00:00.000Z",
    readTime: 12,
    isFeatured: false,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Walkthrough of AST node visitors and Shiki transformer hooks.",
            },
          ],
        },
      ],
    },
    categories: [
      byId(MOCK_CATEGORIES, "cat-frontend"),
      byId(MOCK_CATEGORIES, "cat-backend"),
    ],
    tags: [byId(MOCK_TAGS, "tag-typescript"), byId(MOCK_TAGS, "tag-tanstack")],
    createdAt: "2026-11-25T16:40:00.000Z",
    updatedAt: "2026-11-27T07:50:00.000Z",
  },
  {
    id: "post-11",
    title: "Legacy MDX Frontmatter Loader Notes (Pre-Neon Migration)",
    slug: "legacy-mdx-frontmatter-loader-notes",
    excerpt:
      "Archived engineering notes documenting the file-system MDX pipeline prior to migrating blog articles into PostgreSQL.",
    coverImage: null,
    coverImageAlt: null,
    groupId: null,
    groupOrder: null,
    group: null,
    status: "archived",
    publishedAt: "2026-06-14T10:00:00.000Z",
    readTime: 4,
    isFeatured: false,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Kept for historical reference of remark-mdx-frontmatter.",
            },
          ],
        },
      ],
    },
    categories: [byId(MOCK_CATEGORIES, "cat-frontend")],
    tags: [byId(MOCK_TAGS, "tag-typescript")],
    createdAt: "2026-06-12T10:00:00.000Z",
    updatedAt: "2026-09-02T11:00:00.000Z",
  },
  {
    id: "post-12",
    title: "Early Prototype: Framer Motion vs GSAP Timeline Benchmarks",
    slug: "early-prototype-motion-vs-gsap-benchmarks",
    excerpt:
      "Old benchmark comparison retained in archive after standardizing UI primitives on Motion and canvas scenes on custom RAF loops.",
    coverImage: null,
    coverImageAlt: null,
    groupId: null,
    groupOrder: null,
    group: null,
    status: "archived",
    publishedAt: "2026-05-20T08:30:00.000Z",
    readTime: 6,
    isFeatured: false,
    content: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Archived benchmark results across 200 animated nodes.",
            },
          ],
        },
      ],
    },
    categories: [byId(MOCK_CATEGORIES, "cat-graphics")],
    tags: [byId(MOCK_TAGS, "tag-performance"), byId(MOCK_TAGS, "tag-react")],
    createdAt: "2026-05-18T14:00:00.000Z",
    updatedAt: "2026-08-19T17:15:00.000Z",
  },
]
