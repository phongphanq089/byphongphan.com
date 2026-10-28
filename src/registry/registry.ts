import { REGISTRY_BLOCKS } from "./registry-blocks"
import { REGISTRY_COMPONENTS } from "./registry-components"
import type { RegistryItem } from "./schema"

export * from "./registry-blocks"
export * from "./registry-components"

export const REGISTRY_ITEMS: RegistryItem[] = [
  ...REGISTRY_COMPONENTS,
  ...REGISTRY_BLOCKS,
]
