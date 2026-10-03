import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import SplitText from "gsap/SplitText"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/shared/lib/utils"

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, useGSAP)
}

export interface TextBurnNeonProps {
  children: string
  className?: string
  duration?: number
  repeat?: boolean
  /** Custom hex color. If provided, overrides dark and light defaults (e.g. "#ffffff", "#dc2626") */
  color?: string
  /** Hex color for dark mode (defaults to "#ffffff") */
  darkColor?: string
  /** Hex color for light mode (defaults to "#09090b") */
  lightColor?: string
  /** Optional custom glow hex color. Defaults to the active text hex color */
  glowColor?: string
}

/** Converts a 3 or 6 digit hex color (#fff, #ffffff) into { r, g, b } */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "").trim()
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean

  const num = parseInt(full, 16)
  if (isNaN(num)) return { r: 255, g: 255, b: 255 }

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return true
    return document.documentElement.classList.contains("dark")
  })

  useEffect(() => {
    const update = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === "class") {
          update()
        }
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  return isDark
}

export default function TextBurnNeon({
  children,
  className = "",
  duration = 2,
  repeat = true,
  color,
  darkColor = "#ffffff",
  lightColor = "#09090b",
  glowColor,
}: TextBurnNeonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const isDark = useIsDark()

  useGSAP(
    () => {
      if (!textRef.current || !containerRef.current) return

      const activeHex = color || (isDark ? darkColor : lightColor)
      const activeGlowHex = glowColor || activeHex

      const { r, g, b } = hexToRgb(activeHex)
      const glow = hexToRgb(activeGlowHex)

      const primaryColor = `rgb(${r}, ${g}, ${b})`
      const dimColor = `rgba(${r}, ${g}, ${b}, 0.3)`
      const coreColor = isDark ? "#ffffff" : primaryColor

      // Multi-layer neon shadows
      const peakShadow = isDark
        ? `0 0 10px #ffffff, 0 0 20px rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.9), 0 0 40px rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.65), 0 0 70px rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.35)`
        : `0 0 10px rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.5), 0 0 20px rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.25)`

      const settleShadow = isDark
        ? `0 0 8px #ffffff, 0 0 18px rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.6), 0 0 35px rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.3)`
        : `0 0 8px rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.3)`

      const restingShadow = isDark
        ? `0 0 8px rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.4), 0 0 16px rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.15)`
        : "0 0 0px transparent"

      const split = new SplitText(textRef.current, {
        type: "chars, words",
      })
      const chars = split.chars.filter((char) =>
        Boolean(char.textContent?.trim())
      )

      const timeScale = Math.max(0.3, duration / 2)

      const masterTl = gsap.timeline({
        repeat: repeat ? -1 : 0,
        repeatDelay: 1.2,
      })

      masterTl.set(chars, {
        opacity: 0,
        color: dimColor,
        textShadow: `0 0 2px rgba(${glow.r}, ${glow.g}, ${glow.b}, 0.2)`,
      })

      chars.forEach((char) => {
        const delay = Math.random() * 0.45 * timeScale
        const tl = gsap.timeline({ delay })

        // 1. Spark flicker
        tl.to(char, {
          opacity: 1,
          duration: 0.05 * timeScale,
          repeat: 5,
          yoyo: true,
          ease: "none",
        })

        // 2. High voltage burn bloom
        tl.to(char, {
          opacity: 1,
          color: coreColor,
          textShadow: peakShadow,
          duration: 0.28 * timeScale,
          ease: "power2.in",
        })

        // 3. Stabilization / cooling down to primary color
        tl.to(char, {
          color: primaryColor,
          textShadow: settleShadow,
          duration: 0.38 * timeScale,
          ease: "power2.out",
        })

        // 4. Settle into steady state
        tl.to(char, {
          color: primaryColor,
          textShadow: restingShadow,
          duration: 0.48 * timeScale,
          ease: "power2.out",
        })

        masterTl.add(tl, 0)
      })

      return () => {
        split.revert()
      }
    },
    {
      scope: containerRef,
      dependencies: [
        children,
        duration,
        repeat,
        isDark,
        color,
        darkColor,
        lightColor,
        glowColor,
      ],
    }
  )

  return (
    <div
      ref={containerRef}
      className={cn("inline-block text-primary", className)}
      aria-label={children}
    >
      <span ref={textRef} className="inline-block" aria-hidden="true">
        {children}
      </span>
    </div>
  )
}
