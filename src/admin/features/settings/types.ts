export type TwitterCardType = "summary" | "summary_large_image"

export interface AdminSiteSettingsData {
  // General
  siteName: string
  siteTitle: string
  siteDescription: string
  siteUrl: string
  locale: string
  themeColor: string

  // SEO & OpenGraph
  ogImage: string
  twitterHandle: string
  twitterCard: TwitterCardType
  keywords: string[]
  noIndex: boolean

  // Favicons & Icons
  favicon: string
  faviconSvg: string
  faviconDarkSvg: string
  appleTouchIcon: string

  // Registry & Platform
  registryNamespace: string
  registryUrlTemplate: string
  repoUrl: string
  enableSitemap: boolean
  enableAnalytics: boolean
  maintenanceMode: boolean

  updatedAt: string
}
