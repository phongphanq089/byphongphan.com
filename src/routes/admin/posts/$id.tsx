import { createFileRoute, useNavigate } from "@tanstack/react-router"

import {
  BlogPostEditor,
  type PostFormValues,
} from "@/features/admin/blog-editor"

import { INITIAL_POSTS } from "./index"

export const Route = createFileRoute("/admin/posts/$id")({
  component: AdminEditPostPage,
})

function AdminEditPostPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()

  // Find post from mock data or supply realistic fallback
  const existingPost = INITIAL_POSTS.find((p) => p.id === id) || {
    id,
    title: "Building Modern Micro-Frontends with Vite 8 & React 19",
    slug: "modern-micro-frontends-vite-8-react-19",
    excerpt:
      "A deep dive into Module Federation, asynchronous SSR hydration, and atomic state design in React 19.",
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    category: "Architecture",
    series: "Vite 8 Deep Dives",
    readTime: 7,
    status: "published" as const,
    isFeatured: true,
    publishedAt: "2026-09-08",
    views: 1420,
  }

  const initialData: Partial<PostFormValues> = {
    title: existingPost.title,
    slug: existingPost.slug,
    excerpt: existingPost.excerpt,
    category: existingPost.category,
    readTime: existingPost.readTime,
    status: existingPost.status,
    isFeatured: existingPost.isFeatured,
    publishedAt: existingPost.publishedAt,
    content: `# ${existingPost.title}

## Overview

Modern web architectures are evolving rapidly. In this article, we explore how **Vite 8** combined with **React 19** primitives unlocks unparalleled developer experience and blazing-fast production bundling.

### Key Architectural Pillars:

1. **Compilation Speed:** Next-generation compilation powered by native toolchains.
2. **Serverless Data Streaming:** Hydrating server components without blocking the main event loop.
3. **Atomic State Isolation:** Combining Zustand with TanStack Router state caches.

\`\`\`typescript
import { createServerFn } from "@tanstack/react-start"

export const fetchArticles = createServerFn({ method: "GET" })
  .validator((d: { page: number }) => d)
  .handler(async ({ data }) => {
    return await db.query.posts.findMany({
      limit: 10,
      offset: (data.page - 1) * 10,
    })
  })
\`\`\`

> "A great software architecture minimizes cognitive friction while maximizing performance for end users."

## Conclusion

By adopting file-based routing and atomic design layers, you maintain full control over both server-rendered initial HTML and client-hydrated reactive states.
`,
    tags: ["React 19", "Vite 8", "Architecture"],
  }

  const handleSave = (values: PostFormValues) => {
    console.log("Updating article:", id, values)
    navigate({ to: "/admin/posts" })
  }

  return (
    <BlogPostEditor
      initialData={initialData}
      isNew={false}
      onSave={handleSave}
    />
  )
}
