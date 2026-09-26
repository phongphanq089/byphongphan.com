export type BlockCategoryId = "all" | "marketing" | "application" | "ecommerce"

export interface BlockCategory {
  id: BlockCategoryId
  label: string
  count?: number
}

export type BlockSchematicType =
  | "not-found-brick"
  | "social-proof-logos"
  | "social-links-grid"
  | "benefits-alternating"
  | "benefits-cards"
  | "hero-marketing"
  | "pricing-matrix"
  | "dashboard-overview"
  | "feature-grid"
  | "cta-banner"
  | "testimonial-cards"
  | "product-grid"
  | "faq-accordion"
  | "stats-metrics"

/** Represents a single source file within a block */
export interface BlockFile {
  /** Display path shown in the file tree (e.g. "app/not-found.tsx") */
  path: string
  /** Target path for user's project when installed via CLI */
  target?: string
}

export interface BlockItem {
  id: string
  title: string
  slug: string
  category: "marketing" | "application" | "ecommerce"
  description: string
  isPro?: boolean
  schematicType: BlockSchematicType
  badge?: string
  /**
   * List of source files composing this block.
   * Raw code is auto-loaded via Vite `import.meta.glob(?raw)`.
   */
  files?: BlockFile[]
}

/** Runtime-resolved block file with raw source code loaded */
export interface ResolvedBlockFile {
  /** Display path (e.g. "components/daikanoid/ball.ts") */
  path: string
  /** Base filename for display in the file tree */
  name: string
  /** Raw source code string */
  code: string
}

/** Tree node for rendering the file explorer sidebar */
export type FileTreeNode =
  | {
      type: "file"
      name: string
      path: string
    }
  | {
      type: "folder"
      name: string
      children: FileTreeNode[]
    }
