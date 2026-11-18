import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

export type StudioPanel = "docs" | "code"
export type StudioPanelState = "closed" | StudioPanel

const PANEL_MIN_WIDTH = 360
const PANEL_MAX_WIDTH = 840
export const PANEL_DEFAULT_WIDTH = 460
export { PANEL_MAX_WIDTH, PANEL_MIN_WIDTH }

const clampPanelWidth = (width: number): number =>
  Math.round(Math.min(Math.max(width, PANEL_MIN_WIDTH), PANEL_MAX_WIDTH))

export interface StudioLayoutSlice {
  /** Modal drawer driving the floating sidebar. */
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  /** Right-hand docked panel (docs / code / closed). */
  panel: StudioPanelState
  /** Item's docs availability, mirrored from the route (synced via syncActiveItem). */
  docsAvailable: boolean
  setPanel: (panel: StudioPanelState) => void
  toggleDocs: () => void
  toggleCode: () => void
  closePanel: () => void

  /** Resizable docked column width + drag state. */
  panelWidth: number
  isDragging: boolean
  setPanelWidth: (width: number) => void
  setIsDragging: (isDragging: boolean) => void
  resetPanelWidth: () => void
}

export interface StudioPlaygroundSlice {
  activeVariantId: string | undefined
  setActiveVariantId: (variantId: string | null | undefined) => void
  customizerValues: Record<string, string | number | boolean>
  setCustomizerValue: (key: string, value: string | number | boolean) => void
  resetCustomizer: () => void
  /** Sync/reset playground state whenever the staged item changes. */
  syncActiveItem: (itemId: string | null, docsAvailable: boolean) => void
}

export interface StudioCanvasSlice {
  showGrid: boolean
  showArcBands: boolean
  toggleGrid: () => void
  toggleArcBands: () => void
}

export type StudioStore = StudioLayoutSlice &
  StudioPlaygroundSlice &
  StudioCanvasSlice

const DEFAULT_PANEL_WIDTH = PANEL_DEFAULT_WIDTH

/**
 * Single Zustand store for the UI Studio's interactive client state.
 * Route-derived identity (active item / collection / slug) deliberately
 * stays out — TanStack Router + the static registry adapter own that.
 *
 * Persistence is opt-in and SSR-safe: `persist` skips hydration on the
 * server, and `StudioShell` triggers `rehydrate()` after mount.
 */
export const useStudioStore = create<StudioStore>()(
  persist(
    (set) => ({
      // ─── Layout slice ───────────────────────────────────────────────────
      sidebarOpen: false,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      panel: "closed",
      docsAvailable: false,
      setPanel: (panel) => set({ panel }),
      toggleDocs: () =>
        set((state) =>
          state.docsAvailable
            ? { panel: state.panel === "docs" ? "closed" : "docs" }
            : state
        ),
      toggleCode: () =>
        set((state) => ({
          panel: state.panel === "code" ? "closed" : "code",
        })),
      closePanel: () => set({ panel: "closed" }),

      panelWidth: DEFAULT_PANEL_WIDTH,
      isDragging: false,
      setPanelWidth: (width) => set({ panelWidth: clampPanelWidth(width) }),
      setIsDragging: (isDragging) => set({ isDragging }),
      resetPanelWidth: () => set({ panelWidth: DEFAULT_PANEL_WIDTH }),

      // ─── Playground slice ───────────────────────────────────────────────
      activeVariantId: undefined,
      setActiveVariantId: (variantId) =>
        set({ activeVariantId: variantId ?? undefined }),

      customizerValues: {},
      setCustomizerValue: (key, value) =>
        set((state) => ({
          customizerValues: { ...state.customizerValues, [key]: value },
        })),
      resetCustomizer: () => set({ customizerValues: {} }),

      syncActiveItem: (itemId, docsAvailable) =>
        set((state) => {
          if (!itemId) {
            return {
              panel: "closed",
              docsAvailable,
              activeVariantId: undefined,
              customizerValues: {},
            }
          }

          // Blocks cannot host a docs panel — keep code instead
          const panel: StudioPanelState =
            !docsAvailable && state.panel === "docs" ? "code" : state.panel

          return {
            panel,
            docsAvailable,
            activeVariantId: undefined,
            customizerValues: {},
          }
        }),

      // ─── Canvas slice ───────────────────────────────────────────────────
      showGrid: true,
      showArcBands: true,
      toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
      toggleArcBands: () =>
        set((state) => ({ showArcBands: !state.showArcBands })),
    }),
    {
      name: "ui-studio-prefs",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          // Server render — inert storage; skipped via skipHydration
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        }
        return window.localStorage
      }),
      partialize: (state) => ({
        panelWidth: state.panelWidth,
        showGrid: state.showGrid,
        showArcBands: state.showArcBands,
      }),
      skipHydration: true,
      // Merge persisted prefs + migrate legacy keys once
      merge: (persistedState, currentState) => {
        const prefs = (persistedState ?? {}) as Partial<
          Pick<StudioStore, "panelWidth" | "showGrid" | "showArcBands">
        >
        try {
          if (prefs.panelWidth === undefined) {
            const legacy = window.localStorage.getItem(
              "byphongphan:studio-panel-width"
            )
            const parsed = legacy ? Number(legacy) : NaN
            if (Number.isFinite(parsed)) {
              prefs.panelWidth = clampPanelWidth(parsed)
            }
          }
          window.localStorage.removeItem("ui-studio-sidebar-open")
        } catch {
          // localStorage unavailable (private mode) — keep defaults
        }
        return {
          ...currentState,
          ...prefs,
          sidebarOpen: false,
        }
      },
    }
  )
)

/** Hydrate persisted prefs — call once, after mount, from the shell. */
export const rehydrateStudioPrefs = () => useStudioStore.persist.rehydrate()

/** Reset the whole store — exposed for tests / storybook-like harnesses. */
export const resetStudioStore = () =>
  useStudioStore.setState({
    sidebarOpen: false,
    panel: "closed",
    docsAvailable: false,
    panelWidth: DEFAULT_PANEL_WIDTH,
    isDragging: false,
    activeVariantId: undefined,
    customizerValues: {},
    showGrid: true,
    showArcBands: true,
  })

/** Fine-grained selector hooks — components subscribe to exactly what they need. */
export const useStudioPanel = () =>
  useStudioStore(
    useShallow((state) => ({
      panel: state.panel,
      docsAvailable: state.docsAvailable,
      panelWidth: state.panelWidth,
      isDragging: state.isDragging,
      toggleCode: state.toggleCode,
      toggleDocs: state.toggleDocs,
      setPanel: state.setPanel,
      closePanel: state.closePanel,
    }))
  )
export const useStudioCustomizer = () =>
  useStudioStore(
    useShallow((state) => ({
      customizerValues: state.customizerValues,
      setCustomizerValue: state.setCustomizerValue,
      resetCustomizer: state.resetCustomizer,
    }))
  )
