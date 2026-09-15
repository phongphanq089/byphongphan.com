import type { ComponentCategory, ComponentItem } from "./types"

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  { id: "all", label: "ALL" },
  { id: "primitives", label: "PRIMITIVES" },
  { id: "animations", label: "ANIMATIONS" },
  { id: "foundations", label: "FOUNDATIONS" },
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
    category: "animations",
    description:
      "Cursor-following radial specular highlight border card powered by CSS variables.",
    schematicType: "animated-glow-card",
    badge: "Motion",
  },
  // 6. Unboxing Bucket
  {
    id: "comp-unboxing-bucket",
    name: "Unboxing Bucket",
    slug: "unboxing-bucket",
    category: "animations",
    description:
      "Interactive 3D unboxing container animation with emerging spring-physics feature chips.",
    schematicType: "unboxing-bucket",
    badge: "Motion",
  },
  // 7. Separator
  {
    id: "comp-separator",
    name: "Separator",
    slug: "separator",
    category: "primitives",
    description:
      "Visually or semantically separates content in a page, supporting both horizontal and vertical orientations.",
    schematicType: "separator",
  },
  // 8. Code Block
  {
    id: "comp-code-block",
    name: "Code Block",
    slug: "code-block",
    category: "primitives",
    description:
      "Syntax-highlighted code display with Shiki, line numbers, line highlighting, collapsible blocks, diff mode, and copy actions.",
    schematicType: "code-block",
    badge: "Shiki",
  },
]
