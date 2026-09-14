/* eslint-disable react-hooks/incompatible-library */
import { zodResolver } from "@hookform/resolvers/zod"
import { Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  Bold,
  Check,
  Clock,
  Code2,
  Globe,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  Quote,
  Save,
  Send,
  Star,
  X,
} from "lucide-react"
import { marked } from "marked"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  Separator,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/shared/ui"

import {
  DEFAULT_POST_VALUES,
  postFormSchema,
  type PostFormValues,
} from "./schema"

interface BlogPostEditorProps {
  initialData?: Partial<PostFormValues>
  isNew?: boolean
  onSave?: (values: PostFormValues) => void
}

const PRESET_TAGS = [
  "React 19",
  "Vite 8",
  "Tailwind CSS v4",
  "Drizzle ORM",
  "Neon DB",
  "TypeScript",
  "TanStack Router",
  "Framer Motion",
  "Performance",
  "Web3D",
]

export function BlogPostEditor({
  initialData,
  isNew = false,
  onSave,
}: BlogPostEditorProps) {
  const [editorMode, setEditorMode] = useState<"write" | "split" | "preview">(
    "write"
  )
  const [isAutoSlug, setIsAutoSlug] = useState(isNew)
  const [newTagInput, setNewTagInput] = useState("")
  const [isSavedSuccess, setIsSavedSuccess] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<unknown[]>([])

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      ...DEFAULT_POST_VALUES,
      ...initialData,
    },
    mode: "onChange",
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form

  const watchTitle = watch("title")
  const watchSlug = watch("slug")
  const watchExcerpt = watch("excerpt")
  const watchContent = watch("content")
  const watchTags = watch("tags") || []
  const watchStatus = watch("status")

  // Auto-generate slug when title changes if auto-slug is enabled
  useEffect(() => {
    if (isAutoSlug && watchTitle) {
      const generatedSlug = watchTitle
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
      setValue("slug", generatedSlug, { shouldValidate: true })
    }
  }, [watchTitle, isAutoSlug, setValue])

  // Word count & Read time calculation
  const wordCount = useMemo(() => {
    if (!watchContent) return 0
    return watchContent.trim().split(/\s+/).filter(Boolean).length
  }, [watchContent])

  const calculatedReadTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200))
  }, [wordCount])

  // Update readTime automatically if not manually set to a distant number
  useEffect(() => {
    setValue("readTime", calculatedReadTime)
  }, [calculatedReadTime, setValue])

  // Parse markdown for live preview
  const parsedMarkdown = useMemo(() => {
    if (!watchContent)
      return "<p class='text-muted-foreground italic'>Nothing to preview yet. Start typing in Markdown...</p>"
    try {
      return marked.parse(watchContent) as string
    } catch {
      return "<p class='text-destructive'>Error rendering markdown preview</p>"
    }
  }, [watchContent])

  // Formatting Toolbar Helpers
  const insertMarkdownSyntax = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById(
      "content-editor"
    ) as HTMLTextAreaElement | null
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const current = watchContent || ""
    const selected = current.substring(start, end)
    const replacement = `${prefix}${selected || "text"}${suffix}`

    const updated =
      current.substring(0, start) + replacement + current.substring(end)
    setValue("content", updated, { shouldValidate: true, shouldDirty: true })

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      )
    }, 10)
  }

  // Tag Management
  const handleToggleTag = (tag: string) => {
    if (watchTags.includes(tag)) {
      setValue(
        "tags",
        watchTags.filter((t) => t !== tag),
        { shouldValidate: true, shouldDirty: true }
      )
    } else {
      setValue("tags", [...watchTags, tag], {
        shouldValidate: true,
        shouldDirty: true,
      })
    }
  }

  const handleAddNewTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTagInput.trim()) {
      e.preventDefault()
      const formatted = newTagInput.trim()
      if (!watchTags.includes(formatted)) {
        setValue("tags", [...watchTags, formatted], {
          shouldValidate: true,
          shouldDirty: true,
        })
      }
      setNewTagInput("")
    }
  }

  const onSubmit = (values: PostFormValues) => {
    if (onSave) {
      onSave(values)
    }
    setIsSavedSuccess(true)
    setTimeout(() => setIsSavedSuccess(false), 3000)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-16">
        {/* ─── Sticky Action Header ─── */}
        <div className="sticky top-14 z-30 -mx-4 -mt-2 flex flex-col justify-between gap-3 border-b border-border/80 bg-background/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:flex-row md:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="size-8 shrink-0 rounded-lg border-border/80 p-0"
            >
              <Link to="/admin/posts">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  Blog / {isNew ? "New Post" : "Editing"}
                </span>
                <Badge
                  variant="outline"
                  className={
                    watchStatus === "published"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500"
                      : "border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-500"
                  }
                >
                  {watchStatus.toUpperCase()}
                </Badge>
              </div>
              <p className="max-w-sm truncate text-xs font-semibold text-foreground sm:max-w-md">
                {watchTitle || "Untitled Article"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Word count & Reading time indicator */}
            <div className="mr-2 hidden items-center gap-2 font-mono text-xs text-muted-foreground lg:flex">
              <span>{wordCount.toLocaleString()} words</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {calculatedReadTime} min read
              </span>
            </div>

            {/* Save Status Notification */}
            {isSavedSuccess && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                <Check className="size-3.5" />
                <span>Saved</span>
              </span>
            )}

            {/* Save as Draft */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => {
                setValue("status", "draft")
                handleSubmit(onSubmit)()
              }}
              className="h-8 gap-1.5 rounded-lg border-border/80 text-xs font-medium"
            >
              <Save className="size-3.5" />
              <span>Save Draft</span>
            </Button>

            {/* Publish Button */}
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              onClick={() => {
                setValue("status", "published")
              }}
              className="h-8 gap-1.5 rounded-lg px-3.5 text-xs font-semibold shadow-xs"
            >
              <Send className="size-3.5" />
              <span>{isNew ? "Publish Article" : "Update Article"}</span>
            </Button>
          </div>
        </div>

        {/* ─── Two-Column Responsive Workspace ─── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ════ Left Main Editor Column (8 cols on lg) ════ */}
          <div className="space-y-6 lg:col-span-8">
            {/* Title & Slug Box */}
            <div className="space-y-4 rounded-xl border border-border/70 bg-card/60 p-5 shadow-xs sm:p-6">
              {/* Main Headline Title */}
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        {...field}
                        placeholder="Article Headline Title..."
                        className="w-full bg-transparent text-2xl font-extrabold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40 sm:text-3xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slug & URL path inspector */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-muted/30 px-3 py-1.5 font-mono text-xs text-muted-foreground">
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <Globe className="size-3.5 shrink-0 text-muted-foreground/60" />
                  <span className="text-muted-foreground">
                    phongdev.me/blog/
                  </span>
                  <input
                    value={watchSlug}
                    onChange={(e) => {
                      setIsAutoSlug(false)
                      setValue("slug", e.target.value, { shouldValidate: true })
                    }}
                    placeholder="article-slug"
                    className="w-full bg-transparent font-semibold text-foreground outline-none"
                  />
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAutoSlug(!isAutoSlug)}
                    className={`rounded-md border px-2 py-0.5 text-[10px] transition-colors ${
                      isAutoSlug
                        ? "border-primary/40 bg-primary/10 font-semibold text-primary"
                        : "border-border/80 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isAutoSlug ? "Auto-Slug Active" : "Manual Slug"}
                  </button>
                </div>
              </div>
              {errors.slug && (
                <p className="text-xs font-medium text-destructive">
                  {errors.slug.message}
                </p>
              )}

              {/* Excerpt Summary */}
              <FormField
                control={control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-medium text-muted-foreground">
                        Excerpt (Search summary & Social preview)
                      </FormLabel>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {(field.value || "").length}/350
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        placeholder="Write a compelling 1-2 sentence overview of this article..."
                        className="rounded-lg text-xs leading-relaxed"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Content Markdown Editor Workspace */}
            <div className="overflow-hidden rounded-xl border border-border/70 bg-card/60 shadow-xs">
              {/* Editor View Modes & Formatting Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 bg-muted/40 px-3 py-2">
                {/* Formatting Quick Tools */}
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdownSyntax("**", "**")}
                    className="size-7 rounded-md p-0 text-muted-foreground hover:text-foreground"
                    title="Bold (Ctrl+B)"
                  >
                    <Bold className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdownSyntax("*", "*")}
                    className="size-7 rounded-md p-0 text-muted-foreground hover:text-foreground"
                    title="Italic"
                  >
                    <Italic className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdownSyntax("## ")}
                    className="size-7 rounded-md p-0 text-muted-foreground hover:text-foreground"
                    title="Heading 2"
                  >
                    <Heading2 className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdownSyntax("### ")}
                    className="size-7 rounded-md p-0 text-muted-foreground hover:text-foreground"
                    title="Heading 3"
                  >
                    <Heading3 className="size-3.5" />
                  </Button>
                  <Separator orientation="vertical" className="mx-1 h-4" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      insertMarkdownSyntax("```typescript\n", "\n```")
                    }
                    className="size-7 rounded-md p-0 text-muted-foreground hover:text-foreground"
                    title="Code Block"
                  >
                    <Code2 className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdownSyntax("> ")}
                    className="size-7 rounded-md p-0 text-muted-foreground hover:text-foreground"
                    title="Blockquote"
                  >
                    <Quote className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdownSyntax("- ")}
                    className="size-7 rounded-md p-0 text-muted-foreground hover:text-foreground"
                    title="Bullet List"
                  >
                    <List className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertMarkdownSyntax("[", "](https://)")}
                    className="size-7 rounded-md p-0 text-muted-foreground hover:text-foreground"
                    title="Insert Link"
                  >
                    <LinkIcon className="size-3.5" />
                  </Button>
                </div>

                {/* View Switcher: Write vs Split vs Preview */}
                <Tabs
                  value={editorMode}
                  onValueChange={(v) =>
                    setEditorMode(v as "write" | "split" | "preview")
                  }
                  className="w-auto"
                >
                  <TabsList className="h-7 rounded-md bg-muted/60 p-0.5">
                    <TabsTrigger
                      value="write"
                      className="rounded-sm px-2 py-0.5 text-[11px] font-medium data-[state=active]:bg-background data-[state=active]:shadow-2xs"
                    >
                      Write
                    </TabsTrigger>
                    <TabsTrigger
                      value="split"
                      className="hidden rounded-sm px-2 py-0.5 text-[11px] font-medium data-[state=active]:bg-background data-[state=active]:shadow-2xs sm:inline-flex"
                    >
                      Split View
                    </TabsTrigger>
                    <TabsTrigger
                      value="preview"
                      className="rounded-sm px-2 py-0.5 text-[11px] font-medium data-[state=active]:bg-background data-[state=active]:shadow-2xs"
                    >
                      Preview
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Editor Body */}
              <div className="p-4 sm:p-5">
                {editorMode === "write" && (
                  <FormField
                    control={control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <textarea
                            {...field}
                            id="content-editor"
                            rows={24}
                            placeholder="# Introduction&#10;&#10;Write your in-depth technical article here using Markdown..."
                            className="w-full resize-y bg-transparent font-mono text-xs leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {editorMode === "split" && (
                  <div className="grid min-h-[550px] grid-cols-2 gap-6">
                    {/* Left Pane: Textarea */}
                    <div className="border-r border-border/80 pr-4">
                      <FormField
                        control={control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <textarea
                                {...field}
                                id="content-editor"
                                rows={24}
                                placeholder="# Introduction&#10;&#10;Write markdown..."
                                className="w-full resize-none bg-transparent font-mono text-xs leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/30"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Right Pane: Live HTML Preview */}
                    <div className="prose dark:prose-invert max-h-[600px] max-w-none overflow-y-auto pl-2 text-xs leading-relaxed text-foreground">
                      <div
                        dangerouslySetInnerHTML={{ __html: parsedMarkdown }}
                        className="space-y-3"
                      />
                    </div>
                  </div>
                )}

                {editorMode === "preview" && (
                  <div className="prose dark:prose-invert min-h-[550px] max-w-none p-2 text-xs leading-relaxed text-foreground">
                    <div
                      dangerouslySetInnerHTML={{ __html: parsedMarkdown }}
                      className="space-y-4"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ════ Right Sidebar Column (4 cols on lg) ════ */}
          <div className="space-y-5 lg:col-span-4">
            {/* Card 1: Cover Image (Custom FilePond) */}
            <Card className="rounded-xl border-border/70 bg-card/60 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Cover Banner Image
                </CardTitle>
                <CardDescription className="text-[11px]">
                  Aspect ratio 16:9 recommended for hero cards.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <FileUpload
                  variant="cover"
                  files={uploadedFiles}
                  onupdatefiles={setUploadedFiles}
                  maxFileSize="10MB"
                  acceptedFileTypes={["image/png", "image/jpeg", "image/webp"]}
                />

                <FormField
                  control={control}
                  name="coverImageAlt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-normal text-muted-foreground">
                        Image Alt Text (Accessibility & SEO)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Describe cover image..."
                          className="h-8 rounded-lg text-xs"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Card 2: Publishing Status & Settings */}
            <Card className="rounded-xl border-border/70 bg-card/60 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Publishing & Visibility
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5">
                {/* Status Selector */}
                <FormField
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">
                        Article Status
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-9 w-full rounded-lg text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="draft">
                            <span className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-amber-500" />
                              Draft (Private)
                            </span>
                          </SelectItem>
                          <SelectItem value="published">
                            <span className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-emerald-500" />
                              Published (Public)
                            </span>
                          </SelectItem>
                          <SelectItem value="archived">
                            <span className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-muted-foreground" />
                              Archived (Hidden)
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Published Date */}
                <FormField
                  control={control}
                  name="publishedAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">
                        Publish Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="h-9 rounded-lg font-mono text-xs"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Featured Switch */}
                <FormField
                  control={control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/30 p-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          <span>Featured Article</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Pin to top showcase grid.
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
              </CardContent>
            </Card>

            {/* Card 3: Taxonomy & Categories */}
            <Card className="rounded-xl border-border/70 bg-card/60 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Taxonomy & Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category Dropdown */}
                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">
                        Primary Category
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-9 w-full rounded-lg text-xs">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="Architecture">
                            Architecture
                          </SelectItem>
                          <SelectItem value="Backend">
                            Backend & Database
                          </SelectItem>
                          <SelectItem value="Design System">
                            Design System
                          </SelectItem>
                          <SelectItem value="Graphics & 3D">
                            Graphics & 3D
                          </SelectItem>
                          <SelectItem value="Performance">
                            Performance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Series selector */}
                <FormField
                  control={control}
                  name="groupId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">
                        Series / Group (Optional)
                      </FormLabel>
                      <Select
                        value={field.value || "none"}
                        onValueChange={(val) =>
                          field.onChange(val === "none" ? "" : val)
                        }
                      >
                        <SelectTrigger className="h-9 w-full rounded-lg text-xs">
                          <SelectValue placeholder="No series" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="none">
                            None (Stand-alone article)
                          </SelectItem>
                          <SelectItem value="g-1">
                            Vite 8 & React 19 Architecture
                          </SelectItem>
                          <SelectItem value="g-2">
                            Serverless Postgres & Drizzle
                          </SelectItem>
                          <SelectItem value="g-3">
                            Building Component Registries
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Tags Picker */}
                <div className="space-y-2">
                  <FormLabel className="text-xs font-semibold">
                    Article Tags ({watchTags.length})
                  </FormLabel>

                  {/* Selected Tags list */}
                  <div className="flex min-h-[32px] flex-wrap gap-1.5 rounded-lg border border-border/80 bg-muted/30 p-2">
                    {watchTags.length === 0 ? (
                      <span className="text-[11px] text-muted-foreground">
                        No tags selected yet.
                      </span>
                    ) : (
                      watchTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="gap-1 rounded-md border-primary/30 bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] text-primary"
                        >
                          <span>#{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleTag(tag)}
                            className="cursor-pointer hover:text-foreground"
                          >
                            <X className="size-3" />
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>
                  {errors.tags && (
                    <p className="text-xs font-medium text-destructive">
                      {errors.tags.message}
                    </p>
                  )}

                  {/* Custom tag input */}
                  <Input
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={handleAddNewTag}
                    placeholder="Type custom tag and press Enter..."
                    className="h-8 rounded-lg text-xs"
                  />

                  {/* Quick Preset Tags suggestions */}
                  <div className="pt-1">
                    <p className="mb-1.5 text-[10px] font-semibold text-muted-foreground/70 uppercase">
                      Suggested Tags:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {PRESET_TAGS.map((tag) => {
                        const isSelected = watchTags.includes(tag)
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleToggleTag(tag)}
                            className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] transition-colors ${
                              isSelected
                                ? "border-primary bg-primary font-semibold text-primary-foreground"
                                : "border-border/70 bg-card/60 text-muted-foreground hover:border-border hover:text-foreground"
                            }`}
                          >
                            +{tag}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Google SERP Preview */}
            <Card className="space-y-2 rounded-xl border-border/70 bg-card/60 p-4 shadow-xs">
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Google Search Snippet Preview
              </p>
              <div className="space-y-1 rounded-lg border border-border/80 bg-background/50 p-3">
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  phongdev.me &rsaquo; blog &rsaquo; {watchSlug || "slug"}
                </p>
                <p className="line-clamp-1 text-xs font-semibold text-primary">
                  {watchTitle || "Your Post Headline"}
                </p>
                <p className="line-clamp-2 text-[11px] text-muted-foreground">
                  {watchExcerpt ||
                    "Add an excerpt to show search engines a rich preview..."}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
