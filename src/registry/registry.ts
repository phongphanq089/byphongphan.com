import type { RegistryItem } from "./schema"
import {
  CardSchematic,
  CodeBlockSchematic,
  FlipClockSchematic,
  SelectSchematic,
  UnboxingBucketSchematic,
} from "./schematics"

export const REGISTRY_ITEMS: RegistryItem[] = [
  {
    name: "select",
    title: "Select",
    description:
      "Displays a list of options for the user to pick from—triggered by a button.",
    type: "registry:ui",
    category: "primitives",
    schematic: SelectSchematic,
    schematicType: "select",
    isNew: true,
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
  {
    name: "card",
    title: "Card",
    description: "Displays a card with header, content, and footer.",
    type: "registry:ui",
    category: "primitives",
    schematic: CardSchematic,
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
  {
    name: "unboxing-bucket",
    title: "Unboxing Bucket",
    description:
      "Interactive 3D unboxing container animation with emerging spring-physics feature chips.",
    type: "registry:component",
    category: "animations",
    schematic: UnboxingBucketSchematic,
    schematicType: "unboxing-bucket",
    dependencies: ["motion", "lucide-react"],
    registryDependencies: ["use-media-query"],
    files: [
      {
        path: "animated/unboxing-bucket.tsx",
        type: "registry:component",
        target: "components/unboxing-bucket.tsx",
      },
    ],
  },
  {
    name: "flip-clock",
    title: "Flip Clock",
    description:
      "Mechanical 2D split-flap counter and clock with real-time, timer, stopwatch, and date-time display modes.",
    type: "registry:component",
    category: "animations",
    schematic: FlipClockSchematic,
    schematicType: "flip-clock",
    isNew: true,
    dependencies: ["motion", "@rexa-developer/tiks"],
    registryDependencies: [],
    files: [
      {
        path: "animated/flip-clock.tsx",
        type: "registry:component",
        target: "components/flip-clock.tsx",
      },
    ],
  },
  {
    name: "use-media-query",
    title: "useMediaQuery",
    description:
      "React hook for responsive design and media query listening with SSR support.",
    type: "registry:hook",
    category: "foundations",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "hooks/use-media-query.ts",
        type: "registry:hook",
        target: "hooks/use-media-query.ts",
      },
    ],
  },
  {
    name: "code-block",
    title: "Code Block",
    description:
      "Syntax-highlighted code surface powered by Shiki with line numbers, line highlighting, collapsible blocks, diff mode, and copy actions.",
    type: "registry:ui",
    category: "primitives",
    schematic: CodeBlockSchematic,
    schematicType: "code-block",
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
