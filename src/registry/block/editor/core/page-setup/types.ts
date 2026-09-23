export type PageSizePreset = "a4" | "letter" | "legal" | "a3" | "a5" | "fluid"
export type PageOrientation = "portrait" | "landscape"
export type PageMarginPreset = "normal" | "narrow" | "wide" | "custom"
export type PageLayoutMode = "paged" | "continuous"

export interface CustomMarginValues {
  top: number // mm
  right: number // mm
  bottom: number // mm
  left: number // mm
}

export interface PageSetupConfig {
  size: PageSizePreset
  orientation: PageOrientation
  margins: PageMarginPreset
  customMargins: CustomMarginValues
  layoutMode: PageLayoutMode
  scale: number // e.g. 1.0 (100%), 0.75, 1.25
  showPageNumbers: boolean
}

export interface PageDimension {
  id: PageSizePreset
  name: string
  description: string
  widthMm: number
  heightMm: number
  widthPx: number
  heightPx: number
}

export const PAGE_SIZE_DIMENSIONS: Record<PageSizePreset, PageDimension> = {
  a4: {
    id: "a4",
    name: "A4",
    description: "210 × 297 mm · Standard Document",
    widthMm: 210,
    heightMm: 297,
    widthPx: 794,
    heightPx: 1123,
  },
  letter: {
    id: "letter",
    name: "US Letter",
    description: "8.5 × 11 in · US Standard",
    widthMm: 215.9,
    heightMm: 279.4,
    widthPx: 816,
    heightPx: 1056,
  },
  legal: {
    id: "legal",
    name: "US Legal",
    description: "8.5 × 14 in · Legal Contracts",
    widthMm: 215.9,
    heightMm: 355.6,
    widthPx: 816,
    heightPx: 1344,
  },
  a3: {
    id: "a3",
    name: "A3",
    description: "297 × 420 mm · Poster / Ledger",
    widthMm: 297,
    heightMm: 420,
    widthPx: 1123,
    heightPx: 1587,
  },
  a5: {
    id: "a5",
    name: "A5",
    description: "148 × 210 mm · Compact Booklet",
    widthMm: 148,
    heightMm: 210,
    widthPx: 559,
    heightPx: 794,
  },
  fluid: {
    id: "fluid",
    name: "Full Width",
    description: "Fluid responsive canvas · Notion style",
    widthMm: 0,
    heightMm: 0,
    widthPx: 0,
    heightPx: 0,
  },
}

export const MARGIN_PRESET_VALUES: Record<
  Exclude<PageMarginPreset, "custom">,
  CustomMarginValues
> = {
  normal: { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 }, // 1 inch / 25.4mm
  narrow: { top: 12.7, right: 12.7, bottom: 12.7, left: 12.7 }, // 0.5 inch / 12.7mm
  wide: { top: 38.1, right: 38.1, bottom: 38.1, left: 38.1 }, // 1.5 inch / 38.1mm
}

export const DEFAULT_PAGE_SETUP: PageSetupConfig = {
  size: "fluid",
  orientation: "portrait",
  margins: "normal",
  customMargins: { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 },
  layoutMode: "continuous",
  scale: 1.0,
  showPageNumbers: true,
}
