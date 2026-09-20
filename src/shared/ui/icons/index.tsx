import React from "react"

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
}

// Import individual icon components
import { ElevenTy } from "./11ty"
import { Code } from "./code"
import { External } from "./external"
import { Fastify } from "./fastify"
import { GitHub } from "./github"
import { JavaScript } from "./javascript"
import { MaterialUI } from "./material-ui"
import { MongoDB } from "./mongodb"
import { Motion } from "./motion"
import { NestJS } from "./nestjs"
import { NextJS } from "./nextjs"
import { NodeJS } from "./node"
import { PostgreSQL } from "./postgres"
import { PPPixelMark } from "./pp-pixel-mark"
import { ReactIcon } from "./react"
import { ReactNavigation } from "./react-navigation"
import { Refine } from "./refine"
import { Sanity } from "./sanity"
import { ShadcnUI } from "./shadcn-ui"
import { Tailwind } from "./tailwind"
import { Tanstack } from "./tanstack"
import { TypeScript } from "./typescript"
import { Vite } from "./vite"
import { Zustand } from "./zustand"

export {
  Code,
  ElevenTy,
  External,
  Fastify,
  GitHub,
  JavaScript,
  MaterialUI,
  MongoDB,
  Motion,
  NestJS,
  NextJS,
  NodeJS,
  PostgreSQL,
  PPPixelMark,
  ReactIcon,
  ReactNavigation,
  Refine,
  Sanity,
  ShadcnUI,
  Tailwind,
  Tanstack,
  TypeScript,
  Vite,
  Zustand,
}

export const iconComponents = {
  github: GitHub,
  react: ReactIcon,
  ElevenTy: ElevenTy,
  typescript: TypeScript,
  javascript: JavaScript,
  tailwind: Tailwind,
  nextjs: NextJS,
  node: NodeJS,
  postgres: PostgreSQL,
  mongodb: MongoDB,
  external: External,
  code: Code,
  zustand: Zustand,
  tanstack: Tanstack,
  reactnavigation: ReactNavigation,
  motion: Motion,
  shadcnui: ShadcnUI,
  nestjs: NestJS,
  fastify: Fastify,
  materialui: MaterialUI,
  refine: Refine,
  sanity: Sanity,
  vite: Vite,
} as const

export type IconName = keyof typeof iconComponents

export interface RenderIconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName
  size?: number | string
}

export const RenderIcon = ({
  name,
  size = 24,
  className,
  ...props
}: RenderIconProps) => {
  const IconComponent = iconComponents[name]
  if (!IconComponent) return null

  return <IconComponent size={size} className={className} {...props} />
}

export default RenderIcon
