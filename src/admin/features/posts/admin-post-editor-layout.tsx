import { Link } from "@tanstack/react-router"
import { format } from "date-fns"
import {
  ArrowLeft,
  Check,
  Eye,
  FileText,
  Lock,
  Save,
  Send,
  Sparkles,
  Type,
  Unlock,
  X,
} from "lucide-react"
import { useMemo, useState } from "react"

import { AdminContentCard, AdminPageHeader } from "@/admin"
import {
  Badge,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  Textarea,
} from "@/shared/ui"

import { PostEditorContentFrame } from "./components/editor/post-editor-content-frame"
import {
  type PostEditorFormValues,
  PostEditorMetadataSidebar,
} from "./components/editor/post-editor-metadata-sidebar"
import { PostCoverThumbnail } from "./components/post-cover-thumbnail"
import { PostPreviewDialog } from "./components/post-preview-dialog"
import { PostStatusBadge } from "./components/post-status-badge"
import {
  MOCK_CATEGORIES,
  MOCK_GROUPS,
  MOCK_POSTS,
  MOCK_TAGS,
} from "./mock-data"
import type { AdminPost, PostStatus } from "./types"

export interface AdminPostEditorLayoutProps {
  mode: "create" | "edit"
  postId?: string
}

function slugifyTitle(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function toLocalDateTimeInput(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm")
  }
  return format(date, "yyyy-MM-dd'T'HH:mm")
}

function createInitialValues(post: AdminPost | null): PostEditorFormValues {
  if (!post) {
    return {
      title: "",
      slug: "",
      excerpt: "",
      coverImage: "",
      coverImageAlt: "",
      groupId: null,
      groupOrder: null,
      status: "draft",
      publishedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      readTime: 5,
      isFeatured: false,
      categoryIds: [],
      tags: [],
      content: { type: "doc", content: [] },
    }
  }

  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    coverImage: post.coverImage ?? "",
    coverImageAlt: post.coverImageAlt ?? "",
    groupId: post.groupId,
    groupOrder: post.groupOrder,
    status: post.status,
    publishedAt: toLocalDateTimeInput(post.publishedAt),
    readTime: post.readTime,
    isFeatured: post.isFeatured,
    categoryIds: post.categories.map((c) => c.id),
    tags: post.tags,
    content: post.content,
  }
}

