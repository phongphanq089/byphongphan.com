import { PageHero } from "@/shared/ui/system"

import type { HookCategoryIdWithAll } from "../types"

interface HookHeroProps {
  category?: HookCategoryIdWithAll
  totalCount?: number
}

const CATEGORY_HERO_CONFIG: Record<
  string,
  {
    badge: string
    title: string
    description: string
    stats: { label: string; highlight?: boolean; hideOnMobile?: boolean }[]
  }
> = {
  state: {
    badge: "State & Storage",
    title: "Reactive primitives & persistent stores.",
    description:
      "Modern hooks for synchronized local storage, boolean state machines, and render tracking.",
    stats: [
      { label: "PERSISTENT SYNC" },
      { label: "MEMOIZED HANDLERS" },
      { label: "SSR SAFE", hideOnMobile: true },
    ],
  },
  "ui-interaction": {
    badge: "UI & Interaction",
    title: "Pointer events & DOM boundary detection.",
    description:
      "Outside click dismissal, keyboard navigation, and gesture coordination.",
    stats: [
      { label: "OUTSIDE CLICK" },
      { label: "CLEANUP SAFE" },
      { label: "TOUCH & MOUSE", hideOnMobile: true },
    ],
  },
  browser: {
    badge: "Browser APIs",
    title: "Responsive media queries & platform adapters.",
    description:
      "Native matchMedia observers, window dimension syncing, and client-side capabilities.",
    stats: [
      { label: "MATCHMEDIA" },
      { label: "USE_SYNC_EXTERNAL_STORE" },
      { label: "ZERO HYDRATION MISMATCH", hideOnMobile: true },
    ],
  },
  performance: {
    badge: "Performance",
    title: "Viewport intersection & render throttling.",
    description:
      "Hardware-accelerated intersection observers, lazy triggering, and frame optimization.",
    stats: [
      { label: "INTERSECTION OBSERVER" },
      { label: "60 FPS" },
      { label: "PASSIVE LISTENERS", hideOnMobile: true },
    ],
  },
  utilities: {
    badge: "Utilities",
    title: "Clipboard commands & debounce timers.",
    description:
      "Reactive debounce delay controllers, clipboard write feedback, and developer ergonomics.",
    stats: [
      { label: "DEBOUNCE TIMER" },
      { label: "CLIPBOARD FEEDBACK" },
      { label: "AUTO CLEANUP", hideOnMobile: true },
    ],
  },
}

export function HookHero({ category = "all", totalCount = 8 }: HookHeroProps) {
  if (category !== "all" && CATEGORY_HERO_CONFIG[category]) {
    const config = CATEGORY_HERO_CONFIG[category]
    return (
      <PageHero
        badge={config.badge}
        count={`${totalCount} ${totalCount === 1 ? "HOOK" : "HOOKS"}`}
        title={config.title}
        description={config.description}
        stats={[
          {
            label: `${totalCount} ${category.toUpperCase()} ${totalCount === 1 ? "HOOK" : "HOOKS"}`,
            highlight: true,
          },
          ...config.stats,
        ]}
      />
    )
  }

  return (
    <PageHero
      badge="Hook Registry"
      count={`${totalCount} HOOKS`}
      title="Reactive primitives & custom logic."
      description="A collection of production-grade React hooks with TypeScript safety, SSR support, and live interactive previews."
      stats={[
        { label: `${totalCount} REGISTERED HOOKS`, highlight: true },
        { label: "3-COLUMN BLUEPRINT" },
        { label: "SSR COMPATIBLE" },
        { label: "REACT 19 READY", hideOnMobile: true },
      ]}
    />
  )
}
