import { Link } from "@tanstack/react-router"
import {
  Bell,
  Clock,
  ExternalLink,
  Eye,
  Github,
  Linkedin,
  Mail,
  ShieldCheck,
  Twitter,
} from "lucide-react"

import { AdminContentCard } from "@/admin"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Separator,
  Switch,
} from "@/shared/ui"

import type { AdminProfileData, ProfileAvailabilityStatus } from "../types"

interface ProfilePreviewSidebarProps {
  values: AdminProfileData
  onFieldChange: <K extends keyof AdminProfileData>(
    field: K,
    value: AdminProfileData[K]
  ) => void
}

const STATUS_BADGE_CLASS: Record<ProfileAvailabilityStatus, string> = {
  available:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  building:
    "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  busy: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400",
  offline: "border-border bg-muted text-muted-foreground",
}

const STATUS_DOT_CLASS: Record<ProfileAvailabilityStatus, string> = {
  available: "bg-emerald-500",
  building: "bg-amber-500",
  busy: "bg-rose-500",
  offline: "bg-muted-foreground/60",
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "PP"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function ProfilePreviewSidebar({
  values,
  onFieldChange,
}: ProfilePreviewSidebarProps) {
  return (
    <div className="flex flex-col gap-6 xl:sticky xl:top-20 xl:self-start">
      {/* Live Card Preview */}
      <AdminContentCard
        title={
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <Eye className="size-4 text-muted-foreground" />
            <span>Live Card Preview</span>
          </span>
        }
        description="Snapshot of your public /profile hero"
        minHeight="min-h-0"
        padding="default"
        className="flex-none"
        actions={
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs"
            asChild
          >
            <Link to="/profile" target="_blank">
              <span>Open</span>
              <ExternalLink className="size-3" />
            </Link>
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3.5">
            <Avatar className="size-14 shrink-0 rounded-xl border border-border/80 bg-muted shadow-xs">
              <AvatarImage
                src={values.avatarUrl}
                alt={values.fullName}
                className="object-cover"
              />
              <AvatarFallback className="rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {getInitials(values.fullName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-1.5">
              {values.statusLabel && (
                <div
                  className={`inline-flex max-w-full items-center gap-1.5 rounded-sm border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase ${STATUS_BADGE_CLASS[values.status]}`}
                >
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${STATUS_DOT_CLASS[values.status]}`}
                  />
                  <span className="truncate">{values.statusLabel}</span>
                </div>
              )}

              <div>
                <h3 className="truncate text-base font-bold text-foreground">
                  {values.fullName || "Unnamed Author"}
                </h3>
                <p className="truncate font-mono text-[11px] text-muted-foreground">
                  {values.displayName}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            {values.headline}
          </p>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            <span>{values.location || "Viet Nam"}</span>
            {values.showLiveClock && (
              <>
                <span>·</span>
                <span>{values.timezone || "UTC+7"}</span>
              </>
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {values.socials.github && (
                <a
                  href={values.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="inline-flex size-8 items-center justify-center rounded-full border border-border/80 bg-muted/30 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="size-3.5" />
                </a>
              )}
              {values.socials.linkedin && (
                <a
                  href={values.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex size-8 items-center justify-center rounded-full border border-border/80 bg-muted/30 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Linkedin className="size-3.5" />
                </a>
              )}
              {values.socials.twitter && (
                <a
                  href={values.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (Twitter)"
                  className="inline-flex size-8 items-center justify-center rounded-full border border-border/80 bg-muted/30 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Twitter className="size-3.5" />
                </a>
              )}
              {values.email && (
                <a
                  href={`mailto:${values.email}`}
                  aria-label="Email"
                  className="inline-flex size-8 items-center justify-center rounded-full border border-border/80 bg-muted/30 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-3.5" />
                </a>
              )}
            </div>

            <Badge variant="outline" className="text-[10px]">
              {values.publicProfileVisible ? "Public" : "Hidden"}
            </Badge>
          </div>
        </div>
      </AdminContentCard>

      {/* Preferences & Security */}
      <AdminContentCard
        title={
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-4 text-muted-foreground" />
            <span>Visibility &amp; Preferences</span>
          </span>
        }
        description="Display toggles and workspace security"
        minHeight="min-h-0"
        padding="default"
        className="flex-none"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-foreground">
                Public Profile Page
              </p>
              <p className="text-[11px] text-muted-foreground">
                Show /profile route to visitors
              </p>
            </div>
            <Switch
              checked={values.publicProfileVisible}
              onCheckedChange={(checked) =>
                onFieldChange("publicProfileVisible", checked)
              }
              aria-label="Toggle public profile visibility"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-foreground">
                  Live Local Clock
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Display UTC+7 live time on hero
                </p>
              </div>
            </div>
            <Switch
              checked={values.showLiveClock}
              onCheckedChange={(checked) =>
                onFieldChange("showLiveClock", checked)
              }
              aria-label="Toggle live local clock"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-foreground">
                  Two-Factor Auth
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Protect admin workspace sign-in
                </p>
              </div>
            </div>
            <Switch
              checked={values.twoFactorEnabled}
              onCheckedChange={(checked) =>
                onFieldChange("twoFactorEnabled", checked)
              }
              aria-label="Toggle two-factor authentication"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <Bell className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-foreground">
                  Email Notifications
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Receive contact &amp; activity alerts
                </p>
              </div>
            </div>
            <Switch
              checked={values.emailNotifications}
              onCheckedChange={(checked) =>
                onFieldChange("emailNotifications", checked)
              }
              aria-label="Toggle email notifications"
            />
          </div>
        </div>
      </AdminContentCard>
    </div>
  )
}
