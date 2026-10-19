import { useRouterState } from "@tanstack/react-router"
import { useLayoutEffect } from "react"

export function useScrollToTop() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    })
  }, [pathname])
}
