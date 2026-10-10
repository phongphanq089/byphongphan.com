import type {
  ColophonColorToken,
  ColophonFontSpecimen,
  ColophonHeroStackItem,
  ColophonTechCategory,
} from "./types"

export * from "./types"

export const COLOPHON_HERO_STACK: ColophonHeroStackItem[] = [
  { name: "React 19", label: "UI Engine" },
  { name: "TanStack Start", label: "Routing & SSR" },
  { name: "Tailwind CSS v4", label: "Styling" },
  { name: "TypeScript 5.7+", label: "Type System" },
  { name: "Shadcn ui", label: "Fully customizable UI" },
]

export const COLOPHON_TECH_CATEGORIES: ColophonTechCategory[] = [
  {
    title: "Core Architecture & Runtime",
    label: "FRAMEWORK",
    description:
      "Modern foundational stack built for type safety, instantaneous feedback, and high-performance client/server rendering.",
    items: [
      {
        name: "React 19",
        role: "Component Engine",
        version: "^19.2",
        icon: "react",
        link: "https://react.dev/",
      },
      {
        name: "TypeScript",
        role: "Type System & Safety",
        version: "5.7+",
        icon: "typescript",
        link: "https://www.typescriptlang.org/",
      },
      {
        name: "Vite 8",
        role: "Build Tool & Bundler",
        version: "^8.0",
        icon: "vite",
        link: "https://vite.dev/",
      },
      {
        name: "TanStack Router & Start",
        role: "File Routing & SSR",
        version: "1.168",
        icon: "tanstack",
        link: "https://tanstack.com/router",
      },
    ],
  },
  {
    title: "Styling & Visual Design",
    label: "DESIGN SYSTEM",
    description:
      "Utility-first styling with modern CSS features, wide-gamut OKLCH palettes, and a tactile blueprint layout language.",
    items: [
      {
        name: "Tailwind CSS v4",
        role: "Engine & Directives",
        version: "^4.1",
        icon: "tailwind",
        link: "https://tailwindcss.com/",
      },
      {
        name: "Motion (Framer)",
        role: "Gestures & Animations",
        version: "^12.4",
        icon: "motion",
        link: "https://motion.dev/",
      },
      {
        name: "Radix UI Primitives",
        role: "Accessible Primitives",
        version: "^1.2",
        icon: "shadcnui",
        link: "https://www.radix-ui.com/",
      },
      {
        name: "Paper Shaders & Three.js",
        role: "WebGL & Canvas Effects",
        version: "^0.183",
        link: "https://threejs.org/",
      },
    ],
  },
  {
    title: "Data Layer & Infrastructure",
    label: "DATA & HOSTING",
    description:
      "Reactive global state, server cache synchronization, headless content management, and edge deployment.",
    items: [
      {
        name: "TanStack Query v5",
        role: "Server State & Cache",
        version: "^5.100",
        icon: "tanstack",
        link: "https://tanstack.com/query",
      },
      {
        name: "Zustand",
        role: "Client Global Store",
        version: "^5.0",
        icon: "zustand",
        link: "https://zustand-demo.pmnd.rs/",
      },
      {
        name: "Drizzle-orm",
        role: "Headless TypeScript ORM",
        version: "^0.45.2",
        icon: "drizzle",
        link: "https://orm.drizzle.team/",
      },
      {
        name: "Neon PostgreSQL",
        role: "Serverless Database",
        version: "Serverless",
        icon: "postgres",
        link: "https://neon.tech/",
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
