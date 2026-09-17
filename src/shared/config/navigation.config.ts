export interface NavItemConfig {
  id: string
  label: string
  title: string
  link: string
  color: string
  textColor: string
  border: string
  bg: string
  shortcut?: string[]
  description?: string
}

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  {
    id: "block",
    label: "BLOCKS",
    title: "Blocks",
    link: "/blocks",
    color: "var(--pp-primary)",
    textColor: "text-pp-primary",
    border: "border-pp-primary",
    bg: "bg-pp-primary",
    shortcut: ["G", "B"],
    description: "Beautifully designed, production-ready blocks.",
  },
  {
    id: "blog",
    label: "BLOG",
    title: "Blog",
    link: "/blog",
    color: "var(--pp-primary)",
    textColor: "text-pp-primary",
    border: "border-pp-primary",
    bg: "bg-pp-primary",
    shortcut: ["G", "L"],
    description: "Read technical articles and insights",
  },
  {
    id: "resources",
    label: "RESOURCES",
    title: "Resources",
    link: "/resources",
    color: "var(--pp-primary)",
    textColor: "text-pp-primary",
    border: "border-pp-primary",
    bg: "bg-pp-primary",
    shortcut: ["G", "R"],
    description: "Curated tools, bookmarks and resources",
  },
  {
    id: "component-ui",
    label: "COMPONENT-UI",
    title: "Component UI",
    link: "/component-ui",
    color: "var(--pp-primary)",
    textColor: "text-pp-primary",
    border: "border-pp-primary",
    bg: "bg-pp-primary",
    shortcut: ["G", "C"],
    description: "Pixel-perfect, uniquely crafted UI components.",
  },
  {
    id: "Colophon",
    label: "COLOPHON",
    title: "Colophon",
    link: "/colophon",
    color: "var(--pp-primary)",
    textColor: "text-pp-primary",
    border: "border-pp-primary",
    bg: "bg-pp-primary",
    shortcut: ["G", "D"],
    description: "Engineering design tokens, shaders, and UI primitives",
  },
]
