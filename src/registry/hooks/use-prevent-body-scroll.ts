import { useEffect, useLayoutEffect, useRef } from "react"

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

let lockCount = 0
let savedScrollY = 0
let originalStyles: {
  overflow: string
  position: string
  top: string
  left: string
  width: string
  paddingRight: string
} | null = null

export function usePreventBodyScroll(isOpen: boolean = true): void {
  // Tracks whether this instance has currently acquired a body lock
  const isLockedByThisInstance = useRef(false)

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return

    if (isOpen && !isLockedByThisInstance.current) {
      isLockedByThisInstance.current = true

      if (lockCount === 0) {
        savedScrollY = window.scrollY

        const body = document.body
        const computedStyle = window.getComputedStyle(body)
        const existingPaddingRight = parseFloat(computedStyle.paddingRight) || 0
        const scrollbarWidth =
          window.innerWidth - document.documentElement.clientWidth

        originalStyles = {
          overflow: body.style.overflow,
          position: body.style.position,
          top: body.style.top,
          left: body.style.left,
          width: body.style.width,
          paddingRight: body.style.paddingRight,
        }

        body.style.overflow = "hidden"
        body.style.position = "fixed"
        body.style.top = `-${savedScrollY}px`
        body.style.left = "0"
        body.style.width = "100%"

        if (scrollbarWidth > 0) {
          body.style.paddingRight = `${existingPaddingRight + scrollbarWidth}px`
        }
      }

      lockCount++
    }

    return () => {
      if (isLockedByThisInstance.current) {
        isLockedByThisInstance.current = false
        lockCount--

        if (lockCount === 0 && originalStyles) {
          const body = document.body
          const html = document.documentElement

          body.style.overflow = originalStyles.overflow
          body.style.position = originalStyles.position
          body.style.top = originalStyles.top
          body.style.left = originalStyles.left
          body.style.width = originalStyles.width
          body.style.paddingRight = originalStyles.paddingRight

          originalStyles = null

          const originalScrollBehavior = html.style.scrollBehavior
          html.style.scrollBehavior = "auto"

          window.scrollTo(0, savedScrollY)

          html.style.scrollBehavior = originalScrollBehavior
        }
      }
    }
  }, [isOpen])
}
