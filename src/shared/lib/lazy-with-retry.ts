/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ComponentType, lazy, type LazyExoticComponent } from "react"

/**
 * Robust lazy component loader with automatic retry mechanism.
 * Protects against transient network hiccups and Vite dev server dynamic dependency re-optimizations.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
  interval = 400
): LazyExoticComponent<T> {
  return lazy(async () => {
    for (let i = 0; i <= retries; i++) {
      try {
        return await factory()
      } catch (error) {
        if (i === retries) {
          throw error
        }
        await new Promise((resolve) => setTimeout(resolve, interval))
      }
    }
    return factory()
  })
}
