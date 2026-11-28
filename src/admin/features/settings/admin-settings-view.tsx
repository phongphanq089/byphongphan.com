import { Check, RotateCcw, Save } from "lucide-react"
import { useCallback, useMemo, useState } from "react"

import { AdminPageHeader, useAdminConfirm } from "@/admin"
import { Badge, Button } from "@/shared/ui"

import { SettingsGeneralCard } from "./components/settings-general-card"
import { SettingsIconsRegistryCard } from "./components/settings-icons-registry-card"
import { SettingsPreviewSidebar } from "./components/settings-preview-sidebar"
import { SettingsSeoSocialCard } from "./components/settings-seo-social-card"
import { INITIAL_SITE_SETTINGS } from "./mock-data"
import type { AdminSiteSettingsData } from "./types"

export function AdminSettingsView() {
  const [savedSettings, setSavedSettings] = useState<AdminSiteSettingsData>(
    INITIAL_SITE_SETTINGS
  )
  const [values, setValues] = useState<AdminSiteSettingsData>(
    INITIAL_SITE_SETTINGS
  )
  const [justSaved, setJustSaved] = useState(false)
  const { confirm, ConfirmDialog } = useAdminConfirm()

  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(savedSettings),
    [values, savedSettings]
  )

  const handleFieldChange = useCallback(
    <K extends keyof AdminSiteSettingsData>(
      field: K,
      value: AdminSiteSettingsData[K]
    ) => {
      setValues((prev) => ({ ...prev, [field]: value }))
      setJustSaved(false)
    },
    []
  )

  const handleSave = () => {
    const nextSaved: AdminSiteSettingsData = {
      ...values,
      updatedAt: new Date().toISOString(),
    }
    setSavedSettings(nextSaved)
    setValues(nextSaved)
    setJustSaved(true)
    window.setTimeout(() => {
      setJustSaved(false)
    }, 2500)
  }

  const handleDiscard = async () => {
    if (!isDirty) return

    const ok = await confirm({
      title: "Discard unsaved settings?",
      description:
        "All changes made to site metadata, SEO tags, and platform preferences will be reverted.",
      variant: "warning",
      confirmText: "Discard changes",
      cancelText: "Keep editing",
    })

    if (!ok) return
    setValues(savedSettings)
    setJustSaved(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <AdminPageHeader
        title={
          <span className="inline-flex items-center gap-2.5">
            <span>Site Settings &amp; SEO</span>
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
        description="Configure global metadata, OpenGraph cards, SEO keywords, favicons, and registry endpoints."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "System & Media" },
          { label: "Settings" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
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
              <span>{justSaved ? "Saved" : "Save Settings"}</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          <SettingsGeneralCard
            values={values}
            onFieldChange={handleFieldChange}
          />
          <SettingsSeoSocialCard
            values={values}
            onFieldChange={handleFieldChange}
          />
          <SettingsIconsRegistryCard
            values={values}
            onFieldChange={handleFieldChange}
          />
        </div>

        <SettingsPreviewSidebar
          values={values}
          onFieldChange={handleFieldChange}
        />
      </div>

      <ConfirmDialog />
    </div>
  )
}
