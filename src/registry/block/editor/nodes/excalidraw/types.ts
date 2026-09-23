import type {
  ExcalidrawElement,
  NonDeleted,
} from "@excalidraw/excalidraw/element/types"
import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types"

export type Dimension = number | "inherit"

export type ExcalidrawInitialElements = readonly NonDeleted<ExcalidrawElement>[]

export interface ExcalidrawNodeData {
  elements?: NonDeleted<ExcalidrawElement>[]
  appState?: Partial<AppState>
  files?: BinaryFiles
}
