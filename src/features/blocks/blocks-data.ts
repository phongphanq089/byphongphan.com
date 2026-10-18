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
  },
  {
    id: "block-not-found-02",
    title: "Not Found 02",
    slug: "not-found-02",
    category: "404-page",
    description:
      "Interactive 404 error page with 2D physics gravity, falling blocks, and draggable elements.",
    schematicType: "not-found-02",
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
]
