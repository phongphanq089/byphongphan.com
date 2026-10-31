import type { RegistryItem } from "./schema"
import {
  BackgroundGradientCursorSchematic,
  BorderGlowSchematic,
  CardSchematic,
  CodeBlockSchematic,
  DrawerSchematic,
  FlipClockSchematic,
  LineNavSchematic,
  MapSchematic,
  MiddleTruncationSchematic,
  PhongPhanIsometricSchematic,
  PPMarkIsometricSchematic,
  ScrollAreaSchematic,
  SpotlightCardSchematic,
  TextHoverEffectSchematic,
  TimeScrubberSchematic,
  UnboxingBucketSchematic,
} from "./schematics"

export const REGISTRY_COMPONENTS: RegistryItem[] = [
  {
    name: "line-nav",
    title: "Line Nav",
    description:
      "Minimalist animated line navigation with spring-physics indicators, scroll-spy integration, and orientation variants.",
    type: "registry:component",
    category: "navigation",
    schematic: LineNavSchematic,
    schematicType: "line-nav",
    isNew: true,
    dependencies: ["motion"],
    registryDependencies: [],
    files: [
      {
        path: "animated/line-nav.tsx",
        type: "registry:component",
        target: "components/line-nav.tsx",
      },
    ],
  },
  {
    name: "middle-truncation",
    title: "Middle Truncation",
    description:
      "Canvas-measured binary search text truncation preserving the start and end of strings with responsive resize sync.",
    type: "registry:ui",
    category: "text",
    schematic: MiddleTruncationSchematic,
    schematicType: "middle-truncation",
    isNew: true,
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "ui/middle-truncation.tsx",
        type: "registry:ui",
        target: "components/ui/middle-truncation.tsx",
      },
    ],
  },
  {
    name: "card",
    title: "Card",
    description: "Displays a card with header, content, and footer.",
    type: "registry:ui",
    category: "card",
    schematic: CardSchematic,
    schematicType: "card",
    dependencies: [],
    isNew: true,
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
    name: "scroll-area",
    title: "Scroll Area",
    description:
      "Augments native scroll functionality with auto, hover, and always visibility modes, custom variants, scrollbar gutter reserve, keyboard navigation, and high-contrast styling.",
    type: "registry:ui",
    category: "data-display",
    schematic: ScrollAreaSchematic,
    schematicType: "scroll-area",
    isNew: true,
    dependencies: ["@base-ui/react", "class-variance-authority"],
    registryDependencies: [],
    files: [
      {
        path: "ui/scroll-area.tsx",
        type: "registry:ui",
        target: "components/ui/scroll-area.tsx",
      },
    ],
  },
  {
    name: "drawer",
    title: "Drawer",
    description:
      "An interactive overlay and bottom sheet component powered by Base UI with swipe-to-dismiss, snap points, nested stacks, customizable positions, and inset or straight variants.",
    type: "registry:ui",
    category: "interactive",
    schematic: DrawerSchematic,
    schematicType: "drawer",
    isNew: true,
    dependencies: ["@base-ui/react", "lucide-react"],
    registryDependencies: ["button", "scroll-area"],
    files: [
      {
        path: "ui/drawer.tsx",
        type: "registry:ui",
        target: "components/ui/drawer.tsx",
      },
    ],
  },
  {
    name: "unboxing-bucket",
    title: "Unboxing Bucket",
    description:
      "Interactive 3D unboxing container animation with emerging spring-physics feature chips.",
    type: "registry:component",
    category: "interactive",
    schematic: UnboxingBucketSchematic,
    schematicType: "unboxing-bucket",
    dependencies: ["motion", "lucide-react"],
    registryDependencies: ["use-media-query"],
    isNew: true,
    files: [
      {
        path: "animated/unboxing-bucket.tsx",
        type: "registry:component",
        target: "components/unboxing-bucket.tsx",
      },
    ],
  },
  {
    name: "time-scrubber",
    title: "Time Scrubber",
    description:
      "Tactile physics-based time dial with spring momentum, fling kinematics, rolling blur digits, and sub-pixel tick rendering.",
    type: "registry:component",
    category: "interactive",
    schematic: TimeScrubberSchematic,
    schematicType: "time-scrubber",
    isNew: true,
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "animated/time-scrubber.tsx",
        type: "registry:component",
        target: "components/time-scrubber.tsx",
      },
    ],
  },
  {
    name: "code-block",
    title: "Code Block",
    description:
      "Syntax-highlighted code surface powered by Shiki with line numbers, line highlighting, collapsible blocks, diff mode, and copy actions.",
    type: "registry:ui",
    category: "data-display",
    schematic: CodeBlockSchematic,
    schematicType: "code-block",
    dependencies: ["shiki", "lucide-react"],
    registryDependencies: ["button"],
    isNew: true,
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
  {
    name: "map",
    title: "Map",
    description:
      "High-performance interactive vector map powered by MapLibre GL with dark/light themes, custom markers, popups, controls, routes, arcs, GeoJSON, and clustering.",
    type: "registry:ui",
    category: "data-display",
    schematic: MapSchematic,
    schematicType: "map",
    isNew: true,
    dependencies: ["maplibre-gl", "lucide-react"],
    registryDependencies: [],
    files: [
      {
        path: "ui/map.tsx",
        type: "registry:ui",
        target: "components/ui/map.tsx",
      },
    ],
  },
  {
    name: "text-hover-effect",
    title: "Text Hover Effect",
    description:
      "Interactive typographic SVG reveal effect that traces strokes on mount and reveals a vibrant radial gradient mask following cursor movement.",
    type: "registry:component",
    category: "text",
    schematic: TextHoverEffectSchematic,
    schematicType: "text-hover-effect",
    isNew: true,
    dependencies: ["motion"],
    registryDependencies: [],
    files: [
      {
        path: "animated/text-hover-effect.tsx",
        type: "registry:component",
        target: "components/text-hover-effect.tsx",
      },
    ],
  },
  {
    name: "background-gradient-cursor",
    title: "Background Gradient Cursor",
    description:
      "Interactive ambient canvas surface featuring cursor-tracking radial mask, procedural dots, dynamic grid lines, and directional linear gradients.",
    type: "registry:component",
    category: "background",
    schematic: BackgroundGradientCursorSchematic,
    schematicType: "background-gradient-cursor",
    isNew: true,
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "animated/background-gradient-cursor.tsx",
        type: "registry:component",
        target: "components/background-gradient-cursor.tsx",
      },
    ],
  },
  {
    name: "pp-mark-isometric",
    title: "Isometric Monogram Mark",
    description:
      "Interactive 3D voxel isometric monogram mark featuring procedural diagonal hatching, wireframe edges, cursor-tracking radial flashlight, and spring press physics with audio feedback.",
    type: "registry:component",
    category: "interactive",
    schematic: PPMarkIsometricSchematic,
    schematicType: "pp-mark-isometric",
    isNew: true,
    dependencies: ["motion"],
    registryDependencies: [],
    files: [
      {
        path: "animated/pp-mark-isometric.tsx",
        type: "registry:component",
        target: "components/pp-mark-isometric.tsx",
      },
    ],
  },
  {
    name: "phong-phan-isometric",
    title: "Isometric Block Typography",
    description:
      "Horizontal 3D block typography extruded along an isometric blueprint grid, equipped with interactive dynamic lighting, sound feedback, and edge-to-edge/padded layout variants.",
    type: "registry:component",
    category: "text",
    schematic: PhongPhanIsometricSchematic,
    schematicType: "phong-phan-isometric",
    isNew: true,
    dependencies: ["motion"],
    registryDependencies: [],
    files: [
      {
        path: "animated/phong-phan-isometric.tsx",
        type: "registry:component",
        target: "components/phong-phan-isometric.tsx",
      },
    ],
  },
  {
    name: "spotlight-card",
    title: "Spotlight Card",
    description:
      "Interactive surface with radial cursor spotlight illumination, dynamic 1px masked border glow, and smooth 3D tilt perspective.",
    type: "registry:component",
    category: "card",
    schematic: SpotlightCardSchematic,
    schematicType: "spotlight-card",
    isNew: true,
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "animated/spotlight-card.tsx",
        type: "registry:component",
        target: "components/spotlight-card.tsx",
      },
    ],
  },
  {
    name: "border-glow",
    title: "Border Glow",
    description:
      "Interactive surface with cursor-tracking mesh gradient edge illumination, outer atmospheric aura, and entry sweep animation.",
    type: "registry:component",
    category: "card",
    schematic: BorderGlowSchematic,
    schematicType: "border-glow",
    isNew: true,
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "animated/border-glow.tsx",
        type: "registry:component",
        target: "components/border-glow.tsx",
      },
    ],
  },
]
