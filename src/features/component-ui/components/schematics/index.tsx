/**
 * Component schematics are defined modularly alongside registry definitions in `@/registry/schematics`.
 * This file re-exports them for backwards compatibility with features/component-ui consumers.
 */
export type { CategoryBackgroundSchematicProps } from "./category-background-schematic"
export { CategoryBackgroundSchematic } from "./category-background-schematic"
export type { CategoryCardSchematicProps } from "./category-card-schematic"
export { CategoryCardSchematic } from "./category-card-schematic"
export type { CategoryDataDisplaySchematicProps } from "./category-data-display-schematic"
export { CategoryDataDisplaySchematic } from "./category-data-display-schematic"
export type { CategoryInteractiveSchematicProps } from "./category-interactive-schematic"
export { CategoryInteractiveSchematic } from "./category-interactive-schematic"
export type { CategoryNavigationSchematicProps } from "./category-navigation-schematic"
export { CategoryNavigationSchematic } from "./category-navigation-schematic"
export type { CategoryTextSchematicProps } from "./category-text-schematic"
export { CategoryTextSchematic } from "./category-text-schematic"
export type { RenderComponentCategorySchematicProps } from "./render-category-schematic"
export { RenderComponentCategorySchematic } from "./render-category-schematic"
export * from "@/registry/schematics"
