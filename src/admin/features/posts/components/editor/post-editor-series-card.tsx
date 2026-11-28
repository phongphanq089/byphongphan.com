import { Layers } from "lucide-react"

import { AdminContentCard } from "@/admin"
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui"

import type { AdminPostGroup } from "../../types"

interface PostEditorSeriesCardProps {
  groupId: string | null
  groupOrder: number | null
  groups: AdminPostGroup[]
  onGroupIdChange: (groupId: string | null) => void
  onGroupOrderChange: (groupOrder: number | null) => void
}

export function PostEditorSeriesCard({
  groupId,
  groupOrder,
  groups,
  onGroupIdChange,
  onGroupOrderChange,
}: PostEditorSeriesCardProps) {
  const selectedGroupLabel = groupId
    ? (groups.find((g) => g.id === groupId)?.title ?? "Select series")
    : "Standalone (No Series)"

  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <Layers className="size-4 text-muted-foreground" />
          <span>Series &amp; Order</span>
        </span>
      }
      minHeight="min-h-0"
      padding="sm"
      className="flex-none"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_88px] gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="post-group" className="text-xs">
            Series Group
          </Label>
          <Select
            value={groupId ?? "none"}
            onValueChange={(value) => {
              const nextGroupId = value && value !== "none" ? value : null
              onGroupIdChange(nextGroupId)
              if (!nextGroupId) {
                onGroupOrderChange(null)
              } else if (groupOrder === null) {
                onGroupOrderChange(1)
              }
            }}
          >
            <SelectTrigger id="post-group" className="w-full min-w-0 text-xs">
              <SelectValue>{selectedGroupLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="none" className="text-xs">
                Standalone (No Series)
              </SelectItem>
              {groups.map((grp) => (
                <SelectItem key={grp.id} value={grp.id} className="text-xs">
                  {grp.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="post-group-order" className="text-xs">
            Part #
          </Label>
          <Input
            id="post-group-order"
            type="number"
            min={1}
            disabled={!groupId}
            value={groupOrder ?? ""}
            onChange={(e) => {
              const parsed = Number(e.target.value)
              onGroupOrderChange(
                !e.target.value || Number.isNaN(parsed) || parsed < 1
                  ? null
                  : parsed
              )
            }}
            placeholder="—"
            className="font-mono text-xs"
          />
        </div>
      </div>
    </AdminContentCard>
  )
}
