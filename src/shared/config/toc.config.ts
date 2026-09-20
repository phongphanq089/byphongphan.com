import type { TOCItemType } from "@/shared/ui/system/toc-minimap"

export const HOME_TOC_ITEMS: TOCItemType[] = [
  { title: "Home", url: "#banner", depth: 1 },
  { title: "About", url: "#about", depth: 1 },
  { title: "Tech Stack", url: "#tech-stack", depth: 1 },
  { title: "Blocks", url: "#blocks", depth: 1 },
  { title: "Components", url: "#components-ui", depth: 1 },
  { title: "Writing", url: "#blog", depth: 1 },
  { title: "Resources", url: "#resources", depth: 1 },
  { title: "Bookmarks", url: "#bookmarks", depth: 1 },
  { title: "Location", url: "#vietnam-map", depth: 1 },
]

export const DESIGN_SYSTEM_TOC_ITEMS: TOCItemType[] = [
  { title: "Overview", url: "#overview", depth: 1 },
  { title: "Logo & Brand Mark", url: "#brand", depth: 1 },
  { title: "Tokens & Colors", url: "#tokens", depth: 1 },
  { title: "Buttons & Controls", url: "#buttons", depth: 1 },
  { title: "Shaders & FX", url: "#animations", depth: 1 },
  { title: "Cards & Containers", url: "#cards", depth: 1 },
  { title: "Blueprint & Layout", url: "#blueprint", depth: 1 },
  { title: "States & Feedback", url: "#feedback", depth: 1 },
  { title: "Tech Icons", url: "#icons", depth: 1 },
  { title: "API Inspector", url: "#api-inspector", depth: 1 },
]

// Legacy export alias
export const TOCItems = HOME_TOC_ITEMS
