import type { ShowcaseComponentItem } from "./types"

/**
 * 15-Component Repeating Bento Grid Matrix (5 Columns × 12 Rows = 60 Cell Units on 2xl)
 *
 * Responsive layout rules:
 * - Below md (< 768px): 1 column (grid-cols-1)
 * - From md to below 2xl (768px - 1535px): 2 columns (md:grid-cols-2), with item 15 as full-width banner
 * - 2xl and above (>= 1536px): 5-column repeating bento grid matrix (2xl:grid-cols-5)
 *
 * ─── BLOCK 1: ROWS 1–5 (25 units on 2xl) ───
 * - [01] Slide to Unlock:  2xl:col-span-2 2xl:row-span-2 2xl:col-start-1 2xl:row-start-1 (2x2)
 * - [02] Line Nav:         2xl:col-span-1 2xl:row-span-3 2xl:col-start-3 2xl:row-start-1 (1x3 vertical)
 * - [03] Spotlight Card:   2xl:col-span-2 2xl:row-span-3 2xl:col-start-1 2xl:row-start-3 (2x3 hero)
 * - [04] Border Glow:      2xl:col-span-2 2xl:row-span-2 2xl:col-start-4 2xl:row-start-1 (2x2)
 * - [05] Terminal Engine:  2xl:col-span-2 2xl:row-span-3 2xl:col-start-4 2xl:row-start-3 (2x3 hero)
 * - [06] Corner Button:    2xl:col-span-1 2xl:row-span-2 2xl:col-start-3 2xl:row-start-4 (1x2 compact)
 *
 * ─── BLOCK 2: ROWS 6–10 (25 units on 2xl) — REPEATING PATTERN ───
 * - [07] Time Scrubber:    2xl:col-span-2 2xl:row-span-2 2xl:col-start-1 2xl:row-start-[6] (2x2)
 * - [08] Scroll Indicator: 2xl:col-span-1 2xl:row-span-3 2xl:col-start-3 2xl:row-start-[6] (1x3 vertical)
 * - [09] Elastic Slider:   2xl:col-span-2 2xl:row-span-3 2xl:col-start-1 2xl:row-start-[8] (2x3 hero)
 * - [10] Middle Truncation:2xl:col-span-2 2xl:row-span-2 2xl:col-start-4 2xl:row-start-[6] (2x2)
 * - [11] Swoosh Text:      2xl:col-span-2 2xl:row-span-3 2xl:col-start-4 2xl:row-start-[8] (2x3 hero)
 * - [12] Cradle Text:      2xl:col-span-1 2xl:row-span-2 2xl:col-start-3 2xl:row-start-[9] (1x2 compact)
 *
 * ─── BLOCK 3: ROWS 11–12 (10 units on 2xl) — FULL-WIDTH 5-COLUMN BALANCED FINALE ───
 * - [13] Letter 3D Swap:   2xl:col-span-2 2xl:row-span-2 2xl:col-start-1 2xl:row-start-[11] (2x2)
 * - [14] Plucked Text:     2xl:col-span-1 2xl:row-span-2 2xl:col-start-3 2xl:row-start-[11] (1x2)
 * - [15] Text Hover Effect:2xl:col-span-2 2xl:row-span-2 2xl:col-start-4 2xl:row-start-[11] (2x2)
 */
