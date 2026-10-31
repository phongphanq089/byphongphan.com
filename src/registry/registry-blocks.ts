import type { RegistryItem } from "./schema"
import {
  ArtcraftScroll01Schematic,
  KoiBackgroundSchematic,
  Login01Schematic,
  NotFound01Schematic,
  NotFound02Schematic,
  NotFound03Schematic,
  StatsCards01Schematic,
} from "./schematics"

export const REGISTRY_BLOCKS: RegistryItem[] = [
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
  {
    name: "artcraft-scroll-01",
    title: "Artcraft Scroll 01",
    description:
      "Interactive 5-stage kinetic rail scroll scrubber landing page with synchronized skeleton sections, physics inspector, and overview zoom lens.",
    type: "registry:block",
    category: "marketing",
    schematic: ArtcraftScroll01Schematic,
    schematicType: "artcraft-scroll-01",
    isNew: true,
    dependencies: ["motion", "lucide-react"],
    registryDependencies: ["button", "skeleton"],
    files: [
      {
        path: "block/artcraft-scroll-01/page.tsx",
        type: "registry:block",
        target: "app/marketing/artcraft-scroll/page.tsx",
      },
      {
        path: "animated/rail-scroll-scrubber.tsx",
        type: "registry:component",
        target: "components/rail-scroll-scrubber.tsx",
      },
    ],
  },
]
