import type { ShowcaseComponentItem } from "./types"

/**
 * 16-Component Repeating Bento Grid Matrix (5 Columns × 14 Rows = 70 Cell Units on 2xl)
 *
 * Responsive layout rules:
 * - Below md (< 768px): 1 column (grid-cols-1)
 * - md (768px - 1023px): 2 columns (md:grid-cols-2), with full-width banners for Spotlight Text, Card, Text Hover Effect
 * - lg to xl (1024px - 1535px): 4 columns (lg:grid-cols-4)
 * - 2xl and above (>= 1536px): 5-column repeating bento grid matrix (2xl:grid-cols-5)
 *
 * ─── HERO BANNER: ROWS 1–2 (5 units on 2xl) ───
 * - [01] Spotlight Text:   2xl:col-span-5 2xl:row-span-2 2xl:col-start-1 2xl:row-start-1 (5x2 full-width)
 *
 * ─── BLOCK 1: ROWS 3–7 (25 units on 2xl) ───
 * - [02] Slide to Unlock:  2xl:col-span-2 2xl:row-span-2 2xl:col-start-1 2xl:row-start-3 (2x2)
 * - [03] Line Nav:         2xl:col-span-1 2xl:row-span-3 2xl:col-start-3 2xl:row-start-3 (1x3 vertical)
 * - [04] Spotlight Card:   2xl:col-span-2 2xl:row-span-3 2xl:col-start-1 2xl:row-start-[5] (2x3 hero)
 * - [05] Border Glow:      2xl:col-span-2 2xl:row-span-2 2xl:col-start-4 2xl:row-start-3 (2x2)
 * - [06] Terminal Engine:  2xl:col-span-1 2xl:row-span-2 2xl:col-start-3 2xl:row-start-[6] (1x2 compact)
 * - [07] Card:             2xl:col-span-2 2xl:row-span-3 2xl:col-start-4 2xl:row-start-[5] (2x3 hero)
 *
 * ─── BLOCK 2: ROWS 8–12 (25 units on 2xl) ───
 * - [08] Time Scrubber:    2xl:col-span-2 2xl:row-span-2 2xl:col-start-1 2xl:row-start-[8] (2x2)
 * - [09] Corner Button:    2xl:col-span-1 2xl:row-span-3 2xl:col-start-3 2xl:row-start-[8] (1x3 vertical)
 * - [10] Elastic Slider:   2xl:col-span-2 2xl:row-span-3 2xl:col-start-1 2xl:row-start-[10] (2x3 hero)
 * - [11] Middle Truncation:2xl:col-span-2 2xl:row-span-2 2xl:col-start-4 2xl:row-start-[8] (2x2)
 * - [12] Swoosh Text:      2xl:col-span-2 2xl:row-span-3 2xl:col-start-4 2xl:row-start-[10] (2x3 hero)
 * - [13] Cradle Text:      2xl:col-span-1 2xl:row-span-2 2xl:col-start-3 2xl:row-start-[11] (1x2 compact)
 *
 * ─── BLOCK 3: ROWS 13–14 (10 units on 2xl) — FULL-WIDTH 5-COLUMN BALANCED FINALE ───
 * - [14] Letter 3D Swap:   2xl:col-span-2 2xl:row-span-2 2xl:col-start-1 2xl:row-start-[13] (2x2)
 * - [15] Plucked Text:     2xl:col-span-1 2xl:row-span-2 2xl:col-start-3 2xl:row-start-[13] (1x2)
 * - [16] Text Hover Effect:2xl:col-span-2 2xl:row-span-2 2xl:col-start-4 2xl:row-start-[13] (2x2)
 */
