import { format } from "date-fns"

import { MOCK_CATEGORIES, MOCK_GROUPS } from "../../mock-data"
import type { AdminPost, AdminTag, PostStatus } from "../../types"

export interface PostEditorFormValues {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  coverImageAlt: string
  groupId: string | null
  groupOrder: number | null
  status: PostStatus
  publishedAt: string
  readTime: number
  isFeatured: boolean
  categoryIds: string[]
  tags: AdminTag[]
  content: Record<string, unknown>
}

export function slugifyTitle(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function toLocalDateTimeInput(isoDate: string): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm")
  }
  return format(date, "yyyy-MM-dd'T'HH:mm")
}

export function createInitialEditorValues(
  post: AdminPost | null
): PostEditorFormValues {
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

export function buildPreviewPost(
  values: PostEditorFormValues,
  existingPost: AdminPost | null
): AdminPost {
  const publishedAt = values.publishedAt
    ? new Date(values.publishedAt).toISOString()
    : (existingPost?.publishedAt ?? "2026-11-27T00:00:00.000Z")

  return {
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
    publishedAt,
    readTime: values.readTime,
    isFeatured: values.isFeatured,
    content: values.content,
    categories: MOCK_CATEGORIES.filter((c) =>
      values.categoryIds.includes(c.id)
    ),
    tags: values.tags,
    createdAt: existingPost?.createdAt ?? publishedAt,
    updatedAt: existingPost?.updatedAt ?? publishedAt,
  }
}
