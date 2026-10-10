import { BLOCK_FILTER_TABS } from "@/shared/config"

import type { BlockItem } from "./types"

export const BLOCK_CATEGORIES = BLOCK_FILTER_TABS

export const BLOCKS_DATA: BlockItem[] = [
  {
    id: "block-not-found-01",
    title: "Not Found 01",
    slug: "not-found-01",
    category: "application",
    description: "A 404 page with a playable brick breaker game.",
  },
  {
    id: "block-not-found-02",
    title: "Not Found 02",
    slug: "not-found-02",
    category: "application",
    description:
      "Interactive 404 error page with 2D physics gravity, falling blocks, and draggable elements.",
  },
  {
    id: "block-editor",
    title: "Rich Text Editor",
    slug: "editor",
    category: "application",
    description:
      "Modern Lexical rich text editor featuring top toolbar, floating bubble menu, slash commands, markdown shortcuts, and interactive widgets.",
  },
]
