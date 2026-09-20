import { useEffect, useState } from "react"

/**
 * Custom hook to track reader scroll progress through an article element.
 * Throttled using window.requestAnimationFrame for 60fps passive performance.
 */
export function useReadingProgress(
  targetRef: React.RefObject<HTMLElement | null>
): number {
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    let animationFrameId: number | null = null

    const updateReadingProgress = () => {
      const article = targetRef.current
      if (!article) return

      const rect = article.getBoundingClientRect()
      const articleTop = rect.top + window.scrollY
      const articleHeight = rect.height
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY

      // If above article start
      if (scrollY < articleTop - 120) {
        setReadingProgress(0)
        return
      }

      // Scrollable distance through the article
      const scrollableRange = articleHeight - windowHeight / 2
      if (scrollableRange <= 0) {
        setReadingProgress(100)
        return
      }

      const currentProgress =
        ((scrollY - (articleTop - 120)) / scrollableRange) * 100
      setReadingProgress(
        Math.min(100, Math.max(0, Math.round(currentProgress)))
      )
    }

    const onScroll = () => {
      if (animationFrameId !== null) return
      animationFrameId = window.requestAnimationFrame(() => {
        updateReadingProgress()
        animationFrameId = null
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    updateReadingProgress()

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [targetRef])

  return readingProgress
}
