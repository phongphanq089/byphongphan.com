import { siteConfig } from "@/shared/config"

import type {
  ColophonColorToken,
  ColophonFontSpecimen,
  ColophonInspirationItem,
  ColophonSpacingToken,
  ColophonTechCategory,
} from "./types"

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
        highlight: true,
      },
      {
        name: "TypeScript",
        role: "Type System & Safety",
        version: "5.7+",
        icon: "typescript",
        link: "https://www.typescriptlang.org/",
        highlight: true,
      },
      {
        name: "Vite 8",
        role: "Build Tool & Bundler",
        version: "^8.0",
        icon: "vite",
        link: "https://vite.dev/",
        highlight: true,
      },
      {
        name: "TanStack Router & Start",
        role: "File Routing & SSR",
        version: "1.168",
        icon: "tanstack",
        link: "https://tanstack.com/router",
        highlight: true,
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
        highlight: true,
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
        role: "headless TypeScript ORM",
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
    name: "Geist Mono",
    role: "Code, metadata & technical labels",
    foundry: "Vercel",
    format: "Variable WOFF2",
    weights: ["400", "500", "600", "700"],
    previewText: "const craft = { precision: 1.0 };",
    sampleGlyphs: "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789",
    cssFamily: "var(--font-mono)",
    cssClass: "font-mono",
    badge: "MONOSPACE",
  },
  {
    name: "Inter / System Sans",
    role: "Headings, navigation & body copy",
    foundry: "Rasmus Andersson",
    format: "System UI",
    weights: ["300", "400", "500", "700"],
    previewText: "Design is how it works.",
    sampleGlyphs: "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm",
    cssFamily: "var(--font-sans)",
    cssClass: "font-sans",
    badge: "SANS-SERIF",
  },
  {
    name: "Playfair Display",
    role: "Editorial accents & quotations",
    foundry: "Claus Eggers Sørensen",
    format: "Google Fonts Variable",
    weights: ["400", "400i", "700"],
    previewText: "Bridging technology and curiosity.",
    sampleGlyphs: '"High Craft Portfolio & Playground"',
    cssFamily: "var(--font-serif)",
    cssClass: "font-serif",
    badge: "SERIF",
  },
]

export const COLOPHON_COLOR_TOKENS: ColophonColorToken[] = [
  {
    name: "PP Primary",
    variable: "--pp-primary",
    swatchColor: "oklch(0.985 0 0)",
    oklchDark: "oklch(0.985 0 0)",
    oklchLight: "oklch(0.141 0.005 285.8)",
    description: "Main brand signature accent",
    category: "brand",
  },
  {
    name: "Background",
    variable: "--background",
    swatchColor: "oklch(0.12 0 0)",
    oklchDark: "oklch(0.12 0 0)",
    oklchLight: "oklch(1 0 0)",
    description: "App backdrop",
    category: "surface",
  },
  {
    name: "Accent",
    variable: "--accent",
    swatchColor: "oklch(0.25 0 0)",
    oklchDark: "oklch(0.25 0 0)",
    oklchLight: "oklch(0.97 0 0)",
    description: "Interactive hover",
    category: "surface",
  },
  {
    name: "Border",
    variable: "--border",
    swatchColor: "oklch(1 0 0 / 12%)",
    oklchDark: "oklch(1 0 0 / 12%)",
    oklchLight: "oklch(0.9 0 0)",
    description: "Separators & borders",
    category: "blueprint",
  },
]

export const COLOPHON_SPACING_TOKENS: ColophonSpacingToken[] = [
  {
    name: "Base Radius",
    variable: "--radius",
    value: "0.75rem",
    description: "Default border radius",
  },
  {
    name: "Radius SM",
    variable: "--radius-sm",
    value: "calc(var(--radius) - 4px)",
    description: "Small elements",
  },
  {
    name: "Radius MD",
    variable: "--radius-md",
    value: "calc(var(--radius) - 2px)",
    description: "Medium elements",
  },
  {
    name: "Radius LG",
    variable: "--radius-lg",
    value: "var(--radius)",
    description: "Cards & containers",
  },
  {
    name: "Radius XL",
    variable: "--radius-xl",
    value: "calc(var(--radius) + 4px)",
    description: "Large containers",
  },
]

export const COLOPHON_INSPIRATIONS: ColophonInspirationItem[] = [
  ...siteConfig.inspirations,
]
