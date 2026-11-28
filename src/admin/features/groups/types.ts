import type { AdminPost, AdminPostGroup } from "@/admin/features/posts"

export type GroupCompletionFilter = "all" | "completed" | "ongoing"

export type GroupsViewMode = "table" | "grid"

export interface AdminGroupWithPosts extends AdminPostGroup {
  posts: AdminPost[]
}

export interface GroupsFilterState {
  search: string
  completion: GroupCompletionFilter
}

export interface GroupFormValues {
  title: string
  slug: string
  description: string
  coverImage: string
  isCompleted: boolean
}
