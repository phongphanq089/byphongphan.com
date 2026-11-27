import { MapPin, User } from "lucide-react"

import { AdminContentCard, AdminImageUploadField } from "@/admin"
import {
  Input,
  Label,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui"

import type { AdminProfileData, ProfileAvailabilityStatus } from "../types"

interface ProfileIdentityCardProps {
  values: AdminProfileData
  onFieldChange: <K extends keyof AdminProfileData>(
    field: K,
    value: AdminProfileData[K]
  ) => void
}

const STATUS_OPTIONS: {
  value: ProfileAvailabilityStatus
  label: string
  dotClass: string
}[] = [
  {
    value: "available",
    label: "Available for work",
    dotClass: "bg-emerald-500",
  },
  {
    value: "building",
    label: "Building / Upgrading",
    dotClass: "bg-amber-500",
  },
  {
    value: "busy",
    label: "Focused / Busy",
    dotClass: "bg-rose-500",
  },
  {
    value: "offline",
    label: "Offline",
    dotClass: "bg-muted-foreground/50",
  },
]

export function ProfileIdentityCard({
  values,
  onFieldChange,
}: ProfileIdentityCardProps) {
  const currentStatusOption = STATUS_OPTIONS.find(
    (item) => item.value === values.status
  )

  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <User className="size-4 text-muted-foreground" />
          <span>Identity &amp; Contact</span>
        </span>
      }
      description="Public author profile, avatar, location, and availability status"
      minHeight="min-h-0"
      padding="default"
      className="flex-none"
    >
      <div className="space-y-5">
        {/* Avatar File Upload */}
        <AdminImageUploadField
          id="profile-avatar-upload"
          label="Profile Avatar"
          value={values.avatarUrl}
          onChange={(val) => onFieldChange("avatarUrl", val)}
          accept="image/png,image/jpeg,image/webp,image/gif"
          hint="Square 1:1 · PNG, JPG, WebP or GIF"
        />

        {/* Name & Handle */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="profile-full-name" className="text-xs">
              Full Name
            </Label>
            <Input
              id="profile-full-name"
              value={values.fullName}
              onChange={(e) => onFieldChange("fullName", e.target.value)}
              placeholder="Phong Phan"
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-display-name" className="text-xs">
              Display Handle
            </Label>
            <Input
              id="profile-display-name"
              value={values.displayName}
              onChange={(e) => onFieldChange("displayName", e.target.value)}
              placeholder="@phongphanq089"
              className="h-9 font-mono text-xs"
            />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-1.5">
          <Label htmlFor="profile-headline" className="text-xs">
            Role / Headline
          </Label>
          <Input
            id="profile-headline"
            value={values.headline}
            onChange={(e) => onFieldChange("headline", e.target.value)}
            placeholder="Frontend Engineer · Fullstack Capable"
            className="h-9 text-sm"
          />
        </div>

        {/* Location & Timezone */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="profile-location" className="text-xs">
              Location
            </Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="profile-location"
                value={values.location}
                onChange={(e) => onFieldChange("location", e.target.value)}
                placeholder="Viet Nam"
                className="h-9 pl-8 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-timezone" className="text-xs">
              Timezone Label
            </Label>
            <Input
              id="profile-timezone"
              value={values.timezone}
              onChange={(e) => onFieldChange("timezone", e.target.value)}
              placeholder="UTC+7"
              className="h-9 font-mono text-xs"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="profile-email" className="text-xs">
              Email Address
            </Label>
            <Input
              id="profile-email"
              type="email"
              value={values.email}
              onChange={(e) => onFieldChange("email", e.target.value)}
              placeholder="phongphanq089@gmail.com"
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-phone" className="text-xs">
              Phone Number
            </Label>
            <Input
              id="profile-phone"
              type="tel"
              value={values.phone}
              onChange={(e) => onFieldChange("phone", e.target.value)}
              placeholder="0706113210"
              className="h-9 font-mono text-xs"
            />
          </div>
        </div>

        {/* Status & Badge Label */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Availability Status</Label>
            <Select
              value={values.status}
              onValueChange={(val) => {
                if (val) {
                  onFieldChange("status", val as ProfileAvailabilityStatus)
                }
              }}
            >
              <SelectTrigger className="h-9 w-full text-xs">
                <SelectValue>
                  {currentStatusOption ? (
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${currentStatusOption.dotClass}`}
                      />
                      <span>{currentStatusOption.label}</span>
                    </span>
                  ) : (
                    "Select status"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectPopup>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${option.dotClass}`}
                      />
                      <span>{option.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="profile-status-label" className="text-xs">
              Status Badge Text
            </Label>
            <Input
              id="profile-status-label"
              value={values.statusLabel}
              onChange={(e) => onFieldChange("statusLabel", e.target.value)}
              placeholder="Portfolio upgrade in progress"
              className="h-9 text-xs"
            />
          </div>
        </div>
      </div>
    </AdminContentCard>
  )
}
