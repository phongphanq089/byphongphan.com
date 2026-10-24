import {
  Atom,
  Bookmark,
  BookOpen,
  Code,
  Code2,
  Component,
  CookingPot,
  ExternalLink,
  Globe,
  Home,
  Laptop,
  Layers,
  Mail,
  Moon,
  Newspaper,
  Phone,
  Radio,
  Sun,
  User,
  Wrench,
} from "lucide-react"
import { type ReactNode } from "react"

import { REGISTRY_ITEMS } from "@/registry/registry"
import type { RegistryItem } from "@/registry/schema"
import {
  HOME_TOC_ITEMS,
  MAIN_NAV_ITEMS,
  type NavItemConfig,
  siteConfig,
  type TOCItemConfig,
} from "@/shared/config"
import { GitHub } from "@/shared/ui/icons"

// ── Types ─────────────────────────────────────────────────────────────

export type CommandMenuItem = {
  id: string
  title: string
  description?: string
  icon?: ReactNode
  shortcut?: string[]
  sequence?: string[]
  keywords?: string[]
  group: string
  to?: string
  externalUrl?: string
  action?:
    "theme-light" | "theme-dark" | "theme-system" | "toggle-music" | string
  badge?: string
}

export type CommandMenuGroup = {
  id: string
  heading: string
}

// ── Groups Definition ────────────────────────────────────────────────

export const COMMAND_GROUPS: CommandMenuGroup[] = [
  { id: "menu", heading: "Menu" },
  { id: "sections", heading: "Sections" },
  { id: "components-ui", heading: "Component UI" },
  { id: "blocks", heading: "Blocks" },
  { id: "showcase", heading: "Components Showcase" },
  { id: "theme", heading: "Theme & System" },
  { id: "social", heading: "Social & Contact" },
]

// ── 1. Navigation items (derived directly from MAIN_NAV_ITEMS) ───────

const NAVIGATION_ICON_MAP: Record<string, ReactNode> = {
  home: <Home className="size-4 text-pp-primary" />,
  block: <Layers className="size-4 text-pp-primary" />,
  blog: <Newspaper className="size-4 text-pp-primary" />,
  resources: <Bookmark className="size-4 text-pp-primary" />,
  "component-ui": <Atom className="size-4 text-pp-primary" />,
  colophon: <BookOpen className="size-4 text-pp-primary" />,
}

function buildNavigationMenuItems(): CommandMenuItem[] {
  return MAIN_NAV_ITEMS.map((item: NavItemConfig) => ({
    id: `nav-${item.id}`,
    title: item.title,
    description: item.description ?? `Go to ${item.title}`,
    icon: NAVIGATION_ICON_MAP[item.id] ?? (
      <Home className="size-4 text-pp-primary" />
    ),
    shortcut: item.shortcut,
    sequence: item.shortcut?.map((k) => k.toLowerCase()),
    keywords: item.keywords ?? [item.id, item.title.toLowerCase()],
    group: "menu",
    to: item.link,
  }))
}

// ── 2. Section scroll items (derived directly from HOME_TOC_ITEMS) ───

const SECTION_ICON_MAP: Record<string, ReactNode> = {
  banner: <Radio className="size-4 text-pp-primary" />,
  about: <User className="size-4 text-pp-primary" />,
  "tech-stack": <Code2 className="size-4 text-pp-primary" />,
  blocks: <CookingPot className="size-4 text-pp-primary" />,
  "components-ui": <Atom className="size-4 text-pp-primary" />,
  blog: <Newspaper className="size-4 text-pp-primary" />,
  resources: <Bookmark className="size-4 text-pp-primary" />,
  bookmarks: <Bookmark className="size-4 text-pp-primary" />,
  "vietnam-map": <Globe className="size-4 text-pp-primary" />,
}

function buildSectionMenuItems(): CommandMenuItem[] {
  return HOME_TOC_ITEMS.map((item: TOCItemConfig, index: number) => {
    const hash = item.url.startsWith("#") ? item.url : `#${item.url}`
    const id = hash.replace("#", "")
    const title = typeof item.title === "string" ? item.title : id
    const shortcut = item.shortcut ?? ["#", String(index + 1)]

    return {
      id: `sec-${id}`,
      title,
      description: item.description ?? `Jump to ${title} section`,
      icon: SECTION_ICON_MAP[id] ?? (
        <Radio className="size-4 text-pp-primary" />
      ),
      shortcut,
      sequence: shortcut.map((k) => k.toLowerCase()),
      keywords: item.keywords ?? [id, title.toLowerCase()],
      group: "sections",
      to: `/${hash}`,
    }
  })
}

// ── 3. Registry items (derived directly from REGISTRY_ITEMS) ─────────

