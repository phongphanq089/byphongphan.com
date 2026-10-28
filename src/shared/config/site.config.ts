export const siteConfig = {
  name: "Phong Phan",
  title: "Phong Phan • Frontend Engineer",
  description:
    "Portfolio of Phong Phan. Frontend Engineer with a solid fullstack foundation, specializing in React, TypeScript, TanStack, fluid interactions, and UI craftsmanship.",
  url: "https://byphongphan.com",
  registry: {
    namespace: "@byphongphan",
    name: "byphongphan",
    urlTemplate: "https://byphongphan.com/r/{name}.json",
  },
  ogImage: "https://byphongphan.com/og-image.png",
  repoUrl: "https://github.com/phongphanq089/byphongphan.com",
  githubLicense:
    "https://github.com/phongphanq089/byphongphan.com/blob/main/LICENSE.md",
  author: {
    name: "Phong Phan",
    role: "Frontend Engineer",
    location: "Viet Nam",
    githubUsername: "phongphanq089",
    avatar: "/avatar.gif",
    bio: "Frontend Engineer · Fullstack Capable · Viet Nam",
    email: "phongphanq089@gmail.com",
    phone: "0706113210",
  },

  social: {
    github: {
      name: "GitHub",
      href: "https://github.com/phongphanq089",
      username: "phongphanq089",
    },
    linkedin: {
      name: "LinkedIn",
      href: "www.linkedin.com/in/phong-phan-719464201",
    },
    twitter: {
      name: "X (Twitter)",
      href: "https://x.com/PhongPhanq089",
    },
    email: {
      name: "Email",
      href: "mailto:phongphanq089@gmail.com",
    },
  },

  inspirations: [
    { name: "chanhdai.com", href: "https://chanhdai.com" },
    { name: "shadcn/ui", href: "https://ui.shadcn.com" },
    { name: "Tailwind CSS", href: "https://tailwindcss.com" },
    { name: "Skiper UI", href: "https://skiper-ui.com" },
    { name: "reUI", href: "https://reui.io" },
    { name: "Better Auth", href: "https://www.better-auth.com" },
    { name: "useLayouts", href: "https://uselayouts.com" },
    { name: "Reactbits", href: "https://reactbits.dev/" },
    { name: "Aceternity UI", href: "https://ui.aceternity.com" },
  ],
} as const

// Legacy compatibility exports
export const DEFAULT_NAME_PORTFOLIO = siteConfig.title
export const IMAGE_SHARE = siteConfig.ogImage
export const SOCIALINK = {
  github: { name: "Github", link: siteConfig.social.github.href },
  linkedin: { name: "Linkedin", link: siteConfig.social.linkedin.href },
  twiter: { name: "X (TWITTER)", link: siteConfig.social.twitter.href },
  mail: siteConfig.social.email.href,
}
