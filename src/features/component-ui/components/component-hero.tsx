import { PageHero } from "@/shared/ui/system"

import type { ComponentCategoryIdWithAll } from "../types"

interface ComponentHeroProps {
  category?: ComponentCategoryIdWithAll
  totalCount?: number
}

const CATEGORY_HERO_CONFIG: Record<
  string,
  {
    badge: string
    title: string
    description: string
    stats: { label: string; highlight?: boolean; hideOnMobile?: boolean }[]
  }
> = {
  card: {
    badge: "Card Surfaces",
    title: "Surface & spatial card containers.",
    description:
      "Interactive 3D tilt cards, radial cursor spotlight illumination, and mesh gradient glowing borders.",
    stats: [
      { label: "3D TILT & MESH GLOW" },
      { label: "BASE UI PRIMITIVES" },
      { label: "TAILWIND CSS V4", hideOnMobile: true },
    ],
  },
  background: {
    badge: "Backdrops & Canvas",
    title: "Ambient backdrops & dynamic surfaces.",
    description:
      "Interactive canvas surfaces featuring cursor-tracking radial masks, procedural dots, and ambient gradients.",
    stats: [
      { label: "AMBIENT SHADERS" },
      { label: "CANVAS MASKING" },
      { label: "60 FPS PERFORMANCE", hideOnMobile: true },
    ],
  },
  navigation: {
    badge: "Navigation",
    title: "Fluid indicators & interactive navigation.",
    description:
      "Minimalist animated line navigation with spring-physics indicators, scroll-spy integration, and orientation variants.",
    stats: [
      { label: "SPRING PHYSICS" },
      { label: "SCROLL-SPY SYNC" },
      { label: "KEYBOARD ACCESSIBLE", hideOnMobile: true },
    ],
  },
  text: {
    badge: "Typography",
    title: "Typographic craft & text utilities.",
    description:
      "Interactive SVG stroke reveal effects, canvas-measured binary search truncation, and 3D isometric typography.",
    stats: [
      { label: "CANVAS MEASURED" },
      { label: "SVG TEXT REVEAL" },
      { label: "3D ISOMETRIC", hideOnMobile: true },
    ],
  },
  interactive: {
    badge: "Micro-Interactions",
    title: "Spring physics & 3D micro-interactions.",
    description:
      "Interactive 3D unboxing containers, mechanical split-flap clocks, and voxel isometric interactive marks.",
    stats: [
      { label: "SPRING DYNAMICS" },
      { label: "AUDIO FEEDBACK" },
      { label: "3D PERSPECTIVE", hideOnMobile: true },
    ],
  },
  "data-display": {
    badge: "Data Display",
    title: "Rich data viewers, code surfaces & maps.",
    description:
      "Syntax-highlighted code blocks powered by Shiki, and high-performance vector maps powered by MapLibre GL.",
    stats: [
      { label: "SHIKI SYNTAX" },
      { label: "MAPLIBRE VECTOR" },
      { label: "HIGH PERFORMANCE", hideOnMobile: true },
    ],
  },
}

export function ComponentHero({
  category = "all",
  totalCount = 13,
}: ComponentHeroProps) {
  if (category !== "all" && CATEGORY_HERO_CONFIG[category]) {
    const config = CATEGORY_HERO_CONFIG[category]
    return (
      <PageHero
        badge={config.badge}
        count={`${totalCount} ${totalCount === 1 ? "COMPONENT" : "COMPONENTS"}`}
        title={config.title}
        description={config.description}
        stats={[
          {
            label: `${totalCount} ${category.toUpperCase()} ${totalCount === 1 ? "ITEM" : "ITEMS"}`,
            highlight: true,
          },
          ...config.stats,
        ]}
      />
    )
  }

  return (
    <PageHero
      badge="Components"
      count={`${totalCount} COMPONENTS`}
      title="Pixel-perfect, uniquely crafted."
      description="A comprehensive showcase of production-grade UI primitives, motion animations, and interactive surfaces."
      stats={[
        { label: `${totalCount} COMPONENTS`, highlight: true },
        { label: "3-COLUMN BLUEPRINT" },
        { label: "TAILWIND CSS V4", hideOnMobile: true },
      ]}
    />
  )
}
