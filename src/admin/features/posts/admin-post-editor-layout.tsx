import { useMemo, useState } from "react"

import {
  buildPreviewPost,
  createInitialEditorValues,
  type PostEditorFormValues,
  slugifyTitle,
} from "./components/editor/post-editor.utils"
import { PostEditorContentFrame } from "./components/editor/post-editor-content-frame"
import { PostEditorHeader } from "./components/editor/post-editor-header"
import { PostEditorHeadlineCard } from "./components/editor/post-editor-headline-card"
import { PostEditorMetadataSidebar } from "./components/editor/post-editor-metadata-sidebar"
import { PostEditorNotFound } from "./components/editor/post-editor-not-found"
import { PostPreviewDialog } from "./components/post-preview-dialog"
import {
  MOCK_CATEGORIES,
  MOCK_GROUPS,
  MOCK_POSTS,
  MOCK_TAGS,
} from "./mock-data"
import type { PostStatus } from "./types"

export interface AdminPostEditorLayoutProps {
  mode: "create" | "edit"
  postId?: string
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
    createInitialEditorValues(existingPost)
  )
  const [isSlugLocked, setIsSlugLocked] = useState(isEdit)
  const [isDirty, setIsDirty] = useState(false)
  const [savedNotice, setSavedNotice] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  if (isEdit && !existingPost) {
    return <PostEditorNotFound postId={postId} />
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

  const previewPost = buildPreviewPost(values, existingPost)

  return (
    <div className="flex min-h-[calc(100svh-8.5rem)] flex-1 flex-col gap-5">
      <PostEditorHeader
        isEdit={isEdit}
        status={values.status}
        isDirty={isDirty}
        savedNotice={savedNotice}
        onOpenPreview={() => setPreviewOpen(true)}
        onSaveDraft={() => handleSaveAction("draft")}
        onPublish={() => handleSaveAction("published")}
      />

      <div className="grid flex-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-5">
          <PostEditorHeadlineCard
            values={values}
            isSlugLocked={isSlugLocked}
            onToggleSlugLock={() => setIsSlugLocked((prev) => !prev)}
            onTitleChange={handleTitleChange}
            onFieldChange={updateField}
          />

          <PostEditorContentFrame content={values.content} />
        </div>

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
