import type { RegistryItem } from "./schema"
import {
  BackgroundGradientCursorSchematic,
  BorderGlowSchematic,
  CardSchematic,
  CodeBlockSchematic,
  DrawerSchematic,
  FlipClockSchematic,
  KoiBackgroundSchematic,
  LineNavSchematic,
  Login01Schematic,
  MapSchematic,
  MiddleTruncationSchematic,
  NotFound01Schematic,
  NotFound02Schematic,
  NotFound03Schematic,
  PhongPhanIsometricSchematic,
  PPMarkIsometricSchematic,
  ScrollAreaSchematic,
  SpotlightCardSchematic,
  StatsCards01Schematic,
  TextHoverEffectSchematic,
  UnboxingBucketSchematic,
} from "./schematics"

export const REGISTRY_ITEMS: RegistryItem[] = [
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
    name: "flip-clock",
    title: "Flip Clock",
    description:
      "Mechanical 2D split-flap counter and clock with real-time, timer, stopwatch, and date-time display modes.",
    type: "registry:component",
    category: "interactive",
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
    category: "interactive",
    dependencies: [],
    registryDependencies: [],
    isNew: true,
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
  {
    name: "not-found-01",
    title: "Not Found 01",
    description: "A 404 page with a playable brick breaker game.",
    type: "registry:block",
    category: "404-page",
    schematic: NotFound01Schematic,
    schematicType: "not-found-01",
    isNew: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["button"],
    files: [
      {
        path: "block/not-found-01/app/not-found.tsx",
        type: "registry:block",
        target: "app/not-found.tsx",
      },
      {
        path: "block/not-found-01/components/daikanoid/index.tsx",
        type: "registry:block",
        target: "components/daikanoid/index.tsx",
      },
      {
        path: "block/not-found-01/components/daikanoid/component.tsx",
        type: "registry:block",
        target: "components/daikanoid/component.tsx",
      },
      {
        path: "block/not-found-01/components/daikanoid/ball.ts",
        type: "registry:block",
        target: "components/daikanoid/ball.ts",
      },
      {
        path: "block/not-found-01/components/daikanoid/brick.ts",
        type: "registry:block",
        target: "components/daikanoid/brick.ts",
      },
      {
        path: "block/not-found-01/components/daikanoid/paddle.ts",
        type: "registry:block",
        target: "components/daikanoid/paddle.ts",
      },
      {
        path: "block/not-found-01/components/daikanoid/constants.ts",
        type: "registry:block",
        target: "components/daikanoid/constants.ts",
      },
      {
        path: "block/not-found-01/components/daikanoid/colors.ts",
        type: "registry:block",
        target: "components/daikanoid/colors.ts",
      },
      {
        path: "block/not-found-01/components/daikanoid/types.ts",
        type: "registry:block",
        target: "components/daikanoid/types.ts",
      },
    ],
  },
  {
    name: "not-found-02",
    title: "Not Found Gravity",
    description:
      "Interactive 404 error page with 2D physics gravity, falling blocks, and draggable elements.",
    type: "registry:block",
    category: "404-page",
    schematic: NotFound02Schematic,
    schematicType: "not-found-02",
    isNew: true,
    dependencies: [
      "matter-js",
      "poly-decomp",
      "svg-path-commander",
      "lucide-react",
    ],
    registryDependencies: ["button"],
    files: [
      {
        path: "block/not-found-02/app/not-found.tsx",
        type: "registry:block",
        target: "app/not-found.tsx",
      },
      {
        path: "block/not-found-02/components/gravity.tsx",
        type: "registry:block",
        target: "components/gravity.tsx",
      },
    ],
  },
  {
    name: "not-found-03",
    title: "Not Found Pixel Trail",
    description:
      "Interactive 404 digital void experience featuring dynamic cursor pixel trails and terminal status diagnostics.",
    type: "registry:block",
    category: "404-page",
    schematic: NotFound03Schematic,
    schematicType: "not-found-03",
    isNew: true,
    dependencies: ["motion", "lucide-react"],
    registryDependencies: ["button"],
    files: [
      {
        path: "block/not-found-03/app/not-found.tsx",
        type: "registry:block",
        target: "app/not-found.tsx",
      },
      {
        path: "block/not-found-03/components/pixel-trail.tsx",
        type: "registry:block",
        target: "components/pixel-trail.tsx",
      },
    ],
  },
  {
    name: "login-01",
    title: "Login 01",
    description:
      "Split-screen modern authentication screen with photography hero, tracked typography, and full dark mode support.",
    type: "registry:block",
    category: "auth",
    schematic: Login01Schematic,
    schematicType: "login-01",
    isNew: true,
    dependencies: ["lucide-react"],
    registryDependencies: ["button", "input", "label"],
    files: [
      {
        path: "block/login-01/page.tsx",
        type: "registry:block",
        target: "app/login/page.tsx",
      },
      {
        path: "block/login-01/components/login-form.tsx",
        type: "registry:block",
        target: "components/login-form.tsx",
      },
    ],
  },
  {
    name: "stats-cards-01",
    title: "Stats Cards 01",
    description:
      "Overlapping interactive marketing stats cards with spring physics hover, metrics showcase, and dark mode support.",
    type: "registry:block",
    category: "marketing",
    schematic: StatsCards01Schematic,
    schematicType: "stats-cards-01",
    isNew: true,
    dependencies: ["motion"],
    registryDependencies: [],
    files: [
      {
        path: "block/stats-cards-01/page.tsx",
        type: "registry:block",
        target: "app/marketing/stats-cards/page.tsx",
      },
      {
        path: "block/stats-cards-01/components/stats-cards.tsx",
        type: "registry:block",
        target: "components/stats-cards.tsx",
      },
    ],
  },
  {
    name: "koi-background",
    title: "Koi Background",
    description:
      "Interactive ambient koi pond background surface featuring fluid dynamics, water caustics, multi-joint fish flocking, and mouse-feeding mechanics.",
    type: "registry:block",
    category: "marketing",
    schematic: KoiBackgroundSchematic,
    schematicType: "koi-background",
    isNew: true,
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "block/koi-background/page.tsx",
        type: "registry:block",
        target: "app/marketing/koi-background/page.tsx",
      },
      {
        path: "block/koi-background/components/koi-pond.tsx",
        type: "registry:block",
        target: "components/koi-pond.tsx",
      },
      {
        path: "block/koi-background/components/renderer.ts",
        type: "registry:block",
        target: "components/renderer.ts",
      },
      {
        path: "block/koi-background/components/shape.ts",
        type: "registry:block",
        target: "components/shape.ts",
      },
      {
        path: "block/koi-background/components/world.ts",
        type: "registry:block",
        target: "components/world.ts",
      },
    ],
  },
]