export const SHOWCASE_ITEMS: ShowcaseComponentItem[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ─── HERO BANNER: HÀNG 1 ĐẾN 2 ────────────────────────────────────
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: "spotlight-text",
    index: "01",
    title: "Spotlight Text",
    description:
      "Giant cropped typography with procedural canvas grain, radial pointer spotlight, and figure-8 drift.",
    category: "text",
    gridPlacementClass:
      "md:col-span-2 lg:col-span-4 2xl:col-span-5 2xl:row-span-2 2xl:col-start-1 2xl:row-start-1 min-h-[240px]",
    tag: "CANVAS_GRAIN",
    specsLabel: "MASK • SPOTLIGHT_DRIFT",
    isNew: true,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ─── BLOCK 1: HÀNG 3 ĐẾN 7 (6 COMPONENTS) ────────────────────────
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: "slide-to-unlock",
    index: "02",
    title: "Slide to Unlock",
    description:
      "Tactile iOS sliding confirmation trigger with spring resistance.",
    category: "button",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-2 2xl:row-span-2 2xl:col-start-1 2xl:row-start-3 min-h-[220px]",
    tag: "TOUCH_API",
    specsLabel: "INTERACTION • SLIDE_CONFIRM",
    isNew: true,
  },
  {
    slug: "line-nav",
    index: "03",
    title: "Line Nav",
    description: "Gaussian proximity ladder navigation with dynamic wave flex.",
    category: "navigation",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-1 2xl:row-span-3 2xl:col-start-3 2xl:row-start-3 min-h-[280px]",
    tag: "PROXIMITY_WAVE",
    specsLabel: "LADDER • PROXIMITY_WAVE",
    isNew: true,
  },
  {
    slug: "spotlight-card",
    index: "04",
    title: "Spotlight Card",
    description:
      "Dynamic cursor-following radial raycaster with physics falloff.",
    category: "card",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-2 2xl:row-span-3 2xl:col-start-1 2xl:row-start-[5] min-h-[280px]",
    tag: "HERO_RAYCASTER",
    specsLabel: "SURFACE • RAYCASTER_60FPS",
    isNew: true,
  },
  {
    slug: "border-glow",
    index: "05",
    title: "Border Glow",
    description:
      "Distance-aware magnetic neon border beam tracking pointer coordinates.",
    category: "card",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-2 2xl:row-span-2 2xl:col-start-4 2xl:row-start-3 min-h-[220px]",
    tag: "MAGNETIC",
    specsLabel: "PERIMETER • PROXIMITY_BEAM",
    isUpdated: true,
  },
  {
    slug: "typing-text",
    index: "06",
    title: "Terminal Engine",
    description:
      "Organic typewriter engine with human variance and syntax scripts.",
    category: "text",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-1 2xl:row-span-2 2xl:col-start-3 2xl:row-start-[6] min-h-[200px]",
    tag: "TYPEWRITER",
    specsLabel: "TYPOGRAPHY • TERMINAL_CLI",
    isNew: true,
  },
  {
    slug: "card",
    index: "07",
    title: "Card",
    description:
      "Profile card showcasing author avatar, verified badge, and fade overlay.",
    category: "card",
    gridPlacementClass:
      "md:col-span-2 lg:col-span-2 2xl:col-span-2 2xl:row-span-3 2xl:col-start-4 2xl:row-start-[5] min-h-[300px]",
    tag: "SURFACE",
    specsLabel: "CARD • PROFILE_OVERLAY",
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ─── BLOCK 2: HÀNG 8 ĐẾN 12 (6 COMPONENTS) ───────────────────────
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: "time-scrubber",
    index: "08",
    title: "Time Scrubber",
    description:
      "Precision timeline dial with inertia glide and tick snapping.",
    category: "interactive",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-2 2xl:row-span-2 2xl:col-start-1 2xl:row-start-[8] min-h-[220px]",
    tag: "WHEEL_DIAL",
    specsLabel: "RULER • MOMENTUM_SNAP",
  },
  {
    slug: "corner-button",
    index: "09",
    title: "Corner Button",
    description: "Cyberpunk tactile button with angular neon corner accents.",
    category: "button",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-1 2xl:row-span-3 2xl:col-start-3 2xl:row-start-[8] min-h-[260px]",
    tag: "CYBERPUNK",
    specsLabel: "TRIGGER • CORNER_ACTION",
    isNew: true,
  },
  {
    slug: "elastic-slider",
    index: "10",
    title: "Elastic Slider",
    description:
      "Tactile range slider with rubber-band physics and spring rebound.",
    category: "interactive",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-2 2xl:row-span-3 2xl:col-start-1 2xl:row-start-[10] min-h-[260px]",
    tag: "SPRING_INPUT",
    specsLabel: "INPUT • ELASTIC_KINEMATICS",
    isNew: true,
  },
  {
    slug: "middle-truncation",
    index: "11",
    title: "Middle Truncation",
    description:
      "Sub-pixel canvas measurement middle-text truncation with copy action.",
    category: "text",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-2 2xl:row-span-2 2xl:col-start-4 2xl:row-start-[8] min-h-[220px]",
    tag: "CANVAS_TEXT",
    specsLabel: "CANVAS • SUBPIXEL_TRUNCATE",
  },
  {
    slug: "swoosh-text",
    index: "12",
    title: "Swoosh Text",
    description: "Mechanical keycap typography with pointer-sink press waves.",
    category: "text",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-2 2xl:row-span-3 2xl:col-start-4 2xl:row-start-[10] min-h-[260px]",
    tag: "KEYCAP_WAVE",
    specsLabel: "EXTRUSION • KEYCAP_WAVE",
  },
  {
    slug: "cradle-text",
    index: "13",
    title: "Cradle Text",
    description:
      "Newton kinetic collision text simulation with momentum knock.",
    category: "text",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-1 2xl:row-span-2 2xl:col-start-3 2xl:row-start-[11] min-h-[200px]",
    tag: "NEWTON",
    specsLabel: "PHYSICS • KNOCK_TRANSFER",
    isNew: true,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ─── BLOCK 3: HÀNG 13 ĐẾN 14 (KẾT THÚC CÂN ĐỐI 5 CỘT) ────────────
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    slug: "letter-3d-swap",
    index: "14",
    title: "Letter 3D Swap",
    description:
      "Staggered 3D character rotation with spring damping and dual faces.",
    category: "text",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-2 2xl:row-span-2 2xl:col-start-1 2xl:row-start-[13] min-h-[220px]",
    tag: "3D_ROTATION",
    specsLabel: "MOTION • 3D_ROTATION",
    isNew: true,
  },
  {
    slug: "plucked-text",
    index: "15",
    title: "Plucked Text",
    description:
      "Acoustic guitar string physics simulation with standing harmonics.",
    category: "text",
    gridPlacementClass:
      "lg:col-span-2 2xl:col-span-1 2xl:row-span-2 2xl:col-start-3 2xl:row-start-[13] min-h-[200px]",
    tag: "HARMONICS",
    specsLabel: "PHYSICS • HARMONIC_STRUM",
    isNew: true,
  },
  {
    slug: "text-hover-effect",
    index: "16",
    title: "Text Hover Effect",
    description:
      "Radial gradient reveal typographic effect with dynamic SVG masking.",
    category: "text",
    gridPlacementClass:
      "md:col-span-2 lg:col-span-4 2xl:col-span-2 2xl:row-span-2 2xl:col-start-4 2xl:row-start-[13] min-h-[220px]",
    tag: "SVG_MASK",
    specsLabel: "MASK • GRADIENT_REVEAL",
  },
]
