import type { IconName } from "@/shared/ui/icons"

export interface ColophonTechItem {
  name: string
  role: string
  version?: string
  icon?: IconName
  link: string
  highlight?: boolean
}

export interface ColophonTechCategory {
  title: string
  label: string
  description: string
  items: ColophonTechItem[]
}

export interface ColophonColorToken {
  name: string
  variable: string
  swatchColor: string
  oklchDark: string
  oklchLight: string
  description: string
  category: "brand" | "surface" | "blueprint"
}

export interface ColophonSpacingToken {
  name: string
  variable: string
  value: string
  description: string
}

export interface ColophonInspirationItem {
  name: string
  href: string
}
