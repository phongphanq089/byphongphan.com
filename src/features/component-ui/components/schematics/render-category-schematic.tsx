import type { ComponentCategoryId } from "@/shared/config"

import { CategoryBackgroundSchematic } from "./category-background-schematic"
import { CategoryCardSchematic } from "./category-card-schematic"
import { CategoryDataDisplaySchematic } from "./category-data-display-schematic"
import { CategoryInteractiveSchematic } from "./category-interactive-schematic"
import { CategoryNavigationSchematic } from "./category-navigation-schematic"
import { CategoryTextSchematic } from "./category-text-schematic"

export interface RenderComponentCategorySchematicProps {
  category: ComponentCategoryId
  active?: boolean
  className?: string
}

export function RenderComponentCategorySchematic({
  category,
  active,
  className,
}: RenderComponentCategorySchematicProps) {
  switch (category) {
    case "navigation":
      return (
        <CategoryNavigationSchematic active={active} className={className} />
      )
    case "card":
      return <CategoryCardSchematic active={active} className={className} />
    case "interactive":
      return (
        <CategoryInteractiveSchematic active={active} className={className} />
      )
    case "data-display":
      return (
        <CategoryDataDisplaySchematic active={active} className={className} />
      )
    case "text":
      return <CategoryTextSchematic active={active} className={className} />
    case "background":
      return (
        <CategoryBackgroundSchematic active={active} className={className} />
      )
    default:
      return null
  }
}
