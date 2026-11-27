import { FileText, Layers, Plus, Trash2 } from "lucide-react"

import { AdminContentCard } from "@/admin"
import { Button, Input, Label, Separator, Textarea } from "@/shared/ui"

import type { AdminProfileData, ProfileTechGroup } from "../types"

interface ProfileBioStackCardProps {
  values: AdminProfileData
  onFieldChange: <K extends keyof AdminProfileData>(
    field: K,
    value: AdminProfileData[K]
  ) => void
}

export function ProfileBioStackCard({
  values,
  onFieldChange,
}: ProfileBioStackCardProps) {
  const handleAddTechGroup = () => {
    const next: ProfileTechGroup = {
      id: `stack-${Date.now()}`,
      label: "Tooling",
      items: "",
    }
    onFieldChange("techGroups", [...values.techGroups, next])
  }

  const handleUpdateTechGroup = (
    id: string,
    field: "label" | "items",
    value: string
  ) => {
    onFieldChange(
      "techGroups",
      values.techGroups.map((group) =>
        group.id === id ? { ...group, [field]: value } : group
      )
    )
  }

  const handleRemoveTechGroup = (id: string) => {
    onFieldChange(
      "techGroups",
      values.techGroups.filter((group) => group.id !== id)
    )
  }

  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <FileText className="size-4 text-muted-foreground" />
          <span>Biography &amp; Core Stack</span>
        </span>
      }
      description="Short summary, editorial intro paragraphs, and technology stack groups"
      minHeight="min-h-0"
      padding="default"
      className="flex-none"
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <Label htmlFor="profile-short-bio" className="text-xs">
              Short Tagline
            </Label>
            <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {values.bio.length}/160
            </span>
          </div>
          <Input
            id="profile-short-bio"
            value={values.bio}
            maxLength={160}
            onChange={(e) => onFieldChange("bio", e.target.value)}
            placeholder="Frontend Engineer · Fullstack Capable · Viet Nam"
            className="h-9 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <Label htmlFor="profile-extended-bio" className="text-xs">
              Editorial Intro
            </Label>
            <span className="text-[11px] text-muted-foreground">
              Separate paragraphs with a blank line
            </span>
          </div>
          <Textarea
            id="profile-extended-bio"
            rows={6}
            value={values.extendedBio}
            onChange={(e) => onFieldChange("extendedBio", e.target.value)}
            placeholder="Write your introduction..."
            className="min-h-32 resize-y text-sm leading-relaxed"
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-muted-foreground" />
              <div>
                <h4 className="text-xs font-semibold text-foreground">
                  Core Stack Groups
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Shown under the Core Stack section on your public profile
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={handleAddTechGroup}
            >
              <Plus className="size-3.5" />
              <span>Add Group</span>
            </Button>
          </div>

          <div className="space-y-3">
            {values.techGroups.map((group) => (
              <div
                key={group.id}
                className="flex flex-col gap-2.5 rounded-lg border border-border/70 bg-muted/20 p-3 sm:flex-row sm:items-start"
              >
                <div className="w-full space-y-1 sm:w-44 sm:shrink-0">
                  <Label
                    htmlFor={`stack-label-${group.id}`}
                    className="text-[11px] text-muted-foreground"
                  >
                    Group Label
                  </Label>
                  <Input
                    id={`stack-label-${group.id}`}
                    value={group.label}
                    onChange={(e) =>
                      handleUpdateTechGroup(group.id, "label", e.target.value)
                    }
                    placeholder="Frontend Core"
                    className="h-8 bg-background text-xs font-medium"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <Label
                    htmlFor={`stack-items-${group.id}`}
                    className="text-[11px] text-muted-foreground"
                  >
                    Technologies
                  </Label>
                  <Input
                    id={`stack-items-${group.id}`}
                    value={group.items}
                    onChange={(e) =>
                      handleUpdateTechGroup(group.id, "items", e.target.value)
                    }
                    placeholder="TypeScript · React · TanStack · Tailwind CSS"
                    className="h-8 bg-background text-xs"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveTechGroup(group.id)}
                  disabled={values.techGroups.length <= 1}
                  aria-label={`Remove ${group.label} group`}
                  className="mt-5 size-8 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminContentCard>
  )
}
