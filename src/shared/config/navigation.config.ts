export interface NavItemConfig {
  id: string
  label: string
  title: string
  link: string
  shortcut?: string[]
  description?: string
  keywords?: string[]
  badge?: "LIVE" | "COMING_SOON" | string
}

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  {
    id: "home",
    label: "HOME",
    title: "Home",
    link: "/",
    shortcut: ["H", "P"],
    badge: "LIVE",
    description: "Go to homepage",
    keywords: ["home", "trang chu", "main", "landing"],
  },
  {
    id: "component-ui",
    label: "COMPONENT-UI",
    title: "Component UI",
    link: "/component-ui",
    shortcut: ["G", "C"],
    badge: "LIVE",
    description: "Pixel-perfect, uniquely crafted UI primitives",
    keywords: ["components", "ui", "primitives", "widgets"],
  },
  {
    id: "block",
    label: "BLOCKS",
    title: "Blocks",
    link: "/blocks",
    shortcut: ["G", "B"],
    badge: "LIVE",
    description: "Beautifully designed, production-ready blocks",
    keywords: ["blocks", "sections", "components", "templates"],
  },
  {
    id: "blog",
    label: "BLOG",
    title: "Blog",
    link: "/blog",
    shortcut: ["G", "L"],
    badge: "COMING_SOON",
    description: "Read technical articles and insights",
    keywords: ["blog", "bai viet", "articles", "news"],
  },
  {
    id: "resources",
    label: "RESOURCES",
    title: "Resources",
    link: "/resources",
    shortcut: ["G", "R"],
    badge: "COMING_SOON",
    description: "Curated tools, bookmarks and resources",
    keywords: ["resources", "tai nguyen", "tools", "bookmarks"],
  },

  {
    id: "colophon",
    label: "COLOPHON",
    title: "Colophon",
    link: "/colophon",
    shortcut: ["G", "D"],
    badge: "LIVE",
    description: "System specifications, tech stack, typography & inspirations",
    keywords: [
      "colophon",
      "tech stack",
      "design",
      "typography",
      "inspirations",
      "specs",
    ],
  },
]
