import { siteConfig } from "@/shared/config"

import type {
  ColophonColorToken,
  ColophonFontSpecimen,
  ColophonInspirationItem,
  ColophonSystemSpec,
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
        name: "Sanity Studio v5",
        role: "Embedded Headless CMS",
        version: "^5.18",
        icon: "sanity",
        link: "https://www.sanity.io/",
      },
      {
        name: "Neon PostgreSQL",
        role: "Serverless Database & Drizzle",
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
    role: "Technical Coordinates, Code & Metadata",
    foundry: "Vercel / Guillermo Rauch",
    format: "Variable Font (WOFF2)",
    weights: ["Regular (400)", "Medium (500)", "SemiBold (600)", "Bold (700)"],
    previewText:
      "const engineer = { craft: true, precision: 1.0, oklch: true };",
    sampleGlyphs: "ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 {}[]()=>#%&*",
    cssFamily: "var(--font-mono)",
    cssClass: "font-mono",
    badge: "MONOSPACE",
  },
  {
    name: "Inter / System Sans",
    role: "Editorial Headings, Navigation & Body Copy",
    foundry: "Rasmus Andersson / System UI",
    format: "Modern OpenType / Native System",
    weights: ["Light (300)", "Regular (400)", "Medium (500)", "Bold (700)"],
    previewText:
      "Design is not just what it looks like and feels like. Design is how it works.",
    sampleGlyphs:
      "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz",
    cssFamily: "var(--font-sans)",
    cssClass: "font-sans",
    badge: "SANS-SERIF",
  },
  {
    name: "Playfair Display",
    role: "Selective Editorial Accents & Quotations",
    foundry: "Claus Eggers Sørensen",
    format: "Google Fonts Variable",
    weights: ["Regular (400)", "Italic (400i)", "Bold (700)"],
    previewText:
      "Crafting interfaces that bridge technology and human curiosity.",
    sampleGlyphs: "“High Craft Digital Portfolio & Engineering Playground”",
    cssFamily: "var(--font-serif)",
    cssClass: "font-serif",
    badge: "SERIF ACCENT",
  },
]

export const COLOPHON_COLOR_TOKENS: ColophonColorToken[] = [
  {
    name: "Primary Signal Red",
    variable: "--pp-primary",
    oklchDark: "oklch(0.985 0 0)",
    oklchLight: "oklch(0.141 0.005 285.8)",
    description:
      "Signature accent color used for focal highlights, active tabs, and coordinates.",
    category: "brand",
  },
  {
    name: "Obsidian Canvas",
    variable: "--background",
    oklchDark: "oklch(0.12 0 0)",
    oklchLight: "oklch(1 0 0)",
    description:
      "Deep carbon backdrop engineered for minimal eye fatigue and high border contrast.",
    category: "surface",
  },
  {
    name: "Elevated Surface",
    variable: "--card / --secondary",
    oklchDark: "oklch(0.20 0 0)",
    oklchLight: "oklch(0.97 0 0)",
    description:
      "Subtle luminous cards maintaining 1:1 elevation against the backdrop.",
    category: "surface",
  },
  {
    name: "Technical Blueprint Border",
    variable: "--border",
    oklchDark: "oklch(1 0 0 / 12%)",
    oklchLight: "oklch(0.90 0 0)",
    description:
      "Precision 1px structural dividing lines accompanied by crosshairs.",
    category: "blueprint",
  },
]

export const COLOPHON_INSPIRATIONS: ColophonInspirationItem[] = [
  ...siteConfig.inspirations,
]

export const COLOPHON_SYSTEM_SPECS: ColophonSystemSpec[] = [
  {
    category: "Environment & Hosting",
    specs: [
      {
        property: "Platform",
        value: "Netlify Edge CDN",
        note: "Global distributed edge network",
      },
      {
        property: "SSR / Prerendering",
        value: "TanStack Start Static Export",
        note: "Lightning fast TTFB",
      },
      {
        property: "Package Manager",
        value: "pnpm 11.17",
        note: "Fast, disk space efficient",
      },
      {
        property: "Node Runtime",
        value: "Node.js 22 LTS",
        note: "Modern ECMAScript modules",
      },
    ],
  },
  {
    category: "Engineering Quality",
    specs: [
      {
        property: "Type Checking",
        value: "TypeScript Strict (Zero `any`)",
        note: "tsc -b --noEmit",
      },
      {
        property: "Linting & Formatting",
        value: "ESLint 9 + Prettier",
        note: "Automated Git hooks via Husky",
      },
      {
        property: "Component Typing",
        value: "Pure Named Functions",
        note: "Zero React.FC anti-pattern",
      },
      {
        property: "Theme Switching",
        value: "Instant LocalStorage + Zero FOUC",
        note: "Inline hydration script",
      },
    ],
  },
  {
    category: "Repository & License",
    specs: [
      {
        property: "Source Code",
        value: "phongphanq089/phong-dev-portfiolio",
        link: "https://github.com/phongphanq089/phong-dev-portfiolio",
      },
      {
        property: "Copyright",
        value: `© ${new Date().getFullYear()} Phong Phan`,
        note: "All rights reserved",
      },
      {
        property: "Location",
        value: "Viet Nam (GMT+7)",
        note: "Crafted with passion & precision",
      },
    ],
  },
]
