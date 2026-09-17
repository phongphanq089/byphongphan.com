import {
  getSanityImageUrl,
  type SanityImage,
  type SanitySiteSettings,
} from "@/shared/lib/sanity"

import { siteConfig } from "./site.config"

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
  library: {
    title: "UI Library • Phong Phan",
    description:
      "Reusable React components, custom hooks, and interaction patterns for modern web apps.",
  },
  studio: {
    title: "Sanity Studio • Content Management",
    description: "Headless CMS workspace powered by Sanity.io.",
    noIndex: true,
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
export function getOgImageUrl(
  customImage?: string | { url?: string } | unknown,
  sanityOgImage?: SanityImage
): string {
  const resolvedCustomUrl =
    typeof customImage === "string"
      ? customImage
      : typeof customImage === "object" &&
          customImage !== null &&
          "url" in customImage &&
          typeof (customImage as { url: unknown }).url === "string"
        ? (customImage as { url: string }).url
        : undefined

  if (resolvedCustomUrl && resolvedCustomUrl.trim() !== "") {
    return resolvedCustomUrl.trim()
  }

  return (
    getSanityImageUrl(sanityOgImage, {
      width: 1200,
      height: 630,
      fit: "crop",
      fallback: defaultSeoConfig.ogImage,
    }) || defaultSeoConfig.ogImage
  )
}

/**
 * Creates meta tags array for TanStack Router: `head: () => ({ meta: createSeoMeta(config, siteSettings) })`
 * Prioritizes dynamic Sanity schema settings when present, with complete fallback to predefined defaults.
 */
export function createSeoMeta(
  config?: Partial<SeoConfig> | keyof typeof pagesSeoConfig,
  siteSettings?: SanitySiteSettings | null
) {
  let resolved: Partial<SeoConfig> = {}

  if (typeof config === "string") {
    resolved = pagesSeoConfig[config] ?? {}
  } else if (config) {
    resolved = config
  }

  const isRoot = !config || config === undefined
  const customOgUrl =
    typeof resolved.ogImage === "string"
      ? resolved.ogImage
      : typeof resolved.ogImage === "object" &&
          resolved.ogImage !== null &&
          "url" in resolved.ogImage &&
          typeof (resolved.ogImage as { url: unknown }).url === "string"
        ? (resolved.ogImage as { url: string }).url
        : undefined

  const hasCustomImage = Boolean(customOgUrl && customOgUrl.trim() !== "")
  const hasSanityImage = Boolean(siteSettings?.ogImage?.asset)

  // Priority: Route Config > Sanity Schema Settings > Default Static Config
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
    {
      title,
      content: "",
    },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ]

  // Image handling: Only output og:image if root OR custom image OR sanity image exists
  if (isRoot || hasCustomImage || hasSanityImage) {
    const image = getOgImageUrl(customOgUrl, siteSettings?.ogImage)
    metaList.push(
      { property: "og:image", content: image },
      { name: "twitter:image", content: image }
    )
  }

  // Base root meta (only need to output at root or if siteSettings is provided)
  if (isRoot || siteSettings) {
    const twitterCard = siteSettings?.twitterCard || "summary_large_image"
    const twitterHandle = siteSettings?.twitterHandle?.trim()
    const themeColor = siteSettings?.themeColor?.hex

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
      { name: "theme-color", content: themeColor || "#dc2626" },
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
    // For child routes with specific overrides
    if (resolved.url) {
      metaList.push({ property: "og:url", content: resolved.url })
    }
    if (resolved.keywords) {
      metaList.push({ name: "keywords", content: keywords })
    }
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
 * Creates dynamic header link tags (Favicons, Apple Touch, Manifest, Canonical URL)
 * Checks Sanity schema image assets first, falling back to local files.
 */
export function createSiteLinks(siteSettings?: SanitySiteSettings | null) {
  const canonicalUrl = siteSettings?.siteUrl?.trim() || siteConfig.url

  const favicon = getSanityImageUrl(siteSettings?.favicon, {
    fallback: "/favicon.ico",
  })

  const favicon16 = getSanityImageUrl(siteSettings?.favicon16, {
    width: 16,
    height: 16,
    fallback: "/favicon-16x16.png",
  })

  const favicon32 = getSanityImageUrl(siteSettings?.favicon32, {
    width: 32,
    height: 32,
    fallback: "/favicon-32x32.png",
  })

  const appleTouchIcon = getSanityImageUrl(siteSettings?.appleTouchIcon, {
    width: 180,
    height: 180,
    fallback: "/apple-touch-icon.png",
  })

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
      color: siteSettings?.themeColor?.hex || "#ffffff",
    },
    { rel: "icon", href: favicon },
  ]

  const safariMask = getSanityImageUrl(siteSettings?.safariMaskIcon)
  if (safariMask) {
    links.push({
      rel: "mask-icon",
      href: safariMask,
      color: siteSettings?.themeColor?.hex || "#000000",
    })
  }

  return links
}

/**
 * Creates Person structured data JSON-LD with Sanity settings fallback to static config.
 */
export function createPersonJsonLd(siteSettings?: SanitySiteSettings | null) {
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
 * Creates BlogPosting structured data JSON-LD for individual article detail pages.
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
