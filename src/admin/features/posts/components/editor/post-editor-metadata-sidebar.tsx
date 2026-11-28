import type { AdminCategory, AdminPostGroup, AdminTag } from "../../types"
import type { PostEditorFormValues } from "./post-editor.utils"
import { PostEditorPublishingCard } from "./post-editor-publishing-card"
import { PostEditorSeriesCard } from "./post-editor-series-card"
import { PostEditorTaxonomyCard } from "./post-editor-taxonomy-card"

interface PostEditorMetadataSidebarProps {
  values: PostEditorFormValues
  categories: AdminCategory[]
  availableTags: AdminTag[]
  groups: AdminPostGroup[]
  onChange: <K extends keyof PostEditorFormValues>(
    field: K,
    value: PostEditorFormValues[K]
  ) => void
}

export function PostEditorMetadataSidebar({
  values,
  categories,
  availableTags,
  groups,
  onChange,
}: PostEditorMetadataSidebarProps) {
  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-0">
      <PostEditorPublishingCard values={values} onChange={onChange} />

      <PostEditorTaxonomyCard
        categoryIds={values.categoryIds}
        tags={values.tags}
        categories={categories}
        availableTags={availableTags}
        onCategoryIdsChange={(nextIds) => onChange("categoryIds", nextIds)}
        onTagsChange={(nextTags) => onChange("tags", nextTags)}
      />

      <PostEditorSeriesCard
        groupId={values.groupId}
        groupOrder={values.groupOrder}
        groups={groups}
        onGroupIdChange={(nextGroupId) => onChange("groupId", nextGroupId)}
        onGroupOrderChange={(nextOrder) => onChange("groupOrder", nextOrder)}
      />
    </aside>
  )
}
