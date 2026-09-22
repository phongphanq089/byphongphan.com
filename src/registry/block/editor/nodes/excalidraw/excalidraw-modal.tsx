import "@excalidraw/excalidraw/index.css"

import type {
  ExcalidrawElement,
  NonDeleted,
} from "@excalidraw/excalidraw/element/types"
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types"
import * as React from "react"
import { createPortal } from "react-dom"

import { Button } from "@/shared/ui/core/button"
import { useTheme } from "@/shared/providers"

// Dynamic lazy load of Excalidraw to ensure Cloudflare Workers SSR safety
const Excalidraw = React.lazy(() =>
  import("@excalidraw/excalidraw").then((mod) => ({
    default: mod.Excalidraw,
  }))
)

export interface ExcalidrawModalProps {
  isShown?: boolean
  initialElements?: readonly NonDeleted<ExcalidrawElement>[]
  initialAppState?: Partial<AppState>
  initialFiles?: BinaryFiles
  onSave: (
    elements: readonly NonDeleted<ExcalidrawElement>[],
    appState: Partial<AppState>,
    files: BinaryFiles
  ) => void
  onClose: () => void
  onDelete: () => void
}

export function ExcalidrawModal({
  isShown = false,
  initialElements = [],
  initialAppState = {},
  initialFiles = {},
  onSave,
  onClose,
  onDelete,
}: ExcalidrawModalProps) {
  const modalRef = React.useRef<HTMLDivElement | null>(null)
  const [excalidrawAPI, setExcalidrawAPI] =
    React.useState<ExcalidrawImperativeAPI | null>(null)
  const [elements, setElements] =
    React.useState<readonly NonDeleted<ExcalidrawElement>[]>(initialElements)
  const [files, setFiles] = React.useState<BinaryFiles>(initialFiles)
  const [hasChanged, setHasChanged] = React.useState<boolean>(false)
  const [discardModalOpen, setDiscardModalOpen] = React.useState<boolean>(false)

  // Track active theme (dark/light) dynamically
  const { theme } = useTheme()

  React.useEffect(() => {
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({
        appState: {
          theme: theme ? "dark" : "light",
        },
      })
    }
  }, [theme, excalidrawAPI])

  React.useEffect(() => {
    modalRef.current?.focus()
  }, [])

  // Keyboard shortcut (Escape to trigger discard)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (discardModalOpen) {
          setDiscardModalOpen(false)
        } else if (hasChanged && elements.some((el) => !el.isDeleted)) {
          setDiscardModalOpen(true)
        } else {
          onClose()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [discardModalOpen, hasChanged, elements, onClose])

  const handleSave = () => {
    const activeElements = elements.filter((el) => !el.isDeleted)
    if (activeElements.length === 0 && Object.keys(files).length === 0) {
      onDelete()
      return
    }

    const currentAppState = excalidrawAPI?.getAppState()
    const partialAppState: Partial<AppState> = {
      exportBackground: currentAppState?.exportBackground ?? true,
      exportScale: currentAppState?.exportScale ?? 1,
      exportWithDarkMode: theme === "dark",
      isLoading: false,
      name: currentAppState?.name,
      theme: theme ? "dark" : "light",
      viewBackgroundColor:
        currentAppState?.viewBackgroundColor || (theme ? "#18181b" : "#ffffff"),
      zoom: currentAppState?.zoom,
    }

    onSave(elements, partialAppState, files)
  }

  const handleDiscardClick = () => {
    if (hasChanged && elements.some((el) => !el.isDeleted)) {
      setDiscardModalOpen(true)
    } else {
      if (initialElements.length === 0) {
        onDelete()
      } else {
        onClose()
      }
    }
  }

  const handleConfirmDiscard = () => {
    setDiscardModalOpen(false)
    if (initialElements.length === 0) {
      onDelete()
    } else {
      onClose()
    }
  }

  if (!isShown || typeof document === "undefined") {
    return null
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/75 p-3 backdrop-blur-xs duration-150 select-none fade-in"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative flex h-[92vh] w-[95vw] max-w-[1440px] flex-col overflow-hidden rounded-2xl border border-border/80 bg-background shadow-2xl outline-none"
      >
        {/* Floating Top-Right Action Buttons (Matches Lexical Playground Design) */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDiscardClick}
            className="h-8 rounded-lg border-border/80 bg-background/90 px-3 text-xs font-medium shadow-xs backdrop-blur-md hover:bg-muted"
          >
            Discard
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="h-8 rounded-lg bg-primary px-3.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            Save
          </Button>
        </div>

        {/* Excalidraw Canvas Container */}
        <div className="relative h-full w-full flex-1">
          <React.Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Loading Excalidraw Canvas...
                  </span>
                </div>
              </div>
            }
          >
            <Excalidraw
              excalidrawAPI={setExcalidrawAPI}
              theme={theme ? "dark" : "light"}
              initialData={{
                appState: {
                  ...initialAppState,
                  theme: theme ? "dark" : "light",
                  isLoading: false,
                },
                elements: initialElements,
                files: initialFiles,
              }}
              onChange={(newElements, _appState, newFiles) => {
                setElements(newElements)
                setFiles(newFiles)
                setHasChanged(true)
              }}
              UIOptions={{
                canvasActions: {
                  changeViewBackgroundColor: true,
                  clearCanvas: true,
                  loadScene: true,
                  saveToActiveFile: false,
                  toggleTheme: true,
                  saveAsImage: true,
                },
              }}
            />
          </React.Suspense>
        </div>

        {/* Discard Confirmation Dialog */}
        {discardModalOpen && (
          <div className="backdrop-blur-2xs fixed inset-0 z-60 flex animate-in items-center justify-center bg-black/60 p-4 duration-150 fade-in">
            <div className="w-full max-w-sm rounded-2xl border border-border/80 bg-card p-5 shadow-2xl">
              <h3 className="text-sm font-semibold text-foreground">
                Discard changes?
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Are you sure you want to discard your changes? Any unsaved
                whiteboard strokes will be lost.
              </p>
              <div className="mt-5 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setDiscardModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleConfirmDiscard}
                >
                  Discard
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

export default ExcalidrawModal
