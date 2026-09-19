import type React from "react"

import { siteConfig } from "@/shared/config"
import { Sanity, ShadcnUI, Tailwind, Tanstack } from "@/shared/ui/icons"

export interface ArchitectureSpec {
  role: string
  tech: string
  detail: string
  href: string
}

export const architectureSpecs: ArchitectureSpec[] = [
  {
    role: "ENGINE",
    tech: "TanStack Start + React 19",
    detail: "SSR, typed routes & server functions",
    href: "https://tanstack.com/start",
  },
  {
    role: "STYLING",
    tech: "Tailwind CSS v4",
    detail: "OKLCH color engine & design tokens",
    href: "https://tailwindcss.com",
  },
  {
    role: "CONTENT",
    tech: "Sanity Studio v5",
    detail: "Headless CMS & real-time GROQ lake",
    href: "https://www.sanity.io",
  },
  {
    role: "PRIMITIVES",
    tech: "Radix UI + shadcn/ui",
    detail: "Accessible WAI-ARIA composable blocks",
    href: "https://ui.shadcn.com",
  },
  {
    role: "HOSTING",
    tech: "Netlify Edge",
    detail: "Global CDN & serverless edge runtime",
    href: "https://www.netlify.com",
  },
]

export interface FooterNavItem {
  name: string
  href: string
  shortcut?: string
  badge?: string
}

export const footerNavigation: FooterNavItem[] = [
  { name: "Home", href: "/", badge: "LIVE", shortcut: "H P" },
  { name: "Blog", href: "/blog", badge: "COMING_SOON", shortcut: "B L" },
  {
    name: "Component UI",
    href: "/component-ui",
    badge: "LIVE",
    shortcut: "C U",
  },
  { name: "Blocks", href: "/blocks", badge: "COMING_SOON", shortcut: "B L" },
  {
    name: "Resources",
    href: "/resources",
    badge: "COMING_SOON",
    shortcut: "B L",
  },
  {
    name: "colophon",
    href: "/colophon",
    badge: "LIVE",
    shortcut: "C P",
  },
]

export interface FooterSocial {
  name: string
  handle: string
  href: string
  iconName: "github" | "linkedin" | "twitter" | "email"
}

export const footerSocials: FooterSocial[] = [
  {
    name: "GitHub",
    handle: `@${siteConfig.author.githubUsername}`,
    href: siteConfig.social.github.href,
    iconName: "github",
  },
  {
    name: "LinkedIn",
    handle: "in/phong-phan",
    href: `https://${siteConfig.social.linkedin.href.replace(/^https?:\/\//, "")}`,
    iconName: "linkedin",
  },
  {
    name: "X (Twitter)",
    handle: "@PhongPhanq089",
    href: siteConfig.social.twitter.href,
    iconName: "twitter",
  },
  {
    name: "Email",
    handle: siteConfig.author.email,
    href: siteConfig.social.email.href,
    iconName: "email",
  },
]

export const inspriedBy = siteConfig.inspirations

export interface TechCredit {
  name: string
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string; size?: number | string }>
  badge: string
}

export const coreTechnologies: TechCredit[] = [
  {
    name: "Tailwind CSS",
    title: "Tailwind CSS",
    description:
      "Utility-first styling engine, custom design tokens, and OKLCH color palettes.",
    href: "https://tailwindcss.com",
    icon: Tailwind,
    badge: "Design & CSS",
  },
  {
    name: "shadcn/ui",
    title: "shadcn/ui",
    description:
      "Accessible, beautifully crafted UI primitives and reusable React components.",
    href: "https://ui.shadcn.com",
    icon: ShadcnUI,
    badge: "UI Library",
  },
  {
    name: "TanStack",
    title: "TanStack",
    description:
      "Headless, type-safe, composable tools for building modern web applications that work naturally for developers and reliably for agents",
    href: "https://tanstack.com",
    icon: Tanstack,
    badge: "Framework",
  },
  {
    name: "Sanity",
    title: "Sanity CMS",
    description:
      "Headless content platform, real-time schema modeling, and embedded Studio.",
    href: "https://www.sanity.io",
    icon: Sanity,
    badge: "Content CMS",
  },
]

export const scocialLinks = [
  {
    name: "GitHub",
    href: siteConfig.social.github.href,
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: siteConfig.social.linkedin.href,
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    name: "X (Twitter)",
    href: siteConfig.social.twitter.href,
    icon: (
      <svg
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "Email",
    href: siteConfig.social.email.href,
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
        />
      </svg>
    ),
  },
]
