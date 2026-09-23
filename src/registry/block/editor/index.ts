export { EditorFooter } from "./components/editor-footer"
export { FloatingActionDock } from "./components/floating-action-dock"
export { InspectorDialog } from "./components/inspector-dialog"
export { editorTheme } from "./core/themes/editor-theme"
export { default, Editor } from "./editor"
export { DEFAULT_NODES } from "./nodes"
export { BasicToolbarPlugin } from "./plugins/basic-toolbar"
export { FloatingToolbarPlugin } from "./plugins/floating-toolbar"
export { MobileToolbarPlugin } from "./plugins/mobile-toolbar"
export {
  DragDropPlugin,
  insertBlockIntoEditor,
  type SidebarBlockItem,
  type SidebarInsertBlockType,
  SidebarInsertPanel,
} from "./plugins/sidebar-insert"
export { SlashCommandPlugin } from "./plugins/slash-command"
export type {
  EditorChangeData,
  EditorFeatures,
  EditorProps,
  EditorVariant,
} from "./types"
