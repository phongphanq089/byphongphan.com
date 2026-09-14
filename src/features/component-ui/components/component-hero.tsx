import { PageHero } from "@/shared/ui/system"

import type { ComponentCategoryId } from "../types"

interface ComponentHeroProps {
  category?: ComponentCategoryId
  totalCount?: number
}

export function ComponentHero({
  category = "all",
  totalCount = 7,
}: ComponentHeroProps) {
  if (category === "foundations") {
    return (
      <PageHero
        badge={{ label: "Design System Foundations", pulsingDot: true }}
        count="TOKENS & GRID"
        title="Design tokens, fonts & containers."
        description="Architectural design system foundations: semantic OKLCH color palettes, Geist font scales, GridContainer geometry, and elevation tokens."
        stats={[
          { label: "05 FOUNDATION MODULES", highlight: true },
          { label: "GEIST SANS & MONO" },
          { label: "TAILWIND CSS V4", hideOnMobile: true },
        ]}
      />
    )
  }

  if (category === "animations") {
    return (
      <PageHero
        badge="Motion & Physics"
        count={`${totalCount} ANIMATIONS`}
        title="Fluid spring physics & motion."
        description="Interactive 60fps animations, 3D unboxing components, and specular highlight radial cards."
        stats={[
          { label: `${totalCount} MOTION BLOCKS`, highlight: true },
          { label: "MOTION (FRAMER)" },
          { label: "CSS VARIABLES", hideOnMobile: true },
        ]}
      />
    )
  }

  if (category === "primitives") {
    return (
      <PageHero
        badge="Core Primitives"
        count={`${totalCount} PRIMITIVES`}
        title="Pixel-perfect, accessible primitives."
        description="Production-grade core UI components compliant with Radix UI and Tailwind CSS v4."
        stats={[
          { label: `${totalCount} PRIMITIVES`, highlight: true },
          { label: "RADIX UI PRIMITIVES" },
          { label: "TAILWIND CSS V4", hideOnMobile: true },
        ]}
      />
    )
  }

  return (
    <PageHero
      badge="Components"
      count={`${totalCount} COMPONENTS`}
      title="Pixel-perfect, uniquely crafted."
      description="A comprehensive showcase of production-grade UI primitives, motion animations, and design system foundations."
      stats={[
        { label: `${totalCount} COMPONENTS`, highlight: true },
        { label: "3-COLUMN BLUEPRINT" },
        { label: "TAILWIND CSS V4", hideOnMobile: true },
      ]}
    />
  )
}
