import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  BookOpen,
  Layers,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Switch,
  Textarea,
} from "@/shared/ui"

export const Route = createFileRoute("/admin/groups")({
  component: AdminGroupsPage,
})

const seriesFormSchema = z.object({
  title: z
    .string()
    .min(3, "Series title must be at least 3 characters")
    .max(120, "Title cannot exceed 120 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase alphanumeric characters and hyphens"
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(300, "Description cannot exceed 300 characters"),
  isCompleted: z.boolean(),
})

type SeriesFormValues = z.infer<typeof seriesFormSchema>

interface MockSeries {
  id: string
  title: string
  slug: string
  description: string
  coverImage: string
  postCount: number
  isCompleted: boolean
  updatedAt: string
}

const INITIAL_SERIES: MockSeries[] = [
  {
    id: "g-1",
    title: "Vite 8 & React 19 Next-Gen Architecture",
    slug: "vite-8-react-19-architecture",
    description:
      "A comprehensive multi-part series covering TanStack Start, React 19 Actions, compilation speed, and module federation.",
    coverImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    postCount: 4,
    isCompleted: false,
    updatedAt: "2026-09-08",
  },
  {
    id: "g-2",
    title: "Serverless Postgres & Drizzle ORM Mastery",
    slug: "serverless-postgres-drizzle-mastery",
    description:
      "From zero setup with Neon database to enterprise connection pooling, schema migrations, and full-text search indexing.",
    coverImage:
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80",
    postCount: 3,
    isCompleted: true,
    updatedAt: "2026-09-02",
  },
  {
    id: "g-3",
    title: "Building Component Registries with Tailwind CSS v4",
    slug: "building-component-registries-tailwind-v4",
    description:
      "Guide to designing, structuring, and distributing your own UI component registry like ui.shadcn.com and Origin UI.",
    coverImage:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    postCount: 2,
    isCompleted: false,
    updatedAt: "2026-08-28",
  },
]

function AdminGroupsPage() {
  const [seriesList, setSeriesList] = useState<MockSeries[]>(INITIAL_SERIES)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSeries, setEditingSeries] = useState<MockSeries | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<unknown[]>([])

  const form = useForm<SeriesFormValues>({
    resolver: zodResolver(seriesFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      isCompleted: false,
    },
    mode: "onChange",
  })

  const { control, handleSubmit, reset, setValue } = form

  const openCreateDialog = () => {
    setEditingSeries(null)
    reset({
      title: "",
      slug: "",
      description: "",
      isCompleted: false,
    })
    setUploadedFiles([])
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: MockSeries) => {
    setEditingSeries(item)
    reset({
      title: item.title,
      slug: item.slug,
      description: item.description,
      isCompleted: item.isCompleted,
    })
    setUploadedFiles([])
    setIsDialogOpen(true)
  }

  const onFormSubmit = (values: SeriesFormValues) => {
    if (editingSeries) {
      setSeriesList((prev) =>
        prev.map((s) =>
          s.id === editingSeries.id
            ? {
                ...s,
                title: values.title,
                slug: values.slug,
                description: values.description,
                isCompleted: values.isCompleted,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : s
        )
      )
    } else {
      const newSeries: MockSeries = {
        id: `g-${crypto.randomUUID().slice(0, 8)}`,
        title: values.title,
        slug: values.slug,
        description: values.description,
        coverImage:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
        postCount: 0,
        isCompleted: values.isCompleted,
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setSeriesList([newSeries, ...seriesList])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setSeriesList((prev) => prev.filter((s) => s.id !== id))
  }

  const filteredSeries = seriesList.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Series & Groups
            </h1>
            <Badge
              variant="outline"
              className="rounded-md border-border/80 bg-muted/40 font-mono text-xs"
            >
              {seriesList.length} Tracks
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Group individual blog posts into curated technical series and
            multi-part tutorials.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={openCreateDialog}
            size="sm"
            className="h-9 gap-1.5 rounded-lg px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>New Series</span>
          </Button>
        </div>
      </div>

      {/* ─── Search Bar ─── */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search series by title or topic..."
          className="h-9 rounded-lg border-border/80 bg-card/50 pl-8 text-xs"
        />
      </div>

      {/* ─── Series Cards Grid ─── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredSeries.map((series) => (
          <Card
            key={series.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card/60 shadow-xs transition-all hover:border-border hover:shadow-sm"
          >
            {/* Banner Image with Overlay */}
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              <img
                src={series.coverImage}
                alt={series.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                {series.isCompleted ? (
                  <Badge
                    variant="outline"
                    className="rounded-md border-emerald-500/30 bg-emerald-950/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 backdrop-blur-xs"
                  >
                    Completed
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="rounded-md border-primary/40 bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary backdrop-blur-xs"
                  >
                    In Progress
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 font-mono text-xs text-foreground">
                <BookOpen className="size-3.5 text-primary" />
                <span>{series.postCount} Articles</span>
              </div>
            </div>

            {/* Card Content */}
            <CardHeader className="flex-1 space-y-1.5 p-4 pb-2">
              <CardTitle className="text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                {series.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {series.description}
              </CardDescription>
            </CardHeader>

            {/* Card Footer */}
            <CardFooter className="flex items-center justify-between border-t border-border/60 p-4 pt-3 text-xs text-muted-foreground">
              <span className="font-mono text-[11px]">
                Updated {series.updatedAt}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditDialog(series)}
                  className="h-7 rounded-lg px-2 text-xs hover:text-foreground"
                >
                  <Pencil className="size-3" />
                  <span className="ml-1">Edit</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-7 rounded-lg p-0 text-muted-foreground hover:text-foreground"
                    >
                      <MoreHorizontal className="size-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36 rounded-lg">
                    <DropdownMenuItem asChild className="gap-2 text-xs">
                      <Link to="/admin/posts">
                        <Layers className="size-3.5" />
                        <span>Filter Posts</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(series.id)}
                      className="gap-2 text-xs text-destructive focus:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* ─── Dialog: Create / Edit Series With Zod Form ─── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingSeries ? "Edit Series" : "Create New Series"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Organize multi-part articles into a unified learning journey.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={handleSubmit(onFormSubmit)}
              className="space-y-4 py-2"
            >
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Series Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          if (!editingSeries) {
                            setValue(
                              "slug",
                              e.target.value
                                .toLowerCase()
                                .replace(/[^\w\s-]/g, "")
                                .replace(/[\s_-]+/g, "-")
                                .replace(/^-+|-+$/g, ""),
                              { shouldValidate: true }
                            )
                          }
                        }}
                        placeholder="e.g. Vite 8 & React 19 Architecture"
                        className="h-9 rounded-lg text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="series-slug"
                        className="h-9 rounded-lg font-mono text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="What developers will learn from this track..."
                        rows={3}
                        className="rounded-lg text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custom FilePond Cover Upload */}
              <div className="space-y-2">
                <FormLabel>Series Banner Image</FormLabel>
                <FileUpload
                  variant="cover"
                  files={uploadedFiles}
                  onupdatefiles={setUploadedFiles}
                  maxFileSize="10MB"
                  acceptedFileTypes={["image/png", "image/jpeg", "image/webp"]}
                />
              </div>

              {/* Completed Toggle */}
              <FormField
                control={control}
                name="isCompleted"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border border-border/70 bg-card/40 p-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground">
                        Mark as Completed
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Indicate that all planned articles in this series have
                        been published.
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

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDialogOpen(false)}
                  className="h-9 rounded-lg text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 rounded-lg text-xs font-semibold shadow-xs"
                >
                  {editingSeries ? "Save Changes" : "Create Series"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
