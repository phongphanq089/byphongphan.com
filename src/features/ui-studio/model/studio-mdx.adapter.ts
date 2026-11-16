import type { MDXComponents } from "mdx/types"
import type React from "react"

import { mdxComponents } from "@/features/component-ui/components/mdx-components"

import type { StudioItem } from "./types"
import {
  getRawRegistrySource,
  getStudioSourceFiles,
} from "./unified-registry.adapter"

export interface StudioMdxFrontmatter {
  title?: string
  description?: string
  badge?: string
  links?: {
    doc?: string
    api?: string
  }
}

export interface StudioMdxData {
  Component: React.ComponentType<{ components?: MDXComponents }>
  frontmatter?: StudioMdxFrontmatter
  rawMdxContent: string | null
}

export interface StudioResolvedFile {
  /** Raw registry path relative to `src/registry/` (or variant path). */
  path: string
  /** Basename for compact tab display. */
  name: string
  code: string
  isVariant: boolean
  variantId?: string
}

interface MdxModuleExport {
  default: React.ComponentType<{
    components?: MDXComponents
  }>
  frontmatter?: StudioMdxFrontmatter
}

const componentModules = import.meta.glob<MdxModuleExport>(
  "../../../content/components/*.mdx",
  { eager: true }
)

const hookModules = import.meta.glob<MdxModuleExport>(
  "../../../content/hooks/*.mdx",
  { eager: true }
)

const rawComponentModules = import.meta.glob<string>(
  "../../../content/components/*.mdx",
  { query: "?raw", import: "default", eager: true }
)

const rawHookModules = import.meta.glob<string>(
  "../../../content/hooks/*.mdx",
  { query: "?raw", import: "default", eager: true }
)

// MDX docs are keyed by file name, e.g. `drawer.mdx` matches the `drawer` slug.
function findBySlug<T>(
  modules: Record<string, T>,
  slug: string
): T | undefined {
  const match = Object.keys(modules).find((filePath) => {
    const cleanPath = filePath.replace(/\?.*$/, "")
    return cleanPath.endsWith(`/${slug}.mdx`)
  })
  return match ? modules[match] : undefined
}

/**
 * Load the MDX module (component + frontmatter) for a studio item, if one
 * exists. Blocks have no MDX docs — returns null so callers can fall back.
 */
export function getStudioMdxData(slug: string): StudioMdxData | null {
  const module =
    findBySlug(componentModules, slug) ?? findBySlug(hookModules, slug)
  if (!module) return null

  const raw =
    findBySlug(rawComponentModules, slug) ?? findBySlug(rawHookModules, slug)

  return {
    Component: module.default,
    frontmatter: module.frontmatter,
    rawMdxContent: typeof raw === "string" ? raw : null,
  }
}

/**
 * MDX wiring for the studio docs panel: identical to the site-wide docs
 * components, except `ComponentPreview` renders nothing (the interactive
 * preview lives on the stage next to the panel).
 */
export const studioMdxComponents: MDXComponents = {
  ...mdxComponents,
  ComponentPreview: () => null,
}

const VARIANT_PATH_PREFIX = "variants/"

/**
 * Resolve every source file a studio item ships: the main file, any helper
 * files, and one file per registered variant (`registry/variants/{slug}/{id}.tsx`).
 */
export function getStudioResolvedFiles(item: StudioItem): StudioResolvedFile[] {
  const main = getStudioSourceFiles(item).map((file) => ({
    path: file.path,
    name: file.name,
    code: file.code,
    isVariant: false,
  }))

  const variants = (item.variants ?? [])
    .map((variant): StudioResolvedFile | null => {
      const path = `${VARIANT_PATH_PREFIX}${item.slug}/${variant.id}.tsx`
      const code = getRawRegistrySource(path)
      if (!code) return null
      return {
        path,
        name: `${variant.id}.tsx`,
        code,
        isVariant: true,
        variantId: variant.id,
      }
    })
    .filter((file): file is StudioResolvedFile => file !== null)

  return [...main, ...variants]
}
