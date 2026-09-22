import { siteConfig } from "./site.config"

export interface DynamicSiteSettings {
  siteName?: string
  siteTitle?: string
  siteDescription?: string
  siteUrl?: string
  author?: string
  ogImage?: string
  keywords?: string[]
  twitterHandle?: string
  twitterCard?: "summary" | "summary_large_image"
  themeColor?: string
  // Favicons & Icons (URL direct to CDN or relative path)
  favicon?: string
  favicon16?: string
  favicon32?: string
  appleTouchIcon?: string
  safariMaskIcon?: string
  // Social links  Structured Data (JSON-LD)
  githubUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
}

export interface SeoConfig {
  title: string
  description: string
  keywords?: string[] | string
  ogImage?: string
  url?: string
  noIndex?: boolean
}

export const defaultSeoConfig: Required<
  Omit<SeoConfig, "keywords" | "noIndex">
> & {
  keywords: string[]
  siteName: string
  locale: string
  author: string
  noIndex: boolean
} = {
  siteName: "Phong Phan",
  title: "Phong Phan • Frontend Engineer",
  description:
    "Personal portfolio and engineering showcase of Phong Phan. Frontend Engineer with a solid fullstack foundation, specializing in React, TypeScript, TanStack, and UI craftsmanship.",
  url: siteConfig.url,
  ogImage: siteConfig.ogImage,
  locale: "en_US",
  author: siteConfig.author.name,
  noIndex: false,
  keywords: [
    "Phong Phan",
    "Frontend Engineer",
    "UI Engineer",
    "Creative Developer",
    "React",
    "TanStack",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Design Systems",
    "Web Development",
    "Portfolio",
  ],
}

export const pagesSeoConfig: Record<string, SeoConfig> = {
  home: {
    title: "Phong Phan • Frontend Engineer",
    description:
      "Personal portfolio of Phong Phan — Frontend Engineer focused on building highly polished user interfaces, fluid interactions, and modern web applications.",
  },
  block: {
    title: "Blocks • Phong Phan",
    description:
      "Beautifully designed, production-ready UI blocks and templates built with React and Tailwind CSS.",
  },
  projects: {
    title: "Projects • Phong Phan",
    description:
      "Featured web applications, interactive experiments, and UI case studies built with React, TypeScript, and modern web technologies.",
  },
  blog: {
    title: "Blog • Phong Phan",
    description:
      "Articles and practical engineering notes on frontend architecture, UI components, animations, and developer workflows.",
  },
  resources: {
    title: "Resources • Phong Phan",
    description:
      "Curated collection of developer tools, documentation, libraries, and design bookmarks for modern web development.",
  },
  componentUi: {
    title: "Component UI • Phong Phan",
    description:
      "Pixel-perfect, uniquely crafted UI primitives, custom hooks, and interaction patterns.",
  },
  designSystem: {
    title: "Design System • Phong Phan",
    description:
      "Engineering design tokens, UI primitives, and interactive shader components created for the portfolio.",
  },
  colophon: {
    title: "Colophon • Phong Phan",
    description:
      "System specifications, typography, modern tech stack, and design inspirations behind this developer portfolio.",
  },
}

/**
 * Resolves Open Graph image URL with fallback logic:
 * 1. Explicit custom image URL passed in route config
 * 2. Sanity Site Settings ogImage asset (optimized via urlFor)
 * 3. Default predefined ogImage
 */
export function resolveImageUrl(
  customImage?: string | { url?: string } | null,
  fallbackImage?: string
): string {
  if (typeof customImage === "string" && customImage.trim() !== "") {
    return customImage.trim()
  }

  if (
    typeof customImage === "object" &&
    customImage !== null &&
    "url" in customImage &&
    typeof customImage.url === "string" &&
    customImage.url.trim() !== ""
  ) {
    return customImage.url.trim()
  }

  return fallbackImage?.trim() || defaultSeoConfig.ogImage
}

/**
 * Creates meta tags array for TanStack Router: `head: () => ({ meta: createSeoMeta(config, siteSettings) })`
 * Prioritizes dynamic Sanity schema settings when present, with complete fallback to predefined defaults.
 */
