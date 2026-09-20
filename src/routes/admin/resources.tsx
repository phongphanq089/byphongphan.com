import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute } from "@tanstack/react-router"
import {
  ExternalLink,
  Globe,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  FileUpload,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/shared/ui"

export const Route = createFileRoute("/admin/resources")({
  component: AdminResourcesPage,
})

const resourceFormSchema = z.object({
  title: z
    .string()
    .min(2, "Tool title must be at least 2 characters")
    .max(100, "Title cannot exceed 100 characters"),
  url: z
    .string()
    .min(1, "URL is required")
    .url("Please enter a valid URL with protocol (e.g. https://originui.com)"),
  category: z.string().min(1, "Please select a category"),
  pricing: z.enum(["Free", "MIT", "Freemium", "Paid"]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description cannot exceed 300 characters"),
  isFeatured: z.boolean(),
})

type ResourceFormValues = z.infer<typeof resourceFormSchema>

interface MockResource {
  id: string
  title: string
  slug: string
  url: string
  description: string
  category: string
  pricing: "Free" | "MIT" | "Freemium" | "Paid"
  isFeatured: boolean
  coverImage: string
  publishedAt: string
}

const INITIAL_RESOURCES: MockResource[] = [
  {
    id: "r-1",
    title: "Paper Shaders",
    slug: "paper-shaders",
    url: "https://shaders.paper.design",
    description:
      "Curated collection of mathematical canvas WebGL shaders for modern websites.",
    category: "3D & Shaders",
    pricing: "Free",
    isFeatured: true,
    coverImage:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
    publishedAt: "2026-09-01",
  },
  {
    id: "r-2",
    title: "Origin UI",
    slug: "origin-ui",
    url: "https://originui.com",
    description:
      "Beautiful animated primitives and Tailwind CSS component registry.",
    category: "UI Libraries",
    pricing: "MIT",
    isFeatured: true,
    coverImage:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    publishedAt: "2026-08-25",
  },
  {
    id: "r-3",
    title: "Neon Postgres Serverless",
    slug: "neon-postgres",
    url: "https://neon.tech",
    description:
      "Serverless Postgres with instant branching, autoscaling, and zero cold-starts.",
    category: "Dev Tools",
    pricing: "Freemium",
    isFeatured: true,
    coverImage:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80",
    publishedAt: "2026-08-20",
  },
  {
    id: "r-4",
    title: "Lucide Icons",
    slug: "lucide-icons",
    url: "https://lucide.dev",
    description:
      "Beautiful and consistent open-source icon set designed for digital interfaces.",
    category: "Icons",
    pricing: "MIT",
    isFeatured: false,
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    publishedAt: "2026-08-15",
  },
  {
    id: "r-5",
    title: "Geist Font Family",
    slug: "geist-font",
    url: "https://vercel.com/font",
    description:
      "Geometric sans and mono typeface crafted by Vercel for code and interfaces.",
    category: "Typography",
    pricing: "MIT",
    isFeatured: false,
    coverImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    publishedAt: "2026-08-10",
  },
]

function AdminResourcesPage() {
  const [resources, setResources] = useState<MockResource[]>(INITIAL_RESOURCES)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<MockResource | null>(
    null
  )
  const [uploadedCover, setUploadedCover] = useState<unknown[]>([])

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: "",
      url: "",
      category: "UI Libraries",
      pricing: "Free",
      description: "",
      isFeatured: false,
    },
    mode: "onChange",
  })

  const { control, handleSubmit, reset } = form

  const openCreateSheet = () => {
    setEditingResource(null)
    reset({
      title: "",
      url: "",
      category: "UI Libraries",
      pricing: "Free",
      description: "",
      isFeatured: false,
    })
    setUploadedCover([])
    setIsSheetOpen(true)
  }

  const openEditSheet = (res: MockResource) => {
    setEditingResource(res)
    reset({
      title: res.title,
      url: res.url,
      category: res.category,
      pricing: res.pricing,
      description: res.description,
      isFeatured: res.isFeatured,
    })
    setUploadedCover([])
    setIsSheetOpen(true)
  }

  const onFormSubmit = (values: ResourceFormValues) => {
    if (editingResource) {
      setResources((prev) =>
        prev.map((r) =>
          r.id === editingResource.id
            ? {
                ...r,
                title: values.title,
                url: values.url,
                description: values.description,
                category: values.category,
                pricing: values.pricing,
                isFeatured: values.isFeatured,
              }
            : r
        )
      )
    } else {
      const newRes: MockResource = {
        id: `r-${crypto.randomUUID().slice(0, 8)}`,
        title: values.title,
        slug: values.title.toLowerCase().replace(/\s+/g, "-"),
        url: values.url,
        description: values.description,
        category: values.category,
        pricing: values.pricing,
        isFeatured: values.isFeatured,
        coverImage:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
        publishedAt: new Date().toISOString().split("T")[0],
      }
      setResources([newRes, ...resources])
    }
    setIsSheetOpen(false)
  }

  const handleDelete = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id))
  }

  const toggleFeatured = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFeatured: !r.isFeatured } : r))
    )
  }

  const filteredResources = resources.filter((res) => {
    const matchesCategory =
      categoryFilter === "all" ? true : res.category === categoryFilter
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.url.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Resources & Tools
            </h1>
            <Badge
              variant="outline"
              className="rounded-md border-border/80 bg-muted/40 text-xs"
            >
              {resources.length} Listed
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Curated developer libraries, assets, UI components, and software
            bookmarks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={openCreateSheet}
            size="sm"
            className="h-9 gap-1.5 rounded-lg px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Add Resource</span>
          </Button>
        </div>
      </div>

      {/* ─── Search & Category Filters ─── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={categoryFilter}
          onValueChange={setCategoryFilter}
          className="w-full sm:w-auto"
        >
          <TabsList className="h-9 rounded-lg bg-muted/60 p-1">
            <TabsTrigger
              value="all"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="UI Libraries"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              UI Libraries
            </TabsTrigger>
            <TabsTrigger
              value="3D & Shaders"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              3D & Shaders
            </TabsTrigger>
            <TabsTrigger
              value="Dev Tools"
              className="rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-xs"
            >
              Dev Tools
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools by name, url..."
            className="h-9 rounded-lg border-border/80 bg-card/50 pl-8 text-xs"
          />
        </div>
      </div>

      {/* ─── Resources Table ─── */}
      <div className="overflow-hidden rounded-xl border border-border/80 bg-card/60 shadow-xs backdrop-blur-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                <th className="py-3 pr-3 pl-4">Tool / Resource</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Pricing</th>
                <th className="px-3 py-3">Featured</th>
                <th className="px-3 py-3">Added Date</th>
                <th className="py-3 pr-4 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredResources.map((res) => (
                <tr
                  key={res.id}
                  className="group transition-colors hover:bg-muted/30"
                >
                  <td className="py-3.5 pr-3 pl-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={res.coverImage}
                        alt={res.title}
                        className="size-10 shrink-0 rounded-lg border border-border/70 object-cover shadow-2xs"
                      />
                      <div className="max-w-sm min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
                            {res.title}
                          </span>
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground/60 hover:text-foreground"
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                        <p className="truncate text-[11px] text-muted-foreground">
                          {res.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3.5">
                    <Badge
                      variant="outline"
                      className="rounded-md border-border/80 bg-muted/40 font-normal text-muted-foreground"
                    >
                      {res.category}
                    </Badge>
                  </td>

                  <td className="px-3 py-3.5">
                    {res.pricing === "Free" && (
                      <Badge
                        variant="outline"
                        className="rounded-md border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400"
                      >
                        Free
                      </Badge>
                    )}
                    {res.pricing === "MIT" && (
                      <Badge
                        variant="outline"
                        className="rounded-md border-blue-500/30 bg-blue-500/10 text-[10px] text-blue-400"
                      >
                        MIT
                      </Badge>
                    )}
                    {res.pricing === "Freemium" && (
                      <Badge
                        variant="outline"
                        className="rounded-md border-purple-500/30 bg-purple-500/10 text-[10px] text-purple-400"
                      >
                        Freemium
                      </Badge>
                    )}
                    {res.pricing === "Paid" && (
                      <Badge
                        variant="outline"
                        className="rounded-md border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-400"
                      >
                        Paid
                      </Badge>
                    )}
                  </td>

                  <td className="px-3 py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleFeatured(res.id)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`size-4 transition-colors ${
                          res.isFeatured
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/40 hover:text-foreground"
                        }`}
                      />
                    </button>
                  </td>

                  <td className="px-3 py-3.5 text-muted-foreground">
                    {res.publishedAt}
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
                        className="w-36 rounded-lg"
                      >
                        <DropdownMenuItem
                          onClick={() => openEditSheet(res)}
                          className="gap-2 text-xs"
                        >
                          <Pencil className="size-3.5" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="gap-2 text-xs">
                          <a href={res.url} target="_blank" rel="noreferrer">
                            <Globe className="size-3.5" />
                            <span>Visit Site</span>
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(res.id)}
                          className="gap-2 text-xs text-destructive focus:text-destructive"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Sheet: Add / Edit Resource With Zod Form ─── */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-full space-y-6 overflow-y-auto p-6 sm:max-w-xl"
        >
          <SheetHeader className="space-y-1">
            <SheetTitle className="text-lg font-bold">
              {editingResource ? "Edit Resource" : "Add New Resource"}
            </SheetTitle>
            <SheetDescription className="text-xs">
              Add a curated developer tool or library to your showcase.
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tool Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Origin UI"
                        className="h-9 rounded-lg text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://originui.com"
                        className="h-9 rounded-lg text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-9 w-full rounded-lg text-xs">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="UI Libraries">
                            UI Libraries
                          </SelectItem>
                          <SelectItem value="3D & Shaders">
                            3D & Shaders
                          </SelectItem>
                          <SelectItem value="Dev Tools">Dev Tools</SelectItem>
                          <SelectItem value="Icons">Icons</SelectItem>
                          <SelectItem value="Typography">Typography</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="pricing"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Model</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-9 w-full rounded-lg text-xs">
                          <SelectValue placeholder="Select pricing" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="Free">Free (100% Free)</SelectItem>
                          <SelectItem value="MIT">MIT License</SelectItem>
                          <SelectItem value="Freemium">Freemium</SelectItem>
                          <SelectItem value="Paid">
                            Paid / Commercial
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Briefly describe what this resource provides..."
                        rows={3}
                        className="rounded-lg text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custom FilePond Screenshot Upload */}
              <div className="space-y-2">
                <FormLabel>Resource Screenshot / Preview</FormLabel>
                <FileUpload
                  variant="cover"
                  files={uploadedCover}
                  onupdatefiles={setUploadedCover}
                  maxFileSize="10MB"
                  acceptedFileTypes={["image/png", "image/jpeg", "image/webp"]}
                />
              </div>

              {/* Featured Switch */}
              <FormField
                control={control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border border-border/70 bg-card/40 p-3.5">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground">
                        Featured Tool
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Highlight this resource in the top showcase grid.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <SheetFooter className="flex-row items-center justify-end gap-2.5 border-t border-border/80 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSheetOpen(false)}
                  className="h-9 rounded-lg text-xs font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Resource
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
