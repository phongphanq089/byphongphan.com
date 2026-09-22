export interface NavItemConfig {
  id: string
  label: string
  title: string
  link: string
  shortcut?: string[]
}

export const MAIN_NAV_ITEMS: NavItemConfig[] = [
  {
    id: "home",
    label: "HOME",
    title: "Home",
    link: "/",
    shortcut: ["H", "P"],
  },
  {
    id: "block",
    label: "BLOCKS",
    title: "Blocks",
    link: "/blocks",
    shortcut: ["G", "B"],
  },
  {
    id: "blog",
    label: "BLOG",
    title: "Blog",
    link: "/blog",
    shortcut: ["G", "L"],
  },
  {
    id: "resources",
    label: "RESOURCES",
    title: "Resources",
    link: "/resources",
    shortcut: ["G", "R"],
  },
  {
    id: "component-ui",
    label: "COMPONENT-UI",
    title: "Component UI",
    link: "/component-ui",
    shortcut: ["G", "C"],
  },
  {
    id: "colophon",
    label: "COLOPHON",
    title: "Colophon",
    link: "/colophon",
    shortcut: ["G", "D"],
  },
]
