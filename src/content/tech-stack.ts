import type { IconName } from "@/shared/ui/icons"

export type TechStackItem = {
  label: string
  icon: IconName
  link: string
  category?: "frontend" | "backend" | "database" | "tools" | "styling"
}

export const TECH_STACK: TechStackItem[] = [
  {
    label: "TypeScript",
    icon: "typescript",
    link: "https://www.typescriptlang.org/",
    category: "frontend",
  },
  {
    label: "JavaScript",
    icon: "javascript",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    category: "frontend",
  },
  {
    label: "React",
    icon: "react",
    link: "https://react.dev/",
    category: "frontend",
  },
  {
    label: "Next.js",
    icon: "nextjs",
    link: "https://nextjs.org/",
    category: "frontend",
  },
  {
    label: "TailwindCSS",
    icon: "tailwind",
    link: "https://tailwindcss.com/",
    category: "styling",
  },
  {
    label: "Node.js",
    icon: "node",
    link: "https://nodejs.org/",
    category: "backend",
  },
  {
    label: "Vite",
    icon: "vite",
    link: "https://vite.dev/",
    category: "tools",
  },
  {
    label: "Zustand",
    icon: "zustand",
    link: "https://zustand-demo.pmnd.rs/",
    category: "frontend",
  },
  {
    label: "TanStack",
    icon: "tanstack",
    link: "https://tanstack.com/",
    category: "frontend",
  },
  {
    label: "Motion",
    icon: "motion",
    link: "https://motion.dev/",
    category: "styling",
  },
  {
    label: "shadcn/ui",
    icon: "shadcnui",
    link: "https://ui.shadcn.com/",
    category: "styling",
  },
  {
    label: "NestJS",
    icon: "nestjs",
    link: "https://nestjs.com/",
    category: "backend",
  },
  {
    label: "Fastify",
    icon: "fastify",
    link: "https://fastify.dev/",
    category: "backend",
  },
  {
    label: "PostgreSQL",
    icon: "postgres",
    link: "https://www.postgresql.org/",
    category: "database",
  },
  {
    label: "MongoDB",
    icon: "mongodb",
    link: "https://www.mongodb.com/",
    category: "database",
  },
  {
    label: "Material UI",
    icon: "materialui",
    link: "https://mui.com/",
    category: "styling",
  },
  {
    label: "Refine",
    icon: "refine",
    link: "https://refine.dev/",
    category: "frontend",
  },
  {
    label: "Sanity",
    icon: "sanity",
    link: "https://www.sanity.io/",
    category: "backend",
  },
  {
    label: "GitHub",
    icon: "github",
    link: "https://github.com/",
    category: "tools",
  },
  {
    label: "11ty",
    icon: "ElevenTy",
    link: "https://www.11ty.dev/",
    category: "frontend",
  },
  {
    label: "React Navigation",
    icon: "reactnavigation",
    link: "https://reactnavigation.org/",
    category: "frontend",
  },
]
