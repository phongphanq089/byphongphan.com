import type { ComponentCategoryId } from "@/shared/config"

export interface ShowcaseComponentItem {
  slug: string
  title: string
  description: string
  category: ComponentCategoryId
  index?: string
  schematicType?: string
  isNew?: boolean
  isUpdated?: boolean
  gridPlacementClass?: string
  tag?: string
  specsLabel?: string
}

export interface ShowcaseHeaderProps {
  romanIndex?: string
  title?: string
  subtitle?: string
  catalogHref?: string
  catalogCount?: number
  className?: string
}

export interface LazyShowcaseCardProps {
  item: ShowcaseComponentItem
  className?: string
}

export interface ShowcaseBentoGridProps {
  items?: ShowcaseComponentItem[]
  className?: string
}

export interface SectionComponentsProps {
  className?: string
  items?: ShowcaseComponentItem[]
}
