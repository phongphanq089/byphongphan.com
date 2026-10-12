import type { TOCItemType } from "@/shared/ui/system/toc-minimap"

export interface TOCItemConfig extends TOCItemType {
  description?: string
  shortcut?: string[]
  keywords?: string[]
}

export const HOME_TOC_ITEMS: TOCItemConfig[] = [
  {
    title: "Banner Hero",
    url: "#banner",
    depth: 1,
    description: "Interactive terminal hero section",
    shortcut: ["#", "1"],
    keywords: ["banner", "hero", "header", "terminal"],
  },
  {
    title: "About Me",
    url: "#about",
    depth: 1,
    description: "Biography, skills & technical background",
    shortcut: ["#", "2"],
    keywords: ["about", "gioi thieu", "bio", "experience", "profile"],
  },
  {
    title: "Tech Stack",
    url: "#tech-stack",
    depth: 1,
    description: "Core technologies, libraries & frameworks",
    shortcut: ["#", "3"],
    keywords: ["tech stack", "skills", "react", "typescript", "tools"],
  },
  {
    title: "Blocks Section",
    url: "#blocks",
    depth: 1,
    description: "Composed, ready-to-drop page blocks",
    shortcut: ["#", "4"],
    keywords: ["blocks", "sections", "templates"],
  },
  {
    title: "UI Components Section",
    url: "#components-ui",
    depth: 1,
    description: "Interactive component showpieces",
    shortcut: ["#", "5"],
    keywords: ["components", "ui showcase", "widgets", "interactive"],
  },
  {
    title: "Writing Section",
    url: "#blog",
    depth: 1,
    description: "Articles, blogs, and dev notes",
    shortcut: ["#", "6"],
    keywords: ["blog", "writing", "articles"],
  },
  {
    title: "Resources Section",
    url: "#resources",
    depth: 1,
    description: "Curated tools and developer resources",
    shortcut: ["#", "7"],
    keywords: ["resources", "tools", "bookmarks"],
  },
  {
    title: "Location (Viet Nam)",
    url: "#vietnam-map",
    depth: 1,
    description: "Interactive geographic spotlight of Viet Nam",
    shortcut: ["#", "9"],
    keywords: ["vietnam", "map", "location", "origin", "viet nam"],
  },
]
// Legacy export alias
export const TOCItems = HOME_TOC_ITEMS
