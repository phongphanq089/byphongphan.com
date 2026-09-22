import type { PageSetupConfig } from "./core/page-setup/types"

export type EditorVariant = "default" | "basic" | "frameless" | "mobile"

export interface EditorChangeData {
  /** Serialized Lexical JSON state string - ideal for database storage and restoring */
  json: string
  /** Parsed JSON state object */
  state: Record<string, unknown>
  /** Exported HTML string */
  html: string
  /** Exported Markdown string */
  markdown: string
  /** Plain text content */
  text: string
  /** Boolean indicating whether the editor has any meaningful content */
  isEmpty: boolean
}

export interface EditorFeatures {
  /** Toggle top toolbar */
  toolbar?: boolean
  /** Toggle floating bubble menu on text selection */
  floatingToolbar?: boolean
  /** Toggle slash command '/' block picker */
  slashCommand?: boolean
  /** Toggle bottom status bar with counters and action tools */
  statusBar?: boolean
  /** Toggle vertical right action dock */
  floatingDock?: boolean
  /** Toggle slide-out insert tools sidebar */
  sidebarInsert?: boolean
  /** Toggle markdown shortcuts like '# ' for heading */
  markdown?: boolean
  /** Toggle table editing */
  tables?: boolean
  /** Toggle undo/redo history */
  history?: boolean
  /** Toggle auto focus on mount */
  autoFocus?: boolean
  /** Toggle auto link detection for URLs/emails */
  autoLink?: boolean
  /** Toggle floating link editor popup on clicked links */
  floatingLinkEditor?: boolean
  /** Toggle code action menu (copy code, language switch) on code blocks */
  codeActionMenu?: boolean
  /** Toggle auto embed support for YouTube, Figma, Tweet */
  autoEmbed?: boolean
  /** Toggle collapsible details toggle */
  collapsible?: boolean
  /** Toggle page break separator */
  pageBreak?: boolean
  /** Toggle LaTeX equation formulas */
  equations?: boolean
  /** Toggle interactive polls */
  poll?: boolean
  /** Toggle multi-column layout containers */
  layout?: boolean
  /** Toggle whiteboard drawings */
  excalidraw?: boolean
  /** Toggle image paste / drop and rendering */
  images?: boolean
  /** Toggle table row and column hover action buttons */
  tableHoverActions?: boolean
  /** Toggle table cell context action menu (insert/delete rows/cols, styling) */
  tableActionMenu?: boolean
  /** Toggle table cell border drag-resizing */
  tableCellResizer?: boolean
  /** Toggle floating dynamic table of contents */
  tableOfContents?: boolean
  /** Toggle Notion-style draggable block handle */
  draggableBlock?: boolean
  /** Toggle speech-to-text dictation */
  speechToText?: boolean
  /** Toggle @mentions typeahead member picker */
  mentions?: boolean
  /** Toggle emoji shortcuts transform and emoji picker */
  emojis?: boolean
  /** Toggle post-it style sticky note cards */
  sticky?: boolean
  /** Toggle page size & document layout setup (A4, Letter, Margins, Paged mode) */
  pageSetup?: boolean
  /** Toggle keyboard shortcuts reference modal & key listeners */
  keyboardShortcuts?: boolean
}

export interface EditorProps {
  /**
   * Visual preset variant:
   * - 'default': Full rich text editor with top toolbar, footer status bar & side dock
   * - 'basic': Compact mini editor for comments & simple forms
   * - 'frameless': Notion / Medium-like canvas (no border, no card bg) powered by Slash (/) & Bubble Menu
   * - 'mobile': Mobile-optimized editor with touch-friendly bottom dock toolbar
   */
  variant?: EditorVariant
  /** Initial or controlled value (JSON string or Lexical State) */
  value?: string
  /** Callback emitted on content change */
  onChange?: (data: EditorChangeData) => void
  /** Callback emitted when editor content is initially ready or externally updated */
  onReady?: (data: EditorChangeData) => void
  /** Placeholder text when empty */
  placeholder?: string
  /** Read only / view mode */
  readOnly?: boolean
  /** Auto focus on mount */
  autoFocus?: boolean
  /** Feature flags override */
  features?: EditorFeatures
  /** Custom image upload handler */
  onUploadImage?: (file: File) => Promise<string>
  /** Document ID displayed in the footer status bar */
  documentId?: string | number
  /** Quick save handler */
  onSave?: (data: EditorChangeData | null) => void
  /** Share handler */
  onShare?: (data: EditorChangeData | null) => void
  /** Container CSS className */
  className?: string
  /** ContentEditable area CSS className */
  contentClassName?: string
  /** Minimum height of the editor input */
  minHeight?: string | number
  /** Namespace identifier for the editor instance */
  namespace?: string
  /** Optional header element rendered inside document scroll container above content */
  header?: React.ReactNode
  /** Initial page setup configuration (size, orientation, margins, paged mode) */
  pageSetupConfig?: Partial<PageSetupConfig>
  /** Callback fired when page setup is updated */
  onChangePageSetup?: (config: PageSetupConfig) => void
}

export * from "./core/page-setup/types"
