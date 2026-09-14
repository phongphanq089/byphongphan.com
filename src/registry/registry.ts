import type { RegistryItem } from "./schema"

export const REGISTRY_ITEMS: RegistryItem[] = [
  // 1. Select
  {
    name: "select",
    title: "Select",
    description:
      "Displays a list of options for the user to pick from—triggered by a button.",
    type: "registry:ui",
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
]
