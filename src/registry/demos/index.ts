import type { ComponentType } from "react"

import { COMPONENT_DEMOS } from "./components"
import { HOOK_DEMOS } from "./hooks"

export * from "./components"
export * from "./hooks"

export const REGISTRY_DEMOS: Record<string, ComponentType> = {
  ...COMPONENT_DEMOS,
  ...HOOK_DEMOS,
}