export const SHOWCASE_ITEMS: ShowcaseComponentItem[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ─── BLOCK 1: HÀNG 1 ĐẾN 5 (6 COMPONENTS) ────────────────────────
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: "slide-to-unlock",
    index: "01",
    title: "Slide to Unlock",
    description:
      "Tactile iOS sliding confirmation trigger with spring resistance.",
    category: "button",
    gridPlacementClass:
      "2xl:col-span-2 2xl:row-span-2 2xl:col-start-1 2xl:row-start-1 min-h-[220px]",
    tag: "TOUCH_API",
    specsLabel: "INTERACTION • SLIDE_CONFIRM",
    isNew: true,
  },
  {
    slug: "line-nav",
    index: "02",
    title: "Line Nav",
    description: "Gaussian proximity ladder navigation with dynamic wave flex.",
    category: "navigation",
    gridPlacementClass:
      "2xl:col-span-1 2xl:row-span-3 2xl:col-start-3 2xl:row-start-1 min-h-[300px]",
    tag: "PROXIMITY_WAVE",
    specsLabel: "LADDER • PROXIMITY_WAVE",
    isNew: true,
  },
  {
    slug: "spotlight-card",
    index: "03",
    title: "Spotlight Card",
    description:
      "Dynamic cursor-following radial raycaster with physics falloff.",
    category: "card",
    gridPlacementClass:
      "2xl:col-span-2 2xl:row-span-3 2xl:col-start-1 2xl:row-start-3 min-h-[280px]",
    tag: "HERO_RAYCASTER",
    specsLabel: "SURFACE • RAYCASTER_60FPS",
    isNew: true,
  },
  {
    slug: "border-glow",
    index: "04",
    title: "Border Glow",
    description:
      "Distance-aware magnetic neon border beam tracking pointer coordinates.",
    category: "card",
    gridPlacementClass:
      "2xl:col-span-2 2xl:row-span-2 2xl:col-start-4 2xl:row-start-1 min-h-[220px]",
    tag: "MAGNETIC",
    specsLabel: "PERIMETER • PROXIMITY_BEAM",
    isUpdated: true,
  },
  {
    slug: "typing-text",
    index: "05",
    title: "Terminal Engine",
    description:
      "Organic typewriter engine with human variance and syntax scripts.",
    category: "text",
    gridPlacementClass:
      "2xl:col-span-1 2xl:row-span-2 2xl:col-start-3 2xl:row-start-4 min-h-[180px]",
    tag: "TYPEWRITER",
    specsLabel: "TYPOGRAPHY • TERMINAL_CLI",
    isNew: true,
  },
  {
    slug: "corner-button",
    index: "06",
    title: "Corner Button",
    description: "Cyberpunk tactile button with angular neon corner accents.",
    category: "button",
    gridPlacementClass:
      " 2xl:col-span-2 2xl:row-span-3 2xl:col-start-4 2xl:row-start-3 min-h-[280px]",
    tag: "CYBERPUNK",
    specsLabel: "TRIGGER • CORNER_ACTION",
    isNew: true,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ─── BLOCK 2: HÀNG 6 ĐẾN 10 (LẶP LẠI PATTERN GRID) ───────────────
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: "time-scrubber",
    index: "07",
    title: "Time Scrubber",
    description:
      "Precision timeline dial with inertia glide and tick snapping.",
    category: "interactive",
    gridPlacementClass:
      "2xl:col-span-2 2xl:row-span-2 2xl:col-start-1 2xl:row-start-[6] min-h-[220px]",
    tag: "WHEEL_DIAL",
    specsLabel: "RULER • MOMENTUM_SNAP",
  },
  {
    slug: "card",
    index: "08",
    title: "Scroll Indicator",
    description: "Vertical section progress caliper with audible tick snaps.",
    category: "card",
    gridPlacementClass:
      "2xl:col-span-1 2xl:row-span-3 2xl:col-start-3 2xl:row-start-[6] min-h-[300px]",
    tag: "CALIPER",
    specsLabel: "NAV • PROGRESS_TICKS",
  },
  {
    slug: "elastic-slider",
    index: "09",
    title: "Elastic Slider",
    description:
      "Tactile range slider with rubber-band physics and spring rebound.",
    category: "interactive",
    gridPlacementClass:
      "2xl:col-span-2 2xl:row-span-3 2xl:col-start-1 2xl:row-start-[8] min-h-[280px]",
    tag: "SPRING_INPUT",
    specsLabel: "INPUT • ELASTIC_KINEMATICS",
    isNew: true,
  },
  {
    slug: "middle-truncation",
    index: "10",
    title: "Middle Truncation",
    description:
      "Sub-pixel canvas measurement middle-text truncation with copy action.",
    category: "text",
    gridPlacementClass:
      "2xl:col-span-2 2xl:row-span-2 2xl:col-start-4 2xl:row-start-[6] min-h-[220px]",
    tag: "CANVAS_TEXT",
    specsLabel: "CANVAS • SUBPIXEL_TRUNCATE",
  },
  {
    slug: "swoosh-text",
    index: "11",
    title: "Swoosh Text",
    description: "Mechanical keycap typography with pointer-sink press waves.",
    category: "text",
    gridPlacementClass:
      "2xl:col-span-2 2xl:row-span-3 2xl:col-start-4 2xl:row-start-[8] min-h-[280px]",
    tag: "KEYCAP_WAVE",
    specsLabel: "EXTRUSION • KEYCAP_WAVE",
  },
  {
    slug: "cradle-text",
    index: "12",
    title: "Cradle Text",
    description:
      "Newton kinetic collision text simulation with momentum knock.",
    category: "text",
    gridPlacementClass:
      "2xl:col-span-1 2xl:row-span-2 2xl:col-start-3 2xl:row-start-[9] min-h-[180px]",
    tag: "NEWTON",
    specsLabel: "PHYSICS • KNOCK_TRANSFER",
    isNew: true,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ─── BLOCK 3: HÀNG 11 ĐẾN 12 (KẾT THÚC CÂN ĐỐI 5 CỘT) ────────────
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: "letter-3d-swap",
    index: "13",
    title: "Letter 3D Swap",
    description:
      "Staggered 3D character rotation with spring damping and dual faces.",
    category: "text",
    gridPlacementClass:
      "2xl:col-span-2 2xl:row-span-2 2xl:col-start-1 2xl:row-start-[11] min-h-[220px]",
    tag: "3D_ROTATION",
    specsLabel: "MOTION • 3D_ROTATION",
    isNew: true,
  },
  {
    slug: "plucked-text",
    index: "14",
    title: "Plucked Text",
    description:
      "Acoustic guitar string physics simulation with standing harmonics.",
    category: "text",
    gridPlacementClass:
      "2xl:col-span-1 2xl:row-span-2 2xl:col-start-3 2xl:row-start-[11] min-h-[180px]",
    tag: "HARMONICS",
    specsLabel: "PHYSICS • HARMONIC_STRUM",
    isNew: true,
  },
  {
    slug: "text-hover-effect",
    index: "15",
    title: "Text Hover Effect",
    description:
      "Radial gradient reveal typographic effect with dynamic SVG masking.",
    category: "text",
    gridPlacementClass:
      "md:col-span-2 2xl:col-span-2 2xl:row-span-2 2xl:col-start-4 2xl:row-start-[11] min-h-[220px]",
    tag: "SVG_MASK",
    specsLabel: "MASK • GRADIENT_REVEAL",
  },
]
