import { BLOCK_FILTER_TABS } from "@/shared/config"

import type { BlockItem } from "./types"

export const BLOCK_CATEGORIES = BLOCK_FILTER_TABS

export const BLOCKS_DATA: BlockItem[] = [
  {
    id: "block-not-found-01",
    title: "Not Found 01",
    slug: "not-found-01",
    category: "404-page",
    description: "A 404 page with a playable brick breaker game.",
    schematicType: "not-found-01",
    isNew: true,
  },
  {
    id: "block-not-found-02",
    title: "Not Found 02",
    slug: "not-found-02",
    category: "404-page",
    description:
      "Interactive 404 error page with 2D physics gravity, falling blocks, and draggable elements.",
    schematicType: "not-found-02",
    isNew: true,
  },
  {
    id: "block-not-found-03",
    title: "Not Found Pixel Trail",
    slug: "not-found-03",
    category: "404-page",
    description:
      "Interactive 404 digital void experience featuring dynamic cursor pixel trails and terminal status diagnostics.",
    schematicType: "not-found-03",
    isNew: true,
  },
  {
    id: "block-login-01",
    title: "Login 01",
    slug: "login-01",
    category: "auth",
    description:
      "Split-screen modern authentication screen with photography hero, tracked typography, and full dark mode support.",
    schematicType: "login-01",
    isNew: true,
  },
  {
    id: "block-stats-cards-01",
    title: "Stats Cards 01",
    slug: "stats-cards-01",
    category: "marketing",
    description:
      "Overlapping interactive marketing stats cards with spring physics hover, metrics showcase, and dark mode support.",
    schematicType: "stats-cards-01",
    isNew: true,
  },
  {
    id: "block-koi-background",
    title: "Koi Background",
    slug: "koi-background",
    category: "marketing",
    description:
      "Interactive ambient koi pond background surface featuring fluid dynamics, water caustics, multi-joint fish flocking, and mouse-feeding mechanics.",
    schematicType: "koi-background",
    isNew: true,
  },
]
