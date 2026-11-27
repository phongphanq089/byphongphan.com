import { siteConfig } from "@/shared/config"

import type { AdminProfileData } from "./types"

export const INITIAL_ADMIN_PROFILE: AdminProfileData = {
  fullName: siteConfig.author.name,
  displayName: "@phongphanq089",
  headline: "Frontend Engineer · Fullstack Capable",
  bio: siteConfig.author.bio,
  extendedBio: [
    "I’m Phong Phan — a Frontend Engineer with a solid fullstack foundation, passionate about crafting highly polished user interfaces, fluid micro-interactions, and obsessive attention to visual detail.",
    "I love bridging the gap between aesthetics and engineering — transforming complex ideas into intuitive, responsive, and delightfully smooth digital experiences.",
    "Always excited to build high-quality web applications, refine user experiences, and collaborate with ambitious teams.",
  ].join("\n\n"),
  location: siteConfig.author.location,
  timezone: "UTC+7",
  email: siteConfig.author.email,
  phone: siteConfig.author.phone,
  avatarUrl: "/avatar-about.jpg",
  githubUsername: siteConfig.author.githubUsername,
  status: "building",
  statusLabel: "Portfolio upgrade in progress",
  showLiveClock: true,
  publicProfileVisible: true,
  twoFactorEnabled: true,
  emailNotifications: true,
  socials: {
    github: siteConfig.social.github.href,
    linkedin: "https://www.linkedin.com/in/phong-phan-719464201",
    twitter: siteConfig.social.twitter.href,
    website: siteConfig.url,
  },
  techGroups: [
    {
      id: "frontend-core",
      label: "Frontend Core",
      items:
        "TypeScript · React · Next.js · TanStack · Tailwind CSS · Motion · Scalable UI Systems",
    },
    {
      id: "fullstack",
      label: "Fullstack",
      items: "Node.js · REST APIs · Headless CMS",
    },
  ],
  updatedAt: "2026-11-27T06:00:00Z",
}
