import { COMPONENT_FILTER_TABS } from "@/shared/config"

import type { ComponentItem } from "./types"

export const COMPONENT_CATEGORIES = COMPONENT_FILTER_TABS

export const COMPONENTS_DATA: ComponentItem[] = [
  {
    id: "comp-line-nav",
    name: "Line Nav",
    slug: "line-nav",
    category: "navigation",
    description:
      "Minimalist animated line navigation with spring-physics indicators, scroll-spy integration, and orientation variants.",
    schematicType: "line-nav",
    isNew: true,
  },
  {
    id: "comp-middle-truncation",
    name: "Middle Truncation",
    slug: "middle-truncation",
    category: "text",
    description:
      "Canvas-measured binary search text truncation preserving the start and end of strings with responsive resize sync.",
    schematicType: "middle-truncation",
    isNew: true,
  },
  {
    id: "comp-card",
    name: "Card",
    slug: "card",
    category: "card",
    description: "Displays a card with header, content, and footer.",
    schematicType: "card",
    isNew: true,
  },
  {
    id: "comp-scroll-area",
    name: "Scroll Area",
    slug: "scroll-area",
    category: "data-display",
    description:
      "Cross-browser scroll area with auto, hover, and always visibility modes, custom variants, scrollbar gutter reserve, keyboard navigation, and high-contrast styling.",
    schematicType: "scroll-area",
    isNew: true,
  },
  {
    id: "comp-drawer",
    name: "Drawer",
    slug: "drawer",
    category: "interactive",
    description:
      "An interactive drawer and bottom sheet powered by Base UI with swipe gestures, snap points, nested stacks, and multi-directional slide-ins.",
    schematicType: "drawer",
    isNew: true,
  },
  {
    id: "comp-unboxing-bucket",
    name: "Unboxing Bucket",
    slug: "unboxing-bucket",
    category: "interactive",
    description:
      "Interactive 3D unboxing container animation with emerging spring-physics feature chips.",
    schematicType: "unboxing-bucket",
    isNew: true,
  },
  {
    id: "comp-flip-clock",
    name: "Flip Clock",
    slug: "flip-clock",
    category: "interactive",
    description:
      "Mechanical 2D split-flap counter and clock with real-time, timer, stopwatch, and date-time display modes.",
    schematicType: "flip-clock",
    isNew: true,
  },
  {
    id: "comp-code-block",
    name: "Code Block",
    slug: "code-block",
    category: "data-display",
    description:
      "Syntax-highlighted code surface powered by Shiki with line numbers, line highlighting, collapsible blocks, diff mode, and copy actions.",
    schematicType: "code-block",
    isNew: true,
  },
  {
    id: "comp-map",
    name: "Map",
    slug: "map",
    category: "data-display",
    description:
      "High-performance interactive vector map powered by MapLibre GL with dark/light themes, custom markers, popups, controls, routes, arcs, GeoJSON, and clustering.",
    schematicType: "map",
    isNew: true,
  },
  {
    id: "comp-text-hover-effect",
    name: "Text Hover Effect",
    slug: "text-hover-effect",
    category: "text",
    description:
      "Interactive typographic SVG reveal effect that traces strokes on mount and reveals a vibrant radial gradient mask following cursor movement.",
    schematicType: "text-hover-effect",
    isNew: true,
  },
  {
    id: "comp-background-gradient-cursor",
    name: "Background Gradient Cursor",
    slug: "background-gradient-cursor",
    category: "background",
    description:
      "Interactive ambient canvas surface featuring cursor-tracking radial mask, procedural dots, dynamic grid lines, and directional linear gradients.",
    schematicType: "background-gradient-cursor",
    isNew: true,
  },
  {
    id: "comp-pp-mark-isometric",
    name: "Isometric Monogram Mark",
    slug: "pp-mark-isometric",
    category: "interactive",
    description:
      "Interactive 3D voxel isometric monogram mark featuring procedural diagonal hatching, wireframe edges, cursor-tracking radial flashlight, and spring press physics with audio feedback.",
    schematicType: "pp-mark-isometric",
    isNew: true,
  },
  {
    id: "comp-phong-phan-isometric",
    name: "Isometric Block Typography",
    slug: "phong-phan-isometric",
    category: "text",
    description:
      "Horizontal 3D block typography extruded along an isometric blueprint grid, equipped with interactive dynamic lighting, sound feedback, and edge-to-edge/padded layout variants.",
    schematicType: "phong-phan-isometric",
    isNew: true,
  },
  {
    id: "comp-spotlight-card",
    name: "Spotlight Card",
    slug: "spotlight-card",
    category: "card",
    description:
      "Interactive surface with radial cursor spotlight illumination, dynamic 1px masked border glow, and smooth 3D tilt perspective.",
    schematicType: "spotlight-card",
    isNew: true,
  },
  {
    id: "comp-border-glow",
    name: "Border Glow",
    slug: "border-glow",
    category: "card",
    description:
      "Interactive surface with cursor-tracking mesh gradient edge illumination, outer atmospheric aura, and entry sweep animation.",
    schematicType: "border-glow",
    isNew: true,
  },
]
