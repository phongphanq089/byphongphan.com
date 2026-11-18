# useMediaQuery

> Listens for media query changes and returns a boolean.

## Installation

  

  ```bash
npx shadcn@latest add https://byphongphan.com/r/use-media-query.json
```

  
    
      - Copy and paste the hook into your project.
      ```tsx
// hooks/use-media-query.ts
import { useCallback, useSyncExternalStore } from "react"

const BREAKPOINTS = {
  "2xl": 1536,
  "3xl": 1600,
  "4xl": 2000,
  xl: 1280,
  lg: 1024,
  md: 800,
  sm: 640,
  xs: 450,
} as const

type Breakpoint = keyof typeof BREAKPOINTS

type BreakpointQuery =
  Breakpoint | `max-${Breakpoint}` | `${Breakpoint}:max-${Breakpoint}`

function resolveMin(value: Breakpoint | number): string {
  const px = typeof value === "number" ? value : BREAKPOINTS[value]
  return `(min-width: ${px}px)`
}

function resolveMax(value: Breakpoint | number): string {
  const px = typeof value === "number" ? value : BREAKPOINTS[value]
  return `(max-width: ${px - 1}px)`
}

function parseQuery(
  query: BreakpointQuery | MediaQueryInput | (string & {})
): string {
  if (typeof query !== "string") {
    const parts: string[] = []
    if (query.min != null) parts.push(resolveMin(query.min))
    if (query.max != null) parts.push(resolveMax(query.max))
    if (query.pointer === "coarse") parts.push("(pointer: coarse)")
    if (query.pointer === "fine") parts.push("(pointer: fine)")
    if (parts.length === 0) return "(min-width: 0px)"
    return parts.join(" and ")
  }

  if (query.startsWith("(")) return query

  const parts: string[] = []
  for (const segment of query.split(":")) {
    if (segment.startsWith("max-")) {
      const bp = segment.slice(4)
      if (bp in BREAKPOINTS) parts.push(resolveMax(bp as Breakpoint))
    } else if (segment in BREAKPOINTS) {
      parts.push(resolveMin(segment as Breakpoint))
    }
  }

  return parts.length > 0 ? parts.join(" and ") : query
}

function getServerSnapshot(): boolean {
  return false
}

export type MediaQueryInput = {
  min?: Breakpoint | number
  max?: Breakpoint | number
  /** Touch-like input (finger). Use "fine" for mouse/trackpad. */
  pointer?: "coarse" | "fine"
}

export function useMediaQuery(
  query: BreakpointQuery | MediaQueryInput | (string & {})
): boolean {
  const mediaQuery = parseQuery(query)

  const subscribe = useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") return () => {}
      const mql = window.matchMedia(mediaQuery)
      mql.addEventListener("change", callback)
      return () => mql.removeEventListener("change", callback)
    },
    [mediaQuery]
  )

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(mediaQuery).matches
  }, [mediaQuery])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useIsMobile(): boolean {
  return useMediaQuery("max-md")
}

```
      - Update the import paths to match your project setup.
    
  

## Usage

```tsx
import { useMediaQuery } from "@/shared/hooks"

export function ResponsiveLayout() {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const isMobile = useMediaQuery("max-sm")

  return (
    <div>
      {isDesktop ? <DesktopNavigation /> : <MobileNavigation />}
    </div>
  )
}
```

## Props & Parameters

| Param   | Type                                           | Default | Description                                                                          |
| :------ | :--------------------------------------------- | :------ | :----------------------------------------------------------------------------------- |
| `query` | `string \| BreakpointQuery \| MediaQueryInput` | —       | Media query string e.g. `"(min-width: 1024px)"` or breakpoint token like `"max-md"`. |

## Returns

| Return    | Type      | Description                                                                                        |
| :-------- | :-------- | :------------------------------------------------------------------------------------------------- |
| `matches` | `boolean` | `true` if current viewport matches the media query, `false` otherwise. Safely synchronizes on SSR. |