export function createSeoMeta(
  config?: Partial<SeoConfig> | keyof typeof pagesSeoConfig,
  siteSettings?: DynamicSiteSettings | null
) {
  let resolved: Partial<SeoConfig> = {}

  if (typeof config === "string") {
    resolved = pagesSeoConfig[config] ?? {}
  } else if (config) {
    resolved = config
  }

  const isRoot = !config

  // Tiêu chí fallback phân tầng (Cascade Fallback)
  const title =
    resolved.title?.trim() ||
    siteSettings?.siteTitle?.trim() ||
    defaultSeoConfig.title

  const description =
    resolved.description?.trim() ||
    siteSettings?.siteDescription?.trim() ||
    defaultSeoConfig.description

  const siteName = siteSettings?.siteName?.trim() || defaultSeoConfig.siteName
  const author = siteSettings?.author?.trim() || defaultSeoConfig.author
  const url =
    resolved.url?.trim() ||
    siteSettings?.siteUrl?.trim() ||
    defaultSeoConfig.url

  let keywords: string
  if (resolved.keywords) {
    keywords = Array.isArray(resolved.keywords)
      ? resolved.keywords.join(", ")
      : resolved.keywords
  } else if (siteSettings?.keywords && siteSettings.keywords.length > 0) {
    keywords = siteSettings.keywords.join(", ")
  } else {
    keywords = defaultSeoConfig.keywords.join(", ")
  }

  const noIndex = resolved.noIndex ?? defaultSeoConfig.noIndex

  const metaList: Array<{
    name?: string
    property?: string
    content: string
    title?: string
  }> = [
    { title, content: "" },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ]

  // Image handling: root page hoặc bất kỳ page nào có ảnh riêng/ảnh dynamic từ BE
  const image = resolveImageUrl(resolved.ogImage, siteSettings?.ogImage)
  if (isRoot || resolved.ogImage || siteSettings?.ogImage) {
    metaList.push(
      { property: "og:image", content: image },
      { name: "twitter:image", content: image }
    )
  }

  // Root Meta tags
  if (isRoot || siteSettings) {
    const twitterCard = siteSettings?.twitterCard || "summary_large_image"
    const twitterHandle = siteSettings?.twitterHandle?.trim()
    const themeColor = siteSettings?.themeColor || "#dc2626"

    metaList.push(
      { name: "keywords", content: keywords },
      { name: "author", content: author },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: siteName },
      { property: "og:locale", content: defaultSeoConfig.locale },
      { property: "og:url", content: url },
      { name: "twitter:card", content: twitterCard },
      {
        name: "robots",
        content: noIndex ? "noindex, nofollow" : "index, follow",
      }
    )

    if (twitterHandle) {
      metaList.push(
        { name: "twitter:site", content: twitterHandle },
        { name: "twitter:creator", content: twitterHandle }
      )
    }

    metaList.push(
      { name: "theme-color", content: themeColor },
      { name: "application-name", content: siteName },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent",
      },
      { name: "apple-mobile-web-app-title", content: siteName }
    )
  } else {
    // Override cho route con
    if (resolved.url)
      metaList.push({ property: "og:url", content: resolved.url })
    if (resolved.keywords)
      metaList.push({ name: "keywords", content: keywords })
    if (resolved.noIndex !== undefined) {
      metaList.push({
        name: "robots",
        content: resolved.noIndex ? "noindex, nofollow" : "index, follow",
      })
    }
  }

  return metaList
}

/**
 * Dynamic Links: Favicons, Webmanifest, Canonical
 */

export function createSiteLinks(siteSettings?: DynamicSiteSettings | null) {
  const canonicalUrl = siteSettings?.siteUrl?.trim() || siteConfig.url
  const favicon = siteSettings?.favicon || "/favicon.ico"
  const favicon16 = siteSettings?.favicon16 || "/favicon-16x16.png"
  const favicon32 = siteSettings?.favicon32 || "/favicon-32x32.png"
  const appleTouchIcon = siteSettings?.appleTouchIcon || "/apple-touch-icon.png"

  const links: Array<{
    rel: string
    href: string
    type?: string
    sizes?: string
    color?: string
  }> = [
    { rel: "canonical", href: canonicalUrl },
    { rel: "apple-touch-icon", sizes: "180x180", href: appleTouchIcon },
    { rel: "icon", type: "image/png", sizes: "32x32", href: favicon32 },
    { rel: "icon", type: "image/png", sizes: "16x16", href: favicon16 },
    {
      rel: "manifest",
      href: "/site.webmanifest",
      color: siteSettings?.themeColor || "#ffffff",
    },
    { rel: "icon", href: favicon },
  ]

  if (siteSettings?.safariMaskIcon) {
    links.push({
      rel: "mask-icon",
      href: siteSettings.safariMaskIcon,
      color: siteSettings.themeColor || "#000000",
    })
  }

  return links
}

/**
 * Person JSON-LD Schema
 */
export function createPersonJsonLd(siteSettings?: DynamicSiteSettings | null) {
  const canonicalUrl = siteSettings?.siteUrl?.trim() || siteConfig.url

  const sameAs = [
    siteSettings?.githubUrl?.trim() || siteConfig.social.github.href,
    siteSettings?.linkedinUrl?.trim() || siteConfig.social.linkedin.href,
    siteSettings?.twitterUrl?.trim() || siteConfig.social.twitter.href,
  ].filter(Boolean)

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteSettings?.author?.trim() || siteConfig.author.name,
    jobTitle: siteConfig.author.role || "Frontend Engineer",
    url: canonicalUrl,
    sameAs,
    description:
      siteSettings?.siteDescription?.trim() || siteConfig.description,
  }
}

/**
 * BlogPosting JSON-LD Schema
 */
export function createBlogArticleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  authorName,
}: {
  title: string
  description?: string
  url: string
  image?: string
  datePublished?: string
  authorName?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description || title,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(image ? { image: [image] } : {}),
    ...(datePublished ? { datePublished } : {}),
    author: {
      "@type": "Person",
      name: authorName || siteConfig.author.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
  }
}
