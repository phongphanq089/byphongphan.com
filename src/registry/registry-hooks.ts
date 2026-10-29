import type { RegistryItem } from "./schema"

export const REGISTRY_HOOKS: RegistryItem[] = [
  {
    name: "use-media-query",
    title: "useMediaQuery",
    description:
      "React hook for responsive design and media query listening with SSR support.",
    type: "registry:hook",
    category: "interactive",
    dependencies: [],
    registryDependencies: [],
    isNew: true,
    files: [
      {
        path: "hooks/use-media-query.ts",
        type: "registry:hook",
        target: "hooks/use-media-query.ts",
      },
    ],
  },
]
