import { Code2, Package } from "lucide-react"

import { AdminContentCard, AdminImageUploadField } from "@/admin"
import { Input, Label, Separator } from "@/shared/ui"

import type { AdminSiteSettingsData } from "../types"

interface SettingsIconsRegistryCardProps {
  values: AdminSiteSettingsData
  onFieldChange: <K extends keyof AdminSiteSettingsData>(
    field: K,
    value: AdminSiteSettingsData[K]
  ) => void
}

export function SettingsIconsRegistryCard({
  values,
  onFieldChange,
}: SettingsIconsRegistryCardProps) {
  return (
    <AdminContentCard
      title={
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <Package className="size-4 text-muted-foreground" />
          <span>Favicons &amp; Registry Configuration</span>
        </span>
      }
      description="Browser icon paths and @byphongphan component registry endpoints"
      minHeight="min-h-0"
      padding="default"
      className="flex-none"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminImageUploadField
            id="settings-favicon-ico"
            label="Favicon (.ico)"
            value={values.favicon}
            onChange={(val) => onFieldChange("favicon", val)}
            accept=".ico,image/x-icon,image/png"
            hint="32×32px ICO/PNG"
          />

          <AdminImageUploadField
            id="settings-apple-icon"
            label="Apple Touch Icon"
            value={values.appleTouchIcon}
            onChange={(val) => onFieldChange("appleTouchIcon", val)}
            accept="image/png"
            hint="180×180px PNG"
          />

          <AdminImageUploadField
            id="settings-favicon-svg"
            label="Light Mode SVG Icon"
            value={values.faviconSvg}
            onChange={(val) => onFieldChange("faviconSvg", val)}
            accept=".svg,image/svg+xml"
            hint="SVG vector"
          />

          <AdminImageUploadField
            id="settings-favicon-dark-svg"
            label="Dark Mode SVG Icon"
            value={values.faviconDarkSvg}
            onChange={(val) => onFieldChange("faviconDarkSvg", val)}
            accept=".svg,image/svg+xml"
            previewTheme="dark"
            hint="SVG vector (dark bg)"
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Code2 className="size-4 text-muted-foreground" />
            <div>
              <h4 className="text-xs font-semibold text-foreground">
                UI Registry &amp; Source Repository
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Used by shadcn CLI / MCP documentation and footer source links
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="settings-registry-namespace" className="text-xs">
                Registry Namespace
              </Label>
              <Input
                id="settings-registry-namespace"
                value={values.registryNamespace}
                onChange={(e) =>
                  onFieldChange("registryNamespace", e.target.value)
                }
                placeholder="@byphongphan"
                className="h-9 font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="settings-repo-url" className="text-xs">
                GitHub Repository URL
              </Label>
              <Input
                id="settings-repo-url"
                type="url"
                value={values.repoUrl}
                onChange={(e) => onFieldChange("repoUrl", e.target.value)}
                placeholder="https://github.com/phongphanq089/byphongphan.com"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="settings-registry-url" className="text-xs">
                Registry URL Template
              </Label>
              <Input
                id="settings-registry-url"
                value={values.registryUrlTemplate}
                onChange={(e) =>
                  onFieldChange("registryUrlTemplate", e.target.value)
                }
                placeholder="https://byphongphan.com/r/{name}.json"
                className="h-9 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminContentCard>
  )
}
