import { createFileRoute, Link } from "@tanstack/react-router"
import {
  Clock,
  ExternalLink,
  FilePlus,
  FileText,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react"
import { useState } from "react"

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/ui"

export const Route = createFileRoute("/admin/posts/")({
  component: AdminPostsListPage,
})

export interface MockPost {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  category: string
  series?: string
  readTime: number
  status: "published" | "draft" | "archived"
  isFeatured: boolean
  publishedAt: string
  views: number
}

export const INITIAL_POSTS: MockPost[] = [
  {
    id: "p-1",
    title: "Building Modern Micro-Frontends with Vite 8 & React 19",
    slug: "modern-micro-frontends-vite-8-react-19",
    excerpt:
      "A deep dive into Module Federation, asynchronous SSR hydration, and atomic state design in React 19.",
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    category: "Architecture",
    series: "Vite 8 Deep Dives",
    readTime: 7,
    status: "published",
    isFeatured: true,
    publishedAt: "2026-09-08",
    views: 1420,
  },
  {
    id: "p-2",
    title: "Neon Postgres & Drizzle ORM: Serverless DB at Zero Latency",
    slug: "neon-postgres-drizzle-orm-zero-latency",
    excerpt:
      "Complete guide to connection pooling, migrations, and WebSocket drivers using Neon and Drizzle.",
    coverImage:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80",
    category: "Backend",
    series: "Serverless Mastery",
    readTime: 6,
    status: "published",
    isFeatured: true,
    publishedAt: "2026-09-02",
    views: 980,
  },
  {
    id: "p-3",
    title: "Crafting High-End Component Registries with Tailwind CSS v4",
    slug: "crafting-high-end-component-registries-tailwind-v4",
    excerpt:
      "How to engineer custom shadcn registries and distribute reusable UI primitives without bloated dependencies.",
    coverImage:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    category: "Design System",
    readTime: 5,
    status: "published",
    isFeatured: false,
    publishedAt: "2026-08-28",
    views: 1850,
  },
  {
    id: "p-4",
    title: "Zero-Bundle-Size Mathematical Shaders with Paper Shaders",
    slug: "zero-bundle-size-mathematical-shaders",
    excerpt:
      "Integrating WebGL canvas shaders into interactive portfolio hero banners without degrading Lighthouse performance.",
    coverImage:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
    category: "Graphics & 3D",
    readTime: 8,
    status: "draft",
    isFeatured: false,
    publishedAt: "2026-09-12",
    views: 0,
  },
  {
    id: "p-5",
    title: "TanStack Router vs Next.js App Router: 2026 Production Benchmark",
    slug: "tanstack-router-vs-nextjs-app-router",
    excerpt:
      "Why TanStack Start and file-based route tree generation are winning developer mindshare.",
    coverImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    category: "Architecture",
    readTime: 10,
    status: "draft",
    isFeatured: false,
    publishedAt: "2026-09-11",
    views: 0,
  },
]

function AdminPostsListPage() {
  const [posts, setPosts] = useState<MockPost[]>(INITIAL_POSTS)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const handleDeletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const filteredPosts = posts.filter((post) => {
    const matchesTab = activeTab === "all" ? true : post.status === activeTab
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Blog Posts
            </h1>
            <Badge
              variant="outline"
              className="rounded-md border-border/80 bg-muted/40 font-mono text-xs"
            >
              {posts.length} Articles
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Create, write, and manage technical articles published to your
            portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            size="sm"
            className="h-9 gap-1.5 rounded-lg px-3.5 text-xs font-semibold shadow-xs"
          >
            <Link to="/admin/posts/new">
              <FilePlus className="size-4" />
              <span>New Post</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── Search & Tab Filters ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full sm:w-auto"
        >
          <TabsList className="h-9 rounded-lg bg-muted/60 p-1">
            <TabsTrigger
              value="all"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              All ({posts.length})
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              Published ({posts.filter((p) => p.status === "published").length})
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              Drafts ({posts.filter((p) => p.status === "draft").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts, category or slug..."
            className="h-9 rounded-lg border-border/80 bg-card/50 pl-8 text-xs"
          />
        </div>
      </div>

      {/* ─── Posts List / Table ─── */}
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card/60 shadow-xs backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                <th className="py-3 pr-3 pl-4">Article</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Read Time</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Views</th>
                <th className="py-3 pr-4 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <FileText className="mx-auto mb-2 size-8 text-muted-foreground/40" />
                    <p className="font-medium text-foreground">
                      No blog posts found
                    </p>
                    <p className="text-xs">
                      Try searching for something else or create a new post.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <td className="py-3.5 pr-3 pl-4">
                      <Link
                        to="/admin/posts/$id"
                        params={{ id: post.id }}
                        className="flex items-center gap-3"
                      >
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="size-11 shrink-0 rounded-lg border border-border/70 object-cover shadow-2xs"
                        />
                        <div className="max-w-md min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
                              {post.title}
                            </span>
                            {post.isFeatured && (
                              <Badge
                                variant="outline"
                                className="shrink-0 rounded-md border-amber-500/30 bg-amber-500/10 px-1.5 py-0 text-[10px] font-medium text-amber-500"
                              >
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="truncate font-mono text-[11px] text-muted-foreground">
                            /{post.slug}
                          </p>
                        </div>
                      </Link>
                    </td>

                    <td className="px-3 py-3.5">
                      <Badge
                        variant="outline"
                        className="rounded-md border-border/80 bg-muted/40 font-normal text-muted-foreground"
                      >
                        {post.category}
                      </Badge>
                      {post.series && (
                        <p className="mt-0.5 max-w-[120px] truncate text-[10px] text-muted-foreground">
                          {post.series}
                        </p>
                      )}
                    </td>

                    <td className="px-3 py-3.5 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="size-3" />
                        <span>{post.readTime} min</span>
                      </div>
                    </td>

                    <td className="px-3 py-3.5">
                      {post.status === "published" ? (
                        <div className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-500">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          <span>Published</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-500">
                          <span className="size-1.5 rounded-full bg-amber-500" />
                          <span>Draft</span>
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-3.5 text-muted-foreground">
                      {post.publishedAt}
                    </td>

                    <td className="px-3 py-3.5 font-mono text-muted-foreground">
                      {post.views.toLocaleString()}
                    </td>

                    <td className="py-3.5 pr-4 pl-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-7 rounded-lg p-0 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 rounded-lg"
                        >
                          <DropdownMenuItem asChild className="gap-2 text-xs">
                            <Link
                              to="/admin/posts/$id"
                              params={{ id: post.id }}
                            >
                              <Pencil className="size-3.5" />
                              <span>Edit Post</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="gap-2 text-xs">
                            <Link to={`/blog/${post.slug}`} target="_blank">
                              <ExternalLink className="size-3.5" />
                              <span>Live Preview</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeletePost(post.id)}
                            className="gap-2 text-xs text-destructive focus:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
