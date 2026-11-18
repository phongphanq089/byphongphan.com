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
    id: "ui",
    label: "UI",
    title: "UI Studio",
    link: "/ui",
    shortcut: ["G", "U"],
    badge: "LIVE",
    description: "Interactive UI primitives, blocks, and React hooks",
    keywords: ["ui", "components", "blocks", "hooks", "studio", "registry"],
  },
  {
    id: "mcp",
    label: "MCP",
    title: "MCP Server",
    link: "/mcp",
    shortcut: ["G", "M"],
    badge: "LIVE",
    description: "Build with your AI editor using Model Context Protocol",
    keywords: [
      "mcp",
      "ai",
      "cursor",
      "claude",
      "vscode",
      "editor",
      "model context protocol",
    ],
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
]
