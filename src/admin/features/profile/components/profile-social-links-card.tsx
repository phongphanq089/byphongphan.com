import { Github, Globe, Link2, Linkedin, Twitter } from "lucide-react"

import { AdminContentCard } from "@/admin"
import { Input, Label } from "@/shared/ui"

import type { AdminProfileData, ProfileSocials } from "../types"

interface ProfileSocialLinksCardProps {
  values: AdminProfileData
  onFieldChange: <K extends keyof AdminProfileData>(
    field: K,
    value: AdminProfileData[K]
  ) => void
  onSocialChange: <K extends keyof ProfileSocials>(
    field: K,
    value: ProfileSocials[K]
  ) => void
}

export function ProfileSocialLinksCard({
  values,
  onFieldChange,
  onSocialChange,
}: ProfileSocialLinksCardProps) {
  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <Link2 className="size-4 text-muted-foreground" />
          <span>Social &amp; Developer Links</span>
        </span>
      }
      description="External links rendered in the profile social dock and footer"
      minHeight="min-h-0"
      padding="default"
      className="flex-none"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="profile-github-username" className="text-xs">
            GitHub Username
          </Label>
          <div className="relative">
            <Github className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="profile-github-username"
              value={values.githubUsername}
              onChange={(e) => onFieldChange("githubUsername", e.target.value)}
              placeholder="phongphanq089"
              className="h-9 pl-8 font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-github-url" className="text-xs">
            GitHub URL
          </Label>
          <div className="relative">
            <Github className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="profile-github-url"
              type="url"
              value={values.socials.github}
              onChange={(e) => onSocialChange("github", e.target.value)}
              placeholder="https://github.com/phongphanq089"
              className="h-9 pl-8 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-linkedin-url" className="text-xs">
            LinkedIn URL
          </Label>
          <div className="relative">
            <Linkedin className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="profile-linkedin-url"
              type="url"
              value={values.socials.linkedin}
              onChange={(e) => onSocialChange("linkedin", e.target.value)}
              placeholder="https://www.linkedin.com/in/..."
              className="h-9 pl-8 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-twitter-url" className="text-xs">
            X (Twitter) URL
          </Label>
          <div className="relative">
            <Twitter className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="profile-twitter-url"
              type="url"
              value={values.socials.twitter}
              onChange={(e) => onSocialChange("twitter", e.target.value)}
              placeholder="https://x.com/PhongPhanq089"
              className="h-9 pl-8 text-xs"
            />
          </div>
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="profile-website-url" className="text-xs">
            Personal Website
          </Label>
          <div className="relative">
            <Globe className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="profile-website-url"
              type="url"
              value={values.socials.website}
              onChange={(e) => onSocialChange("website", e.target.value)}
              placeholder="https://byphongphan.com"
              className="h-9 pl-8 text-xs"
            />
          </div>
        </div>
      </div>
    </AdminContentCard>
  )
}
