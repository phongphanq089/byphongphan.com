import type { RegistryItem } from "./schema"

export const REGISTRY_HOOKS: RegistryItem[] = [
  {
    name: "use-click-outside",
    title: "useClickOutside",
    description: "Detects clicks outside of a target element.",
    type: "registry:hook",
    category: "ui-interaction",
    schematicType: "click-outside",
    dependencies: [],
    registryDependencies: [],
    isNew: true,
    files: [
      {
        path: "hooks/use-click-outside.ts",
        type: "registry:hook",
        target: "hooks/use-click-outside.ts",
      },
    ],
  },
  {
    name: "use-media-query",
    title: "useMediaQuery",
    description: "Listens for media query changes and returns a boolean.",
    type: "registry:hook",
    category: "browser",
    schematicType: "media-query",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "hooks/use-media-query.ts",
        type: "registry:hook",
        target: "hooks/use-media-query.ts",
      },
    ],
  },
  {
    name: "use-copy-to-clipboard",
    title: "useCopyToClipboard",
    description: "Copies text to clipboard with feedback.",
    type: "registry:hook",
    category: "utilities",
    schematicType: "copy-to-clipboard",
    dependencies: [],
    registryDependencies: [],
    isNew: true,
    files: [
      {
        path: "hooks/use-copy-to-clipboard.ts",
        type: "registry:hook",
        target: "hooks/use-copy-to-clipboard.ts",
      },
    ],
  },
  {
    name: "use-intersection-observer",
    title: "useIntersectionObserver",
    description: "Triggers when an element enters or leaves the viewport.",
    type: "registry:hook",
    category: "performance",
    schematicType: "intersection-observer",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "hooks/use-intersection-observer.ts",
        type: "registry:hook",
        target: "hooks/use-intersection-observer.ts",
      },
    ],
  },
  {
    name: "use-debounce",
    title: "useDebounce",
    description: "Debounces a value or function for better performance.",
    type: "registry:hook",
    category: "utilities",
    schematicType: "debounce",
    dependencies: [],
    registryDependencies: [],
    isNew: true,
    files: [
      {
        path: "hooks/use-debounce.ts",
        type: "registry:hook",
        target: "hooks/use-debounce.ts",
      },
    ],
  },
  {
    name: "use-local-storage",
    title: "useLocalStorage",
    description: "Syncs state with localStorage across browser sessions.",
    type: "registry:hook",
    category: "browser",
    schematicType: "local-storage",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "hooks/use-local-storage.ts",
        type: "registry:hook",
        target: "hooks/use-local-storage.ts",
      },
    ],
  },
  {
    name: "use-toggle",
    title: "useToggle",
    description: "Toggles a boolean state value with memoized handlers.",
    type: "registry:hook",
    category: "state",
    schematicType: "toggle",
    dependencies: [],
    registryDependencies: [],
    isNew: true,
    files: [
      {
        path: "hooks/use-toggle.ts",
        type: "registry:hook",
        target: "hooks/use-toggle.ts",
      },
    ],
  },
  {
    name: "use-previous",
    title: "usePrevious",
    description: "Stores previous value of a state or prop across renders.",
    type: "registry:hook",
    category: "state",
    schematicType: "previous",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: "hooks/use-previous.ts",
        type: "registry:hook",
        target: "hooks/use-previous.ts",
      },
    ],
  },
]
