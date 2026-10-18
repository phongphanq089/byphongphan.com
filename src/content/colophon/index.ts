import type {
  ColophonColorToken,
  ColophonFontSpecimen,
  ColophonHeroStackItem,
  ColophonTechCategory,
} from "./types"

export * from "./types"

export const COLOPHON_HERO_STACK: ColophonHeroStackItem[] = [
  { name: "TanStack Start", label: "Framework & SSR" },
  { name: "React", label: "Component Engine" },
  { name: "Tailwind CSS", label: "Styling & Tokens" },
  { name: "Base UI", label: "Headless Primitives" },
  { name: "TypeScript", label: "Type Safety" },
]

export const COLOPHON_TECH_CATEGORIES: ColophonTechCategory[] = [
  {
    title: "Core Architecture & Runtime",
    label: "FRAMEWORK",
    description:
      "Type-safe full-stack foundation built for instantaneous server/client rendering and exceptional developer experience.",
    items: [
      {
        name: "TanStack Start",
        role: "Full-stack Framework & SSR",
        icon: "tanstack",
        link: "https://tanstack.com/start/latest",
      },
      {
        name: "TanStack Router",
        role: "Type-safe Routing Engine",
        icon: "tanstack",
        link: "https://tanstack.com/router/latest",
      },
      {
        name: "React",
        role: "Declarative Component Engine",
        icon: "react",
        link: "https://react.dev/",
      },
      {
        name: "TypeScript",
        role: "Static Type System & Safety",
        icon: "typescript",
        link: "https://www.typescriptlang.org/",
      },
      {
        name: "Vite",
        role: "Next-gen Frontend Tooling",
        icon: "vite",
        link: "https://vite.dev/",
      },
      {
        name: "Node.js",
        role: "Asynchronous JavaScript Runtime",
        icon: "node",
        link: "https://nodejs.org/",
      },
    ],
  },
  {
    title: "Styling & Visual Design",
    label: "DESIGN SYSTEM",
    description:
      "Utility-first styling with modern CSS features, wide-gamut OKLCH palettes, and interactive tactile animations.",
    items: [
      {
        name: "Tailwind CSS",
        role: "Utility-first CSS & Modern Tokens",
        icon: "tailwind",
        link: "https://tailwindcss.com/",
      },
      {
        name: "Base UI",
        role: "Accessible Headless Primitives",
        link: "https://base-ui.com/",
      },
      {
        name: "Motion",
        role: "Physics & Layout Animation Engine",
        icon: "motion",
        link: "https://motion.dev/",
      },
      {
        name: "Shiki",
        role: "Zero-JS Syntax Highlighting",
        link: "https://shiki.style/",
      },
      {
        name: "Paper Shaders & Three.js",
        role: "WebGL Shaders & Canvas FX",
        link: "https://threejs.org/",
      },
      {
        name: "Lucide Icons",
        role: "Vector Icon System",
        link: "https://lucide.dev/",
      },
    ],
  },
  {
    title: "Data Layer & Infrastructure",
    label: "DATA & HOSTING",
    description:
      "Reactive state management, server cache synchronization, and edge deployment with a serverless roadmap.",
    items: [
      {
        name: "TanStack Query",
        role: "Server State & Asynchronous Cache",
        icon: "tanstack",
        link: "https://tanstack.com/query/latest",
      },
      {
        name: "Zustand",
        role: "Client Global Store",
        icon: "zustand",
        link: "https://zustand.docs.pmnd.rs/",
      },
      {
        name: "Netlify",
        role: "Edge Hosting & Static Prerendering",
        link: "https://www.netlify.com/",
      },
      {
        name: "Drizzle ORM",
        role: "Headless TypeScript ORM",
        badge: "Coming Soon",
        icon: "drizzle",
        link: "https://orm.drizzle.team/",
      },
      {
        name: "Neon PostgreSQL",
        role: "Serverless Database",
        badge: "Coming Soon",
        icon: "postgres",
        link: "https://neon.tech/",
      },
      {
        name: "Better Auth",
        role: "TypeScript-first Authentication",
        badge: "Coming Soon",
        link: "https://www.better-auth.com/",
      },
    ],
  },
]

export const COLOPHON_FONT_SPECIMENS: ColophonFontSpecimen[] = [
  {
    name: "Mulish",
    weights: ["300", "400", "500", "700"],
    sampleGlyphs: "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm",
    cssFamily: "var(--font-base)",
    cssClass: "font-sans",
  },
  {
    name: "Geist Mono",
    weights: ["400", "500", "600", "700"],
    sampleGlyphs: "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm",
    cssFamily: "var(--font-mono)",
    cssClass: "font-mono",
  },
]

export const COLOPHON_COLOR_TOKENS: ColophonColorToken[] = [
  {
    name: "Brand Accent",
    cssVar: "--pp-primary",
    value: "#dc2626 / oklch(0.55 0.22 27)",
    bgClass: "bg-pp-primary",
    description: "Main signature brand red accent",
  },
  {
    name: "Canvas Backdrop",
    cssVar: "--background",
    value: "#09090b / oklch(0.12 0 0)",
    bgClass: "bg-background",
    borderClass: "border border-border",
    description: "Default page background color",
  },
  {
    name: "Surface Card",
    cssVar: "--card",
    value: "#121215 / oklch(0.15 0 0)",
    bgClass: "bg-card",
    borderClass: "border border-border",
    description: "Surface card container level",
  },
  {
    name: "Muted Background",
    cssVar: "--muted",
    value: "#18181b / oklch(0.20 0 0)",
    bgClass: "bg-muted",
    borderClass: "border border-border/40",
    textClass: "text-muted-foreground",
    description: "Secondary subdued panels and chips",
  },
  {
    name: "Accent Hover",
    cssVar: "--accent",
    value: "#27272a / oklch(0.25 0 0)",
    bgClass: "bg-accent",
    borderClass: "border border-border/60",
    description: "Interactive hover surfaces",
  },
  {
    name: "Dividing Border",
    cssVar: "--border",
    value: "oklch(1 0 0 / 12%)",
    bgClass: "bg-border",
    description: "Grid lines, dividers, and card borders",
  },
  {
    name: "Destructive Alert",
    cssVar: "--destructive",
    value: "#ef4444 / oklch(0.60 0.20 25)",
    bgClass: "bg-destructive",
    description: "Error states, destructive actions",
  },
  {
    name: "Online / Success",
    cssVar: "--success",
    value: "#10b981 / oklch(0.65 0.17 160)",
    bgClass: "bg-emerald-500",
    description: "Status indicators, active telemetry",
  },
]

// Backward compatibility alias
export const COLOR_TOKENS = COLOPHON_COLOR_TOKENS
