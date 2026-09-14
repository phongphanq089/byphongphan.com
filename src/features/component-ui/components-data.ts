import type { ComponentCategory, ComponentItem } from "./types"

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  { id: "all", label: "All" },
  { id: "primitives", label: "Core Primitives" },
  { id: "blocks", label: "Composed Blocks" },
]

export const COMPONENTS_DATA: ComponentItem[] = [
  // 1. Select
  {
    id: "comp-select",
    name: "Select",
    slug: "select",
    category: "primitives",
    description:
      "Displays a list of options for the user to pick from—triggered by a button.",
    schematicType: "select",
  },
  // 2. Button
  {
    id: "comp-button",
    name: "Button",
    slug: "button",
    category: "primitives",
    description: "Displays a button or a component that looks like a button.",
    schematicType: "button",
  },
  // 3. Badge
  {
    id: "comp-badge",
    name: "Badge",
    slug: "badge",
    category: "primitives",
    description: "Displays a badge or a component that looks like a badge.",
    schematicType: "badge",
  },
  // 4. Card
  {
    id: "comp-card",
    name: "Card",
    slug: "card",
    category: "primitives",
    description: "Displays a card with header, content, and footer.",
    schematicType: "card",
  },
  // 5. Animated Glow Card
  {
    id: "comp-animated-glow-card",
    name: "Animated Glow Card",
    slug: "animated-glow-card",
    category: "blocks",
    description:
      "Cursor-following radial specular highlight border card powered by CSS variables.",
    schematicType: "animated-glow-card",
    badge: "Motion",
  },
]
