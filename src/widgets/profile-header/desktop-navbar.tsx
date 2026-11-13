import { GooeyNavbar, type GooeyNavbarProps } from "./gooey-navbar"

export type DesktopNavbarProps = GooeyNavbarProps
export const DesktopNavbar = GooeyNavbar

// Backward-compatible aliases
export const FlashlightNavbar = GooeyNavbar
export type FlashlightNavbarProps = GooeyNavbarProps
export const SpotlightNavbar = GooeyNavbar
export type SpotlightNavbarProps = GooeyNavbarProps

export default DesktopNavbar
