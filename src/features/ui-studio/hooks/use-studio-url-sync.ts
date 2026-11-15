import { useNavigate, useSearch } from "@tanstack/react-router"
import * as React from "react"

import {
  DEFAULT_STUDIO_COLLECTION,
  parseStudioSearch,
  type StudioCollectionParam,
  type StudioPanel,
  type StudioSearch,
} from "../model/studio-search"

export type StudioSearchPatch = {
  collection?: StudioCollectionParam | null
  item?: string | null
  variant?: string | null
  panel?: StudioPanel | null
}

function resolveOptional(
  patch: string | null | undefined,
  current: string | undefined
): string | undefined {
  if (patch === undefined) return current
  if (patch === null) return undefined
  return patch
}

/**
 * Two-way sync between studio state and the TanStack Router search params.
 * `null` values in the patch clear the param; omitted keys are preserved.
 */
export function useStudioUrlSync() {
  const navigate = useNavigate()
  const rawSearch = useSearch({ strict: false }) as unknown

  const search = React.useMemo(
    () =>
      parseStudioSearch(
        rawSearch && typeof rawSearch === "object"
          ? (rawSearch as Record<string, unknown>)
          : undefined
      ),
    [rawSearch]
  )

  const update = React.useCallback(
    (patch: StudioSearchPatch, options?: { replace?: boolean }) => {
      const next: StudioSearch = {
        collection:
          patch.collection === undefined || patch.collection === null
            ? patch.collection === null
              ? DEFAULT_STUDIO_COLLECTION
              : search.collection
            : patch.collection,
        item: resolveOptional(patch.item, search.item),
        variant: resolveOptional(patch.variant, search.variant),
        panel: resolveOptional(patch.panel, search.panel) as
          StudioPanel | undefined,
      }

      // Relative target: stays type-correct even before the generated
      // route tree registers the /ui path.
      void navigate({
        to: ".",
        search: next,
        replace: options?.replace ?? true,
      })
    },
    [navigate, search]
  )

  const selectCollection = React.useCallback(
    (collection: StudioCollectionParam) => {
      // Switching collection resets item / variant / panel
      update({ collection, item: null, variant: null, panel: null })
    },
    [update]
  )

  const selectItem = React.useCallback(
    (itemId: string | null) => {
      if (itemId === null) {
        update({ item: null, variant: null, panel: null })
        return
      }
      update({ item: itemId, variant: null })
    },
    [update]
  )

  const selectVariant = React.useCallback(
    (variantId: string | null) => {
      update({ variant: variantId })
    },
    [update]
  )

  const setPanel = React.useCallback(
    (panel: StudioPanel | null) => {
      update({ panel })
    },
    [update]
  )

  return {
    search,
    collection: search.collection,
    itemId: search.item,
    variantId: search.variant,
    panel: search.panel,
    isDetail: Boolean(search.item),
    selectCollection,
    selectItem,
    selectVariant,
    setPanel,
    update,
  }
}
