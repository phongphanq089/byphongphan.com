import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute } from "@tanstack/react-router"
import {
  FolderTree,
  Hash,
  Pencil,
  Plus,
  Search,
  Tags,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/shared/ui"

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategoriesPage,
})

const categoryFormSchema = z.object({
  title: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Color must be a valid HEX code (e.g. #dc2626)"
    ),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(250, "Description cannot exceed 250 characters"),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

const tagFormSchema = z.object({
  title: z
    .string()
    .min(2, "Tag name must be at least 2 characters")
    .max(50, "Tag name cannot exceed 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
})

type TagFormValues = z.infer<typeof tagFormSchema>

interface MockCategory {
  id: string
  title: string
  slug: string
  description: string
  color: string
  postCount: number
}

interface MockTag {
  id: string
  title: string
  slug: string
  postCount: number
}

const INITIAL_CATEGORIES: MockCategory[] = [
  {
    id: "c-1",
    title: "Architecture",
    slug: "architecture",
    description:
      "System design, micro-frontends, monorepos, and clean boundaries.",
    color: "#dc2626",
    postCount: 6,
  },
  {
    id: "c-2",
    title: "Backend & Database",
    slug: "backend",
    description: "Neon serverless PostgreSQL, Drizzle ORM, APIs, and caching.",
    color: "#3b82f6",
    postCount: 4,
  },
  {
    id: "c-3",
    title: "Design System",
    slug: "design-system",
    description:
      "Tailwind CSS v4, component registries, accessible primitives.",
    color: "#10b981",
    postCount: 8,
  },
  {
    id: "c-4",
    title: "Graphics & 3D",
    slug: "graphics-3d",
    description:
      "Paper shaders, Three.js, WebGL canvases, and smooth interactions.",
    color: "#8b5cf6",
    postCount: 3,
  },
  {
    id: "c-5",
    title: "Performance",
    slug: "performance",
    description:
      "Zero-bundle-size optimizations, Core Web Vitals, and Vite bundling.",
    color: "#f59e0b",
    postCount: 5,
  },
]

const INITIAL_TAGS: MockTag[] = [
  { id: "t-1", title: "React 19", slug: "react-19", postCount: 9 },
  { id: "t-2", title: "Vite 8", slug: "vite-8", postCount: 5 },
  { id: "t-3", title: "Tailwind CSS v4", slug: "tailwind-v4", postCount: 8 },
  { id: "t-4", title: "Drizzle ORM", slug: "drizzle-orm", postCount: 4 },
  { id: "t-5", title: "Neon DB", slug: "neon-db", postCount: 4 },
  { id: "t-6", title: "TypeScript", slug: "typescript", postCount: 12 },
  {
    id: "t-7",
    title: "TanStack Router",
    slug: "tanstack-router",
    postCount: 7,
  },
  { id: "t-8", title: "Framer Motion", slug: "framer-motion", postCount: 6 },
  { id: "t-9", title: "Zustand", slug: "zustand", postCount: 3 },
  {
    id: "t-10",
    title: "Web Performance",
    slug: "web-performance",
    postCount: 4,
  },
]

function AdminCategoriesPage() {
  const [categories, setCategories] =
    useState<MockCategory[]>(INITIAL_CATEGORIES)
  const [tags, setTags] = useState<MockTag[]>(INITIAL_TAGS)
  const [activeTab, setActiveTab] = useState("categories")
  const [searchQuery, setSearchQuery] = useState("")

  // Category Dialog State with Hook Form
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false)
  const [editingCat, setEditingCat] = useState<MockCategory | null>(null)

  const catForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      color: "#dc2626",
      description: "",
    },
    mode: "onChange",
  })

  // Tag Dialog State with Hook Form
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<MockTag | null>(null)

  const tagForm = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
    mode: "onChange",
  })

  const openCreateCat = () => {
    setEditingCat(null)
    catForm.reset({
      title: "",
      slug: "",
      color: "#dc2626",
      description: "",
    })
    setIsCatDialogOpen(true)
  }

  const openEditCat = (cat: MockCategory) => {
    setEditingCat(cat)
    catForm.reset({
      title: cat.title,
      slug: cat.slug,
      color: cat.color,
      description: cat.description,
    })
    setIsCatDialogOpen(true)
  }

  const onCatSubmit = (values: CategoryFormValues) => {
    if (editingCat) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCat.id ? { ...c, ...values } : c))
      )
    } else {
      const newCat: MockCategory = {
        id: `c-${crypto.randomUUID().slice(0, 8)}`,
        ...values,
        postCount: 0,
      }
      setCategories([...categories, newCat])
    }
    setIsCatDialogOpen(false)
  }

  const openCreateTag = () => {
    setEditingTag(null)
    tagForm.reset({
      title: "",
      slug: "",
    })
    setIsTagDialogOpen(true)
  }

  const onTagSubmit = (values: TagFormValues) => {
    if (editingTag) {
      setTags((prev) =>
        prev.map((t) => (t.id === editingTag.id ? { ...t, ...values } : t))
      )
    } else {
      const newTag: MockTag = {
        id: `t-${crypto.randomUUID().slice(0, 8)}`,
        ...values,
        postCount: 0,
      }
      setTags([...tags, newTag])
    }
    setIsTagDialogOpen(false)
  }

  const filteredCategories = categories.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTags = tags.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Categories & Tags
            </h1>
            <Badge
              variant="outline"
              className="rounded-md border-border/80 bg-muted/40 text-xs"
            >
              Taxonomy
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Organize articles with structured categories and granular search
            tags.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeTab === "categories" ? (
            <Button
              onClick={openCreateCat}
              size="sm"
              className="h-9 gap-1.5 rounded-lg px-3.5 text-xs font-semibold shadow-xs"
            >
              <Plus className="size-4" />
              <span>New Category</span>
            </Button>
          ) : (
            <Button
              onClick={openCreateTag}
              size="sm"
              className="h-9 gap-1.5 rounded-lg px-3.5 text-xs font-semibold shadow-xs"
            >
              <Plus className="size-4" />
              <span>New Tag</span>
            </Button>
          )}
        </div>
      </div>

      {/* ─── Tabs & Search ─── */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="h-9 rounded-lg bg-muted/60 p-1">
            <TabsTrigger
              value="categories"
              className="gap-1.5 rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              <FolderTree className="size-3.5" />
              <span>Categories ({categories.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="tags"
              className="gap-1.5 rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              <Tags className="size-3.5" />
              <span>Tags ({tags.length})</span>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search taxonomy..."
              className="h-9 rounded-lg border-border/80 bg-card/50 pl-8 text-xs"
            />
          </div>
        </div>

        {/* ─── Categories Content ─── */}
        <TabsContent value="categories" className="m-0">
          <div className="overflow-hidden rounded-xl border border-border/80 bg-card/60 shadow-xs backdrop-blur-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                  <th className="py-3 pr-3 pl-4">Category</th>
                  <th className="px-3 py-3">Slug</th>
                  <th className="px-3 py-3">Description</th>
                  <th className="px-3 py-3">Articles</th>
                  <th className="py-3 pr-4 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <td className="py-3.5 pr-3 pl-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="size-3 shrink-0 rounded-full shadow-2xs"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
                          {cat.title}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3.5 text-muted-foreground">
                      /{cat.slug}
                    </td>

                    <td className="max-w-sm truncate px-3 py-3.5 text-muted-foreground">
                      {cat.description}
                    </td>

                    <td className="px-3 py-3.5">
                      <Badge
                        variant="outline"
                        className="rounded-md border-border/80 bg-muted/40 text-[11px]"
                      >
                        {cat.postCount}
                      </Badge>
                    </td>

                    <td className="py-3.5 pr-4 pl-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditCat(cat)}
                          className="h-7 rounded-lg px-2 text-xs"
                        >
                          <Pencil className="size-3" />
                          <span className="ml-1">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setCategories((prev) =>
                              prev.filter((c) => c.id !== cat.id)
                            )
                          }
                          className="h-7 w-7 rounded-lg p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ─── Tags Content ─── */}
        <TabsContent value="tags" className="m-0 space-y-4">
          {/* Tags Cloud Preview */}
          <div className="rounded-xl border border-border/70 bg-card/40 p-4">
            <p className="mb-2.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Active Tags Cloud
            </p>
            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="cursor-pointer rounded-md border-border/80 bg-muted/30 px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                >
                  <Hash className="mr-0.5 size-3 text-muted-foreground" />
                  <span>{tag.title}</span>
                  <span className="ml-1.5 text-[10px] text-muted-foreground">
                    ({tag.postCount})
                  </span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Tags Data Table */}
          <div className="overflow-hidden rounded-xl border border-border/80 bg-card/60 shadow-xs backdrop-blur-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                  <th className="py-3 pr-3 pl-4">Tag Name</th>
                  <th className="px-3 py-3">Slug</th>
                  <th className="px-3 py-3">Associated Posts</th>
                  <th className="py-3 pr-4 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTags.map((tag) => (
                  <tr
                    key={tag.id}
                    className="group transition-colors hover:bg-muted/30"
                  >
                    <td className="py-3 pr-3 pl-4 font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <Hash className="size-3 text-primary" />
                        <span>{tag.title}</span>
                      </div>
                    </td>

                    <td className="px-3 py-3 text-muted-foreground">
                      #{tag.slug}
                    </td>

                    <td className="px-3 py-3">
                      <Badge
                        variant="outline"
                        className="rounded-md border-border/80 bg-muted/40 text-[11px]"
                      >
                        {tag.postCount}
                      </Badge>
                    </td>

                    <td className="py-3 pr-4 pl-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setTags((prev) => prev.filter((t) => t.id !== tag.id))
                        }
                        className="h-7 w-7 rounded-lg p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Dialog: Create/Edit Category With Zod Validation ─── */}
      <Dialog open={isCatDialogOpen} onOpenChange={setIsCatDialogOpen}>
        <DialogContent className="rounded-xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingCat ? "Edit Category" : "New Category"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Define a top-level classification topic for articles.
            </DialogDescription>
          </DialogHeader>

          <Form {...catForm}>
            <form
              onSubmit={catForm.handleSubmit(onCatSubmit)}
              className="space-y-4 py-2"
            >
              <FormField
                control={catForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          if (!editingCat) {
                            catForm.setValue(
                              "slug",
                              e.target.value
                                .toLowerCase()
                                .replace(/[\s_]+/g, "-"),
                              { shouldValidate: true }
                            )
                          }
                        }}
                        placeholder="e.g. Performance & Optimization"
                        className="h-9 rounded-lg text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={catForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="category-slug"
                        className="h-9 rounded-lg text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={catForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme Color (HEX)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="color"
                          value={field.value}
                          onChange={field.onChange}
                          className="size-8 cursor-pointer rounded-lg border border-border/80 bg-transparent p-0.5"
                        />
                        <Input
                          {...field}
                          placeholder="#dc2626"
                          className="h-9 w-32 rounded-lg text-xs"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={catForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Brief category scope..."
                        rows={2}
                        className="rounded-lg text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCatDialogOpen(false)}
                  className="h-9 rounded-lg text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Category
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ─── Dialog: Create Tag With Zod Validation ─── */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent className="rounded-xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">New Tag</DialogTitle>
            <DialogDescription className="text-xs">
              Add a granular hashtag for search and filtering.
            </DialogDescription>
          </DialogHeader>

          <Form {...tagForm}>
            <form
              onSubmit={tagForm.handleSubmit(onTagSubmit)}
              className="space-y-3 py-2"
            >
              <FormField
                control={tagForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          if (!editingTag) {
                            tagForm.setValue(
                              "slug",
                              e.target.value
                                .toLowerCase()
                                .replace(/[\s_]+/g, "-"),
                              { shouldValidate: true }
                            )
                          }
                        }}
                        placeholder="e.g. Next.js 15"
                        className="h-9 rounded-lg text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={tagForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="next-js-15"
                        className="h-9 rounded-lg text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTagDialogOpen(false)}
                  className="h-9 rounded-lg text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 rounded-lg text-xs font-semibold shadow-xs"
                >
                  Add Tag
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
