import {
  Activity,
  Atom,
  Bookmark,
  BookOpen,
  Code2,
  ExternalLink,
  Flame,
  Globe,
  Home,
  Laptop,
  Layers,
  Mail,
  Moon,
  Newspaper,
  Palette,
  Phone,
  Radio,
  Sparkles,
  Sun,
  User,
} from "lucide-react"
import type { ReactNode } from "react"

import { siteConfig } from "@/shared/config"
import { GitHub } from "@/shared/ui/icons"

export type CommandMenuItem = {
  id: string
  title: string
  description?: string
  icon?: ReactNode
  shortcut?: string[]
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

export const COMMAND_GROUPS: CommandMenuGroup[] = [
  { id: "menu", heading: "Menu" },
  { id: "sections", heading: "Sections" },
  { id: "components", heading: "Components" },
  { id: "theme", heading: "Theme & System" },
  { id: "social", heading: "Social & Contact" },
]

export const COMMAND_MENU_ITEMS: CommandMenuItem[] = [
  // ─── 1. Navigation Pages (Menu) ──────────────────────────────────────────
  {
    id: "nav-home",
    title: "Home",
    description: "Go to homepage",
    icon: <Home className="size-4 text-pp-primary" />,
    shortcut: ["G", "H"],
    keywords: ["home", "trang chu", "main", "landing"],
    group: "menu",
    to: "/",
  },
  {
    id: "nav-blocks",
    title: "Blocks",
    description: "Beautifully designed, production-ready blocks",
    icon: <Layers className="size-4 text-pp-primary" />,
    shortcut: ["G", "B"],
    keywords: [
      "blocks",
      "khoi giao dien",
      "sections",
      "components",
      "templates",
    ],
    group: "menu",
    to: "/block",
  },
  {
    id: "nav-blog",
    title: "Blog",
    description: "Read technical articles and insights",
    icon: <Newspaper className="size-4 text-pp-primary" />,
    shortcut: ["G", "L"],
    keywords: ["blog", "bai viet", "articles", "news"],
    group: "menu",
    to: "/blog",
  },
  {
    id: "nav-resources",
    title: "Resources",
    description: "Curated tools, bookmarks and resources",
    icon: <Bookmark className="size-4 text-pp-primary" />,
    shortcut: ["G", "R"],
    keywords: ["resources", "tai nguyen", "tools", "bookmarks"],
    group: "menu",
    to: "/resources",
  },
  {
    id: "nav-component-ui",
    title: "Component UI",
    description: "Pixel-perfect, uniquely crafted UI primitives",
    icon: <Atom className="size-4 text-pp-primary" />,
    shortcut: ["G", "C"],
    keywords: ["components", "ui", "primitives", "widgets"],
    group: "menu",
    to: "/component-ui",
  },
  {
    id: "nav-design-system",
    title: "Design System",
    description: "Explore color tokens, buttons, cards & typography",
    icon: <Palette className="size-4 text-pp-primary" />,
    shortcut: ["G", "D"],
    keywords: ["design system", "tokens", "components", "palette", "styles"],
    group: "menu",
    to: "/design-system",
  },
  {
    id: "nav-colophon",
    title: "Colophon",
    description: "System specifications, tech stack, typography & inspirations",
    icon: <BookOpen className="size-4 text-pp-primary" />,
    shortcut: ["G", "P"],
    keywords: [
      "colophon",
      "tech stack",
      "design",
      "typography",
      "inspirations",
      "specs",
      "credits",
    ],
    group: "menu",
    to: "/colophon",
  },
  {
    id: "nav-studio",
    title: "Studio (Sanity CMS)",
    description: "Interactive UI & Sanity CMS development studio",
    icon: <Sparkles className="size-4 text-pp-primary" />,
    shortcut: ["G", "S"],
    keywords: ["studio", "cms", "sanity", "editor", "playground"],
    group: "menu",
    to: "/studio/$",
  },

  // ─── 2. Homepage Sections (Scroll anchors) ──────────────────────────────
  {
    id: "sec-banner",
    title: "Banner Hero",
    description: "Interactive terminal hero section",
    icon: <Radio className="size-4 text-pp-primary" />,
    shortcut: ["#", "1"],
    keywords: ["banner", "hero", "header", "terminal"],
    group: "sections",
    to: "/#banner",
  },
  {
    id: "sec-about",
    title: "About Me",
    description: "Biography, skills & technical background",
    icon: <User className="size-4 text-pp-primary" />,
    shortcut: ["#", "2"],
    keywords: ["about", "gioi thieu", "bio", "experience", "profile"],
    group: "sections",
    to: "/#about",
  },
  {
    id: "sec-tech-stack",
    title: "Tech Stack",
    description: "Core technologies, libraries & frameworks",
    icon: <Code2 className="size-4 text-pp-primary" />,
    shortcut: ["#", "3"],
    keywords: ["tech stack", "skills", "react", "typescript", "tools"],
    group: "sections",
    to: "/#tech-stack",
  },
  {
    id: "sec-components",
    title: "UI Components Section",
    description: "Interactive component showpieces",
    icon: <Atom className="size-4 text-pp-primary" />,
    shortcut: ["#", "4"],
    keywords: ["components", "ui showcase", "widgets", "interactive"],
    group: "sections",
    to: "/#components-ui",
  },
  {
    id: "sec-vietnam-map",
    title: "Location (Viet Nam)",
    description: "Interactive geographic spotlight of Viet Nam",
    icon: <Globe className="size-4 text-pp-primary" />,
    shortcut: ["#", "5"],
    keywords: ["vietnam", "map", "location", "origin", "viet nam"],
    group: "sections",
    to: "/#vietnam-map",
  },

  // ─── 3. Components Showcase ─────────────────────────────────────────────
  {
    id: "comp-text-burn",
    title: "Text Burn Neon",
    description: "Char-by-char fire animation via GSAP",
    icon: <Flame className="size-4 text-pp-primary" />,
    shortcut: ["C", "1"],
    keywords: ["text burn neon", "fire", "gsap", "animation"],
    group: "components",
    badge: "New",
    to: "/#components-ui",
  },
  {
    id: "comp-liquid-metal",
    title: "Liquid Metal Button",
    description: "Fluid shader distortion button",
    icon: <Sparkles className="size-4 text-pp-primary" />,
    keywords: ["liquid metal button", "shader", "webgl"],
    group: "components",
    to: "/design-system",
  },
  {
    id: "comp-creepy-button",
    title: "Creepy Eye Button",
    description: "Interactive pupil tracking button",
    icon: <Activity className="size-4 text-pp-primary" />,
    keywords: ["creepy button", "eye", "tracking"],
    group: "components",
    to: "/design-system",
  },
  {
    id: "comp-dotted-glow",
    title: "Dotted Glow Background",
    description: "Canvas grid with reactive glow",
    icon: <Layers className="size-4 text-pp-primary" />,
    keywords: ["dotted glow background", "grid", "canvas", "particles"],
    group: "components",
    to: "/design-system",
  },
  {
    id: "comp-blueprint-lint",
    title: "Blueprint Lint Mark",
    description: "Technical blueprint reticle indicator",
    icon: <Code2 className="size-4 text-pp-primary" />,
    keywords: ["blueprint", "reticle", "crosshair", "technical"],
    group: "components",
    to: "/design-system",
  },

  // ─── 4. Theme & System Actions ──────────────────────────────────────────
  {
    id: "action-theme-dark",
    title: "Dark Mode",
    description: "Switch interface to dark blueprint theme",
    icon: <Moon className="size-4 text-pp-primary" />,
    shortcut: ["T", "D"],
    keywords: ["theme dark", "toi", "dark mode", "night"],
    group: "theme",
    action: "theme-dark",
  },
  {
    id: "action-theme-light",
    title: "Light Mode",
    description: "Switch interface to clean light theme",
    icon: <Sun className="size-4 text-pp-primary" />,
    shortcut: ["T", "L"],
    keywords: ["theme light", "sang", "light mode", "day"],
    group: "theme",
    action: "theme-light",
  },
  {
    id: "action-theme-system",
    title: "System Theme",
    description: "Sync theme with your OS preference",
    icon: <Laptop className="size-4 text-pp-primary" />,
    shortcut: ["T", "S"],
    keywords: ["theme system", "he thong", "auto"],
    group: "theme",
    action: "theme-system",
  },

  // ─── 5. Social & Contact ────────────────────────────────────────────────
  {
    id: "social-github",
    title: "GitHub Profile",
    description: "Check open-source code and contributions",
    icon: <GitHub size={16} className="text-pp-primary" />,
    keywords: ["github", "code", "repo", "git"],
    group: "social",
    externalUrl: siteConfig.social.github.href,
  },
  {
    id: "social-linkedin",
    title: "LinkedIn Profile",
    description: "Connect with Phong Phan on LinkedIn",
    icon: <ExternalLink className="size-4 text-pp-primary" />,
    keywords: ["linkedin", "connect", "recruitment", "cv"],
    group: "social",
    externalUrl: siteConfig.social.linkedin.href,
  },
  {
    id: "social-twitter",
    title: "X (Twitter)",
    description: "Follow updates and dev discussions",
    icon: <ExternalLink className="size-4 text-pp-primary" />,
    keywords: ["twitter", "x", "social"],
    group: "social",
    externalUrl: siteConfig.social.twitter.href,
  },
  {
    id: "social-email",
    title: "Send Email",
    description: `Get in touch: ${siteConfig.author.email}`,
    icon: <Mail className="size-4 text-pp-primary" />,
    keywords: ["email", "mail", "contact", "lien he", "gmail"],
    group: "social",
    externalUrl: siteConfig.social.email.href,
  },
  {
    id: "social-phone",
    title: "Call Phone",
    description: `Direct phone contact: ${siteConfig.author.phone}`,
    icon: <Phone className="size-4 text-pp-primary" />,
    keywords: ["phone", "call", "dien thoai", "so dien thoai"],
    group: "social",
    externalUrl: siteConfig.social.phone.href,
  },
]
