import {
  useMemo,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react"

import { cn } from "@/shared/lib/utils"

import { GlassLayer, type GlassMaterial, type GlassOptics } from "./glass-layer"

export type GlassCardProps = {
  children?: ReactNode
  /** Glass look. Default `clear`: frosts and bends what is behind. `tinted` takes the card's own background colour. */
  material?: GlassMaterial
  /** Clear glass: how much tint covers the backdrop (0-1, default 0.7): white on a light page, black on a dark one. */
  tint?: number
  /** Clear glass: how much the backdrop is frosted, in px like CSS `blur()` (default 5). `0` shows it sharp. */
  blur?: number
  /** Repaint the backdrop every frame, for content that moves behind the card. It then draws while on screen. */
  live?: boolean
  /** Fine-tuning of the glass: tint colour, a rim line, frost mix, bend, light and shadow. Merged over the card's own. */
  optics?: GlassOptics
  className?: string
} & Omit<ComponentProps<"div">, "children" | "className">

const CARD_OPTICS: GlassOptics = {
  bendMode: "radial",
  borderColor: "#ffffff",
  borderAlpha: 0.6,
  borderWidth: 1.3,
  frostMix: 1,
  frostEdge: 1,
  saturation: 1,
  refraction: 1,
  bendDepth: 1.35,
  bendCurve: 9.75,
  dispersion: 0,
  magnify: 0,
  light: 0,
  cursorLight: false,
  shadow: 0,
}

const SHADOW =
  "0 16.5px 36px rgba(0, 0, 0, 0.08), 0 26.4px 55.9px rgba(0, 0, 0, 0.08)"
const TINT = 0.7
const DARK_BORDER_ALPHA = 0.25
const BLUR = 5

const fallback: Record<GlassMaterial, string> = {
  clear:
    "border border-white/60 bg-white/(--glass-card-tint) text-neutral-900 backdrop-blur-(--glass-card-blur) dark:border-white/25 dark:bg-black/(--glass-card-tint) dark:text-white data-[glass-tone=dark]:text-white data-[glass-tone=light]:text-neutral-900",
  tinted: "",
}

export function GlassCard({
  children,
  material = "clear",
  tint = TINT,
  blur = BLUR,
  live = false,
  optics,
  className = "",
  style,
  ...rest
}: GlassCardProps) {
  const corners = /(^|\s)!?rounded-/.test(className) ? "" : "rounded-[28px]"
  const look = {
    "--glass-card-tint": `${Math.min(1, Math.max(0, tint)) * 100}%`,
    "--glass-card-blur": `${Math.max(0, blur)}px`,
  } as CSSProperties

  const glass = useMemo<GlassOptics>(
    () => ({
      ...CARD_OPTICS,
      ...optics,
      dark: {
        borderAlpha: optics?.borderAlpha ?? DARK_BORDER_ALPHA,
        ...optics?.dark,
      },
    }),
    [optics]
  )

  return (
    <div
      data-glass-host=""
      className={cn(corners, fallback[material], className)}
      style={{ ...look, ...style }}
      {...rest}
    >
      <GlassLayer
        material={material}
        tint={tint}
        blur={blur}
        live={live}
        swell={false}
        optics={glass}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ zIndex: -2, boxShadow: SHADOW }}
      />
      {children}
    </div>
  )
}

export default GlassCard
