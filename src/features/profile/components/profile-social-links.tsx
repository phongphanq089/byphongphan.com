import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import type { ComponentType } from "react"

import { siteConfig } from "@/shared/config"

import { ProfileThemeToggle } from "./profile-theme-toggle"

const withProtocol = (url: string) =>
  /^https?:\/\//.test(url) ? url : `https://${url}`

const SOCIALS: {
  name: string
  href: string
  label: string
  Icon: ComponentType<{ className?: string }>
}[] = [
  {
    name: "GitHub",
    href: siteConfig.social.github.href,
    label: `GitHub — @${siteConfig.author.githubUsername}`,
    Icon: Github,
  },
  {
    name: "LinkedIn",
    href: withProtocol(siteConfig.social.linkedin.href),
    label: "LinkedIn — Phong Phan",
    Icon: Linkedin,
  },
  {
    name: "X (Twitter)",
    href: siteConfig.social.twitter.href,
    label: "X (Twitter) — @PhongPhanq089",
    Icon: Twitter,
  },
  {
    name: "Email",
    href: siteConfig.social.email.href,
    label: `Email — ${siteConfig.author.email}`,
    Icon: Mail,
  },
]

const BUTTON_CLASS =
  "inline-flex size-10 items-center justify-center rounded-full border border-border/80 bg-muted/20 text-muted-foreground transition-colors duration-300 hover:border-foreground/40 hover:bg-muted/60 hover:text-foreground"

/** Minimal social dock: centered brand icons in pill buttons. */
export function ProfileSocialLinks() {
  return (
    <nav
      aria-label="Social profiles"
      className="flex items-center justify-center gap-3"
    >
      {SOCIALS.map(({ name, href, label, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          title={label}
          className={BUTTON_CLASS}
        >
          <Icon className="size-4" />
        </a>
      ))}
      <ProfileThemeToggle />
    </nav>
  )
}
