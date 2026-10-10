import type { IconName } from "@/shared/ui/icons"

export interface ColophonHeroStackItem {
  name: string
  label: string
}

export interface ColophonTechItem {
  name: string
  role: string
  version?: string
  icon?: IconName
  link: string
}

export interface ColophonTechCategory {
  title: string
  label: string
  description: string
  items: ColophonTechItem[]
}

export interface ColophonFontSpecimen {
  name: string
  weights: string[]
  sampleGlyphs: string
  cssFamily: string
  cssClass: string
}

export interface ColophonColorToken {
  name: string
  cssVar: string
  value: string
  bgClass: string
  borderClass?: string
  description: string
  textClass?: string
}
