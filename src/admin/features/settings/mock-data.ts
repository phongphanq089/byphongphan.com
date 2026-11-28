import { defaultSeoConfig, siteConfig } from "@/shared/config"

import type { AdminSiteSettingsData } from "./types"

export const INITIAL_SITE_SETTINGS: AdminSiteSettingsData = {
  siteName: defaultSeoConfig.siteName,
  siteTitle: defaultSeoConfig.title,
  siteDescription: defaultSeoConfig.description,
  siteUrl: siteConfig.url,
  locale: defaultSeoConfig.locale,
  themeColor: "#09090b",

  ogImage: siteConfig.ogImage,
  twitterHandle: "@PhongPhanq089",
  twitterCard: "summary_large_image",
  keywords: [...defaultSeoConfig.keywords],
  noIndex: defaultSeoConfig.noIndex,

  favicon: "/favicon.ico",
  faviconSvg: "/favicon.svg",
  faviconDarkSvg: "/favicon-dark.svg",
  appleTouchIcon: "/apple-touch-icon.png",

  registryNamespace: siteConfig.registry.namespace,
  registryUrlTemplate: siteConfig.registry.urlTemplate,
  repoUrl: siteConfig.repoUrl,
  enableSitemap: true,
  enableAnalytics: true,
  maintenanceMode: false,

  updatedAt: "2026-11-27T06:00:00Z",
}