export function AdminPostEditorLayout({
  mode,
  postId,
}: AdminPostEditorLayoutProps) {
  const isEdit = mode === "edit"

  const existingPost = useMemo(
    () =>
      isEdit && postId
        ? (MOCK_POSTS.find((p) => p.id === postId) ?? null)
        : null,
    [isEdit, postId]
  )

  const [values, setValues] = useState<PostEditorFormValues>(() =>
    createInitialValues(existingPost)
  )
  const [isSlugLocked, setIsSlugLocked] = useState(isEdit)
  const [isDirty, setIsDirty] = useState(false)
  const [savedNotice, setSavedNotice] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  if (isEdit && !existingPost) {
    return (
      <div className="flex min-h-[calc(100svh-8.5rem)] flex-1 flex-col gap-5">
        <AdminPageHeader
          title="Article Not Found"
          description={`No article matched ID "${postId ?? ""}" in the current workspace.`}
          breadcrumbs={[
            { label: "Admin", href: "/admin" },
            { label: "Content & Blog" },
            { label: "Posts", href: "/admin/posts" },
            { label: "Not Found" },
          ]}
        />
        <AdminContentCard variant="dashed" centered>
          <div className="flex size-14 items-center justify-center rounded-full bg-muted/60">
            <FileText className="size-7 text-muted-foreground/70" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Article does not exist
          </h3>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            The requested article ID could not be found in the mock dataset.
          </p>
          <Button asChild className="mt-6 gap-2">
            <Link to="/admin/posts">
              <ArrowLeft className="size-4" />
              <span>Back to Posts</span>
            </Link>
          </Button>
        </AdminContentCard>
      </div>
    )
  }

  const updateField = <K extends keyof PostEditorFormValues>(
    field: K,
    value: PostEditorFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)
    setSavedNotice(null)
  }

  const handleTitleChange = (nextTitle: string) => {
    setValues((prev) => ({
      ...prev,
      title: nextTitle,
      slug: !isSlugLocked ? slugifyTitle(nextTitle) : prev.slug,
    }))
    setIsDirty(true)
    setSavedNotice(null)
  }

  const handleSaveAction = (targetStatus: PostStatus) => {
    setValues((prev) => ({ ...prev, status: targetStatus }))
    setIsDirty(false)
    setSavedNotice(
      targetStatus === "published" ? "Published (preview)" : "Saved draft"
    )
    window.setTimeout(() => setSavedNotice(null), 2200)
  }

  const parsedPublishedAt = values.publishedAt
    ? new Date(values.publishedAt).toISOString()
    : (existingPost?.publishedAt ?? "2026-11-27T00:00:00.000Z")

  const previewPost: AdminPost = {
    id: existingPost?.id ?? "post-draft-preview",
    title: values.title.trim() || "Untitled Article",
    slug: values.slug.trim() || "untitled-article",
    excerpt: values.excerpt.trim() || null,
    coverImage: values.coverImage.trim() || null,
    coverImageAlt: values.coverImageAlt.trim() || null,
    groupId: values.groupId,
    groupOrder: values.groupOrder,
    group: values.groupId
      ? (MOCK_GROUPS.find((g) => g.id === values.groupId) ?? null)
      : null,
    status: values.status,
    publishedAt: parsedPublishedAt,
    readTime: values.readTime,
    isFeatured: values.isFeatured,
    content: values.content,
    categories: MOCK_CATEGORIES.filter((c) =>
      values.categoryIds.includes(c.id)
    ),
    tags: values.tags,
    createdAt: existingPost?.createdAt ?? parsedPublishedAt,
    updatedAt: existingPost?.updatedAt ?? parsedPublishedAt,
  }

  return (
    <div className="flex min-h-[calc(100svh-8.5rem)] flex-1 flex-col gap-5">
      <AdminPageHeader
        title={isEdit ? "Edit Article" : "New Article"}
        description={
          isEdit
            ? "Update article metadata, taxonomy, cover media, and publishing settings."
            : "Compose a new blog post and configure its metadata."
        }
        badge={
          <div className="flex flex-wrap items-center gap-1.5">
            <PostStatusBadge status={values.status} />
            {isDirty && (
              <Badge
                variant="outline"
                size="sm"
                shape="pill"
                className="font-mono text-[11px]"
              >
                Unsaved
              </Badge>
            )}
            {savedNotice && (
              <Badge
                variant="success"
                size="sm"
                shape="pill"
                className="gap-1 font-mono text-[11px]"
              >
                <Check className="size-3" />
                <span>{savedNotice}</span>
              </Badge>
            )}
          </div>
        }
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Content & Blog" },
          { label: "Posts", href: "/admin/posts" },
          { label: isEdit ? "Edit" : "New" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="gap-1.5 text-xs"
            >
              <Link to="/admin/posts">
                <ArrowLeft className="size-3.5" />
                <span>Back to Posts</span>
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewOpen(true)}
              className="gap-1.5 text-xs"
            >
              <Eye className="size-3.5" />
              <span>Preview</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleSaveAction("draft")}
              className="gap-1.5 text-xs"
            >
              <Save className="size-3.5" />
              <span>Save Draft</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleSaveAction("published")}
              className="gap-1.5 text-xs"
            >
              <Send className="size-3.5" />
              <span>{isEdit ? "Update" : "Publish"}</span>
            </Button>
          </div>
        }
      />

      {/* Main 2-Column Editorial Workspace */}
      <div className="grid flex-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left Column: Title, Slug, Excerpt & Content Editor Frame */}
        <div className="flex flex-col gap-5">
          <AdminContentCard
            title={
              <span className="inline-flex items-center gap-2 text-sm font-semibold">
                <Type className="size-4 text-muted-foreground" />
                <span>Headline &amp; Summary</span>
              </span>
            }
            description="Article title, permalink slug, excerpt, and cover media"
            minHeight="min-h-0"
            padding="default"
            className="flex-none"
          >
            <div className="space-y-5">
              {/* Text Identity */}
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <Label htmlFor="post-title" className="text-xs">
                      Article Title
                    </Label>
                    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                      {values.title.length}/255
                    </span>
                  </div>
                  <Input
                    id="post-title"
                    maxLength={255}
                    value={values.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter a clear, technical article headline..."
                    className="h-10 text-base font-semibold"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <Label htmlFor="post-slug" className="text-xs">
                      URL Slug
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        const next = slugifyTitle(values.title)
                        if (next) updateField("slug", next)
                      }}
                      className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Sparkles className="size-3" />
                      <span>Regenerate from title</span>
                    </button>
                  </div>
                  <InputGroup>
                    <InputGroupInput
                      id="post-slug"
                      value={values.slug}
                      disabled={isSlugLocked}
                      onChange={(e) => {
                        setIsSlugLocked(true)
                        updateField("slug", e.target.value)
                      }}
                      placeholder="article-url-slug"
                      className="font-mono text-xs"
                    />
                    <InputGroupAddon align="inline-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setIsSlugLocked((prev) => !prev)}
                        aria-label={
                          isSlugLocked
                            ? "Unlock slug editing"
                            : "Lock slug to auto-sync"
                        }
                      >
                        {isSlugLocked ? (
                          <Lock className="size-3" />
                        ) : (
                          <Unlock className="size-3" />
                        )}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <Label htmlFor="post-excerpt" className="text-xs">
                      Excerpt
                    </Label>
                    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                      {values.excerpt.length} chars
                    </span>
                  </div>
                  <Textarea
                    id="post-excerpt"
                    value={values.excerpt}
                    onChange={(e) => updateField("excerpt", e.target.value)}
                    placeholder="Concise summary displayed on blog cards and OpenGraph meta descriptions..."
                    className="min-h-24 text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Cover Media (Vertical) */}
              <div className="space-y-3.5 rounded-xl border border-border/70 bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">
                    Cover Image
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    16:9 · posts.coverImage
                  </span>
                </div>

                <PostCoverThumbnail
                  src={values.coverImage || null}
                  alt={values.coverImageAlt || null}
                  title={values.title || "Article cover preview"}
                  className="aspect-[16/9] w-full rounded-lg"
                  iconClassName="size-8"
                />

                <div className="space-y-1.5">
                  <Label htmlFor="post-cover-url" className="text-xs">
                    ImageKit URL
                  </Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      id="post-cover-url"
                      value={values.coverImage}
                      onChange={(e) =>
                        updateField("coverImage", e.target.value)
                      }
                      placeholder="https://ik.imagekit.io/... or /og-image.png"
                      className="font-mono text-xs"
                    />
                    {values.coverImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => updateField("coverImage", "")}
                        aria-label="Clear cover image"
                        className="shrink-0"
                      >
                        <X className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="post-cover-alt" className="text-xs">
                    Alt Text
                  </Label>
                  <Input
                    id="post-cover-alt"
                    value={values.coverImageAlt}
                    onChange={(e) =>
                      updateField("coverImageAlt", e.target.value)
                    }
                    placeholder="Accessible image description..."
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          </AdminContentCard>

          {/* Content Editor kept as structural frame */}
          <PostEditorContentFrame content={values.content} />
        </div>

        {/* Right Column: Metadata Inspector */}
        <PostEditorMetadataSidebar
          values={values}
          categories={MOCK_CATEGORIES}
          availableTags={MOCK_TAGS}
          groups={MOCK_GROUPS}
          onChange={updateField}
        />
      </div>

      <PostPreviewDialog
        post={previewOpen ? previewPost : null}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        onEdit={() => setPreviewOpen(false)}
        onChangeStatus={(_, status) => updateField("status", status)}
        onToggleFeatured={() => updateField("isFeatured", !values.isFeatured)}
      />
    </div>
  )
}