const CATEGORY_ICON_MAP: Record<string, ReactNode> = {
  card: <Component className="size-4 text-pp-primary" />,
  background: <Layers className="size-4 text-pp-primary" />,
  navigation: <Radio className="size-4 text-pp-primary" />,
  text: <Code2 className="size-4 text-pp-primary" />,
  interactive: <Atom className="size-4 text-pp-primary" />,
  "data-display": <Code className="size-4 text-pp-primary" />,
  "404-page": <CookingPot className="size-4 text-pp-primary" />,
  auth: <User className="size-4 text-pp-primary" />,
  marketing: <Layers className="size-4 text-pp-primary" />,
  ecommerce: <CookingPot className="size-4 text-pp-primary" />,
  application: <CookingPot className="size-4 text-pp-primary" />,
}

const TYPE_ICON_MAP: Record<string, ReactNode> = {
  "registry:hook": <Code className="size-4 text-pp-primary" />,
  "registry:lib": <Wrench className="size-4 text-pp-primary" />,
}

function buildRegistryMenuItems(): CommandMenuItem[] {
  return REGISTRY_ITEMS.filter((item) => item.type !== "registry:hook").map(
    (item: RegistryItem) => {
      const isBlock = item.type === "registry:block"
      const basePath = isBlock ? "/blocks" : "/component-ui"
      const categorySlug = item.category

      return {
        id: `registry-${item.name}`,
        title: item.title,
        description: item.description,
        icon: CATEGORY_ICON_MAP[item.category] ?? TYPE_ICON_MAP[item.type] ?? (
          <Component className="size-4 text-pp-primary" />
        ),
        keywords: [
          item.name,
          item.title.toLowerCase(),
          item.category,
          item.type.replace("registry:", ""),
          ...(item.dependencies ?? []),
        ],
        group: isBlock ? "blocks" : "components-ui",
        badge: item.isNew ? "New" : undefined,
        to: `${basePath}/${categorySlug}/${item.name}`,
      }
    }
  )
}

// ── 5. Theme & System Actions ────────────────────────────────────────

const THEME_ACTION_ITEMS: CommandMenuItem[] = [
  {
    id: "action-theme-dark",
    title: "Dark Mode",
    description: "Switch interface to dark blueprint theme",
    icon: <Moon className="size-4 text-pp-primary" />,
    shortcut: ["T", "D"],
    sequence: ["t", "d"],
    keywords: ["theme dark", "dark mode", "night"],
    group: "theme",
    action: "theme-dark",
  },
  {
    id: "action-theme-light",
    title: "Light Mode",
    description: "Switch interface to clean light theme",
    icon: <Sun className="size-4 text-pp-primary" />,
    shortcut: ["T", "L"],
    sequence: ["t", "l"],
    keywords: ["theme light", "light mode", "day"],
    group: "theme",
    action: "theme-light",
  },
  {
    id: "action-theme-system",
    title: "System Theme",
    description: "Sync theme with your OS preference",
    icon: <Laptop className="size-4 text-pp-primary" />,
    shortcut: ["T", "S"],
    sequence: ["t", "s"],
    keywords: ["theme system", "auto"],
    group: "theme",
    action: "theme-system",
  },
]

// ── 6. Social & Contact items (derived directly from siteConfig) ─────

const SOCIAL_ICON_MAP: Record<string, ReactNode> = {
  github: <GitHub size={16} className="text-pp-primary" />,
  linkedin: <ExternalLink className="size-4 text-pp-primary" />,
  twitter: <ExternalLink className="size-4 text-pp-primary" />,
  email: <Mail className="size-4 text-pp-primary" />,
  phone: <Phone className="size-4 text-pp-primary" />,
}

function buildSocialMenuItems(): CommandMenuItem[] {
  return Object.entries(siteConfig.social).map(([key, item]) => {
    const isEmail = key === "email"
    const isPhone = key === "phone"
    const href =
      item.href.startsWith("http://") ||
      item.href.startsWith("https://") ||
      item.href.startsWith("mailto:") ||
      item.href.startsWith("tel:")
        ? item.href
        : `https://${item.href}`

    let description = `Open ${item.name}`
    if (isEmail) {
      description = `Get in touch: ${siteConfig.author.email}`
    } else if (isPhone) {
      description = `Direct phone contact: ${siteConfig.author.phone}`
    } else if ("username" in item && item.username) {
      description = `Check profile @${item.username}`
    }

    return {
      id: `social-${key}`,
      title: isEmail
        ? "Send Email"
        : isPhone
          ? "Call Phone"
          : `${item.name} Profile`,
      description,
      icon: SOCIAL_ICON_MAP[key] ?? (
        <ExternalLink className="size-4 text-pp-primary" />
      ),
      keywords: [key, item.name.toLowerCase(), "social", "contact", "lien he"],
      group: "social",
      externalUrl: href,
    }
  })
}

// ── Merged items for Command Palette ─────────────────────────────────

export const COMMAND_MENU_ITEMS: CommandMenuItem[] = [
  ...buildNavigationMenuItems(),
  ...buildSectionMenuItems(),
  ...buildRegistryMenuItems(),
  ...THEME_ACTION_ITEMS,
  ...buildSocialMenuItems(),
]
