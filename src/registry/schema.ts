export type RegistryType =
  | "registry:ui"
  | "registry:component"
  | "registry:hook"
  | "registry:block"
  | "registry:lib"

export interface RegistryFile {
  path: string
  content?: string
  type: RegistryType
  target?: string
}

export interface RegistryItem {
  name: string
  title: string
  description: string
  type: RegistryType
  author?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
  tailwind?: {
    config?: Record<string, unknown>
  }
  cssVars?: {
    light?: Record<string, string>
    dark?: Record<string, string>
  }
  meta?: Record<string, unknown>
}
