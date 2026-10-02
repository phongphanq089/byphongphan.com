import type { ComponentCategoryId, ComponentItem } from "./types"

export const COMPONENT_CATEGORIES: {
  id: "all" | ComponentCategoryId
  label: string
}[] = [
  { id: "all", label: "ALL" },
  { id: "primitives", label: "PRIMITIVES" },
  { id: "animations", label: "ANIMATIONS" },
  { id: "foundations", label: "FOUNDATIONS" },
]

export const COMPONENTS_DATA: ComponentItem[] = [
  {
    id: "comp-middle-truncation",
    name: "Middle Truncation",
    slug: "middle-truncation",
    category: "primitives",
    description:
      "Canvas-measured binary search text truncation preserving the start and end of strings with responsive resize sync.",
    schematicType: "middle-truncation",
    isNew: true,
  },
  {
    id: "comp-select",
    name: "Select",
    slug: "select",
    category: "primitives",
    description:
      "Displays a list of options for the user to pick from—triggered by a button.",
    schematicType: "select",
    isNew: true,
  },
  {
    id: "comp-card",
    name: "Card",
    slug: "card",
    category: "primitives",
    description: "Displays a card with header, content, and footer.",
    schematicType: "card",
    isNew: false,
  },
  {
    id: "comp-unboxing-bucket",
    name: "Unboxing Bucket",
    slug: "unboxing-bucket",
    category: "animations",
    description:
      "Interactive 3D unboxing container animation with emerging spring-physics feature chips.",
    schematicType: "unboxing-bucket",
    isNew: false,
  },
  {
    id: "comp-flip-clock",
    name: "Flip Clock",
    slug: "flip-clock",
    category: "animations",
    description:
      "Mechanical 2D split-flap counter and clock with real-time, timer, stopwatch, and date-time display modes.",
    schematicType: "flip-clock",
    isNew: true,
  },
  {
    id: "comp-code-block",
    name: "Code Block",
    slug: "code-block",
    category: "primitives",
    description:
      "Syntax-highlighted code surface powered by Shiki with line numbers, line highlighting, collapsible blocks, diff mode, and copy actions.",
    schematicType: "code-block",
    isNew: false,
  },
  {
    id: "comp-map",
    name: "Map",
    slug: "map",
    category: "primitives",
    description:
      "High-performance interactive vector map powered by MapLibre GL with dark/light themes, custom markers, popups, controls, routes, arcs, GeoJSON, and clustering.",
    schematicType: "map",
    isNew: true,
  },
  {
    id: "comp-text-hover-effect",
    name: "Text Hover Effect",
    slug: "text-hover-effect",
    category: "animations",
    description:
      "Interactive typographic SVG reveal effect that traces strokes on mount and reveals a vibrant radial gradient mask following cursor movement.",
    schematicType: "text-hover-effect",
    isNew: true,
  },
  {
    id: "comp-background-gradient-cursor",
    name: "Background Gradient Cursor",
    slug: "background-gradient-cursor",
    category: "animations",
    description:
      "Interactive ambient canvas surface featuring cursor-tracking radial mask, procedural dots, dynamic grid lines, and directional linear gradients.",
    schematicType: "background-gradient-cursor",
    isNew: true,
  },
  {
    id: "comp-pp-mark-isometric",
    name: "Isometric Monogram Mark",
    slug: "pp-mark-isometric",
    category: "animations",
    description:
      "Interactive 3D voxel isometric monogram mark featuring procedural diagonal hatching, wireframe edges, cursor-tracking radial flashlight, and spring press physics with audio feedback.",
    schematicType: "pp-mark-isometric",
    isNew: true,
  },
  {
    id: "comp-phong-phan-isometric",
    name: "Isometric Block Typography",
    slug: "phong-phan-isometric",
    category: "animations",
    description:
      "Horizontal 3D block typography extruded along an isometric blueprint grid, equipped with interactive dynamic lighting, sound feedback, and edge-to-edge/padded layout variants.",
    schematicType: "phong-phan-isometric",
    isNew: true,
  },
]
