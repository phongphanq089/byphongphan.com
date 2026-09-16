import type { RegistryItem } from "./schema"

export const REGISTRY_ITEMS: RegistryItem[] = [
  // 1. Select
  {
    name: "select",
    title: "Select",
    description:
      "Displays a list of options for the user to pick from—triggered by a button.",
    type: "registry:ui",
    category: "primitives",
    schematicType: "select",
    dependencies: ["radix-ui", "lucide-react"],
    registryDependencies: [],
    files: [
      {
        path: "ui/select.tsx",
        type: "registry:ui",
        target: "components/ui/select.tsx",
      },
    ],
  },
  // 2. Button
  {
    name: "button",
    title: "Button",
    description: "Displays a button or a component that looks like a button.",
    type: "registry:ui",
    category: "primitives",
    schematicType: "button",
    dependencies: ["radix-ui", "class-variance-authority"],
    registryDependencies: [],
    files: [
      {
        path: "ui/button.tsx",
        type: "registry:ui",
        target: "components/ui/button.tsx",
      },
    ],
  },
  // 3. Badge
  {
    name: "badge",
    title: "Badge",
    description: "Displays a badge or a component that looks like a badge.",
    type: "registry:ui",
    category: "primitives",
    schematicType: "badge",
    dependencies: ["@radix-ui/react-slot", "class-variance-authority"],
    registryDependencies: [],
    files: [
      {
        path: "ui/badge.tsx",
        type: "registry:ui",
        target: "components/ui/badge.tsx",
      },
    ],
  },
  // 4. Card
  {
    name: "card",
    title: "Card",
    description: "Displays a card with header, content, and footer.",
    type: "registry:ui",
    category: "primitives",
    schematicType: "card",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "ui/card.tsx",
        type: "registry:ui",
        target: "components/ui/card.tsx",
      },
    ],
  },
  // 5. Animated Glow Card
  {
    name: "animated-glow-card",
    title: "Animated Glow Card",
    description:
      "Cursor-following radial specular highlight border card powered by CSS variables.",
    type: "registry:component",
    category: "animations",
    schematicType: "animated-glow-card",
    badge: "Motion",
    dependencies: ["framer-motion"],
    registryDependencies: [],
    files: [
      {
        path: "animated/animated-glow-card.tsx",
        type: "registry:component",
        target: "components/animated-glow-card.tsx",
      },
    ],
  },
  // 6. Unboxing Bucket
  {
    name: "unboxing-bucket",
    title: "Unboxing Bucket",
    description:
      "Interactive 3D unboxing container animation with emerging spring-physics feature chips.",
    type: "registry:component",
    category: "animations",
    schematicType: "unboxing-bucket",
    badge: "Motion",
    dependencies: ["motion", "lucide-react"],
    registryDependencies: [],
    files: [
      {
        path: "animated/unboxing-bucket.tsx",
        type: "registry:component",
        target: "components/unboxing-bucket.tsx",
      },
    ],
  },
  // 7. Separator
  {
    name: "separator",
    title: "Separator",
    description:
      "Visually or semantically separates content in a page, supporting both horizontal and vertical orientations.",
    type: "registry:ui",
    category: "primitives",
    schematicType: "separator",
    dependencies: ["@radix-ui/react-separator"],
    registryDependencies: [],
    files: [
      {
        path: "ui/separator.tsx",
        type: "registry:ui",
        target: "components/ui/separator.tsx",
      },
    ],
  },
  // 8. Code Block
  {
    name: "code-block",
    title: "Code Block",
    description:
      "Syntax-highlighted code surface powered by Shiki with line numbers, line highlighting, collapsible blocks, diff mode, and copy actions.",
    type: "registry:ui",
    category: "primitives",
    schematicType: "code-block",
    badge: "Shiki",
    dependencies: ["shiki", "lucide-react"],
    registryDependencies: ["button"],
    files: [
      {
        path: "ui/code-block/code-block.tsx",
        type: "registry:ui",
        target: "components/ui/code-block/code-block.tsx",
      },
      {
        path: "ui/code-block/code-block-highlight.tsx",
        type: "registry:ui",
        target: "components/ui/code-block/code-block-highlight.tsx",
      },
      {
        path: "ui/code-block/index.ts",
        type: "registry:ui",
        target: "components/ui/code-block/index.ts",
      },
    ],
  },
]
