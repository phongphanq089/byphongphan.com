import { Link } from "@tanstack/react-router"
import { Check, ExternalLink, RotateCcw, Save } from "lucide-react"
import { useCallback, useMemo, useState } from "react"

import { AdminPageHeader, useAdminConfirm } from "@/admin"
import { Badge, Button } from "@/shared/ui"

import { ProfileBioStackCard } from "./components/profile-bio-stack-card"
import { ProfileIdentityCard } from "./components/profile-identity-card"
import { ProfilePreviewSidebar } from "./components/profile-preview-sidebar"
import { ProfileSocialLinksCard } from "./components/profile-social-links-card"
import { INITIAL_ADMIN_PROFILE } from "./mock-data"
import type { AdminProfileData, ProfileSocials } from "./types"

export function AdminProfileView() {
  const [savedProfile, setSavedProfile] = useState<AdminProfileData>(
    INITIAL_ADMIN_PROFILE
  )
  const [values, setValues] = useState<AdminProfileData>(INITIAL_ADMIN_PROFILE)
  const [justSaved, setJustSaved] = useState(false)
  const { confirm, ConfirmDialog } = useAdminConfirm()

  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(savedProfile),
    [values, savedProfile]
  )

  const handleFieldChange = useCallback(
    <K extends keyof AdminProfileData>(
      field: K,
      value: AdminProfileData[K]
    ) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      setJustSaved(false)
    },
    []
  )

  const handleSocialChange = useCallback(
    <K extends keyof ProfileSocials>(field: K, value: ProfileSocials[K]) => {
      setValues((prev) => ({
        ...prev,
        socials: {
          ...prev.socials,
          [field]: value,
        },
      }))
      setJustSaved(false)
    },
    []
  )

  const handleSave = () => {
    const nextSaved: AdminProfileData = {
      ...values,
      updatedAt: new Date().toISOString(),
    }
    setSavedProfile(nextSaved)
    setValues(nextSaved)
    setJustSaved(true)
    window.setTimeout(() => {
      setJustSaved(false)
    }, 2500)
  }

  const handleDiscard = async () => {
    if (!isDirty) return

    const ok = await confirm({
      title: "Discard unsaved profile changes?",
      description:
        "All edits made since your last save will be reverted back to the saved profile state.",
      variant: "warning",
      confirmText: "Discard changes",
      cancelText: "Keep editing",
    })

    if (!ok) return
    setValues(savedProfile)
    setJustSaved(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title={
          <span className="inline-flex items-center gap-2.5">
            <span>Author Profile</span>
            {isDirty ? (
              <Badge
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-[11px] font-medium text-amber-700 dark:text-amber-400"
              >
                Unsaved changes
              </Badge>
            ) : justSaved ? (
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-[11px] font-medium text-emerald-700 dark:text-emerald-400"
              >
                Saved
              </Badge>
            ) : null}
          </span>
        }
        description="Manage your public portfolio bio, availability status, core stack, and social links."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "System & Media" },
          { label: "Profile" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <Link to="/profile" target="_blank">
                <ExternalLink className="size-3.5" />
                <span>View Public Profile</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={!isDirty}
              onClick={handleDiscard}
            >
              <RotateCcw className="size-3.5" />
              <span>Discard</span>
            </Button>

            <Button
              type="button"
              size="sm"
              className="gap-1.5"
              disabled={!isDirty}
              onClick={handleSave}
            >
              {justSaved ? (
                <Check className="size-3.5" />
              ) : (
                <Save className="size-3.5" />
              )}
              <span>{justSaved ? "Saved" : "Save Profile"}</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-6">
          <ProfileIdentityCard
            values={values}
            onFieldChange={handleFieldChange}
          />
          <ProfileBioStackCard
            values={values}
            onFieldChange={handleFieldChange}
          />
          <ProfileSocialLinksCard
            values={values}
            onFieldChange={handleFieldChange}
            onSocialChange={handleSocialChange}
          />
        </div>

        <ProfilePreviewSidebar
          values={values}
          onFieldChange={handleFieldChange}
        />
      </div>

      <ConfirmDialog />
    </div>
  )
}
