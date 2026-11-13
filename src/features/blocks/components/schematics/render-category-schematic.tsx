import type { BlockCategoryId } from "@/shared/config"

import { CategoryApplicationSchematic } from "./category-application-schematic"
import { CategoryAuthSchematic } from "./category-auth-schematic"
import { CategoryEcommerceSchematic } from "./category-ecommerce-schematic"
import { CategoryMarketingSchematic } from "./category-marketing-schematic"
import { CategoryNotFoundSchematic } from "./category-not-found-schematic"

export interface RenderBlockCategorySchematicProps {
  category: BlockCategoryId
  active?: boolean
  className?: string
}

/**
 * Universal dispatcher for block category blueprint schematics.
 * Used by the homepage grid and future catalog pages.
 */
export function RenderBlockCategorySchematic({
  category,
  active,
  className,
}: RenderBlockCategorySchematicProps) {
  switch (category) {
    case "marketing":
      return (
        <CategoryMarketingSchematic active={active} className={className} />
      )
    case "404-page":
      return <CategoryNotFoundSchematic active={active} className={className} />
    case "auth":
      return <CategoryAuthSchematic active={active} className={className} />
    case "ecommerce":
      return (
        <CategoryEcommerceSchematic active={active} className={className} />
      )
    case "application":
      return (
        <CategoryApplicationSchematic active={active} className={className} />
      )
    default:
      return null
  }
}
