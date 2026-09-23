/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/refs */
/* eslint-disable react-hooks/set-state-in-effect */
import "./styles/editor.css"

import { HorizontalRuleExtension } from "@lexical/extension"
import { $generateHtmlFromNodes } from "@lexical/html"
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { TablePlugin } from "@lexical/react/LexicalTablePlugin"
import { $getRoot } from "lexical"
import * as React from "react"

import { EditorFooter } from "./components/editor-footer"
import { FloatingActionDock } from "./components/floating-action-dock"
import { InspectorDialog } from "./components/inspector-dialog"
import { ToolbarContext } from "./core/context/toolbar-context"
import {
  PageSetupPlugin,
  PageSetupProvider,
  usePageSetup,
} from "./core/page-setup"
import { editorTheme } from "./core/themes/editor-theme"
import { DEFAULT_NODES } from "./nodes"
import { AutoEmbedPlugin } from "./plugins/auto-embed"
import { AutoLinkPlugin } from "./plugins/auto-link"
import { BasicToolbarPlugin } from "./plugins/basic-toolbar"
import { CodeActionMenuPlugin } from "./plugins/code-action-menu"
import { CodeHighlightPlugin } from "./plugins/code-highlight"
import { CollapsiblePlugin } from "./plugins/collapsible"
import { DraggableBlockPlugin } from "./plugins/draggable-block"
import { EmojisPlugin } from "./plugins/emojis"
import { EquationsPlugin } from "./plugins/equations"
import { ExcalidrawPlugin } from "./plugins/excalidraw"
import { FloatingLinkEditorPlugin } from "./plugins/floating-link-editor"
import { FloatingToolbarPlugin } from "./plugins/floating-toolbar"
import { ImagesPlugin } from "./plugins/images"
import { LayoutPlugin } from "./plugins/layout"
import { MentionsPlugin } from "./plugins/mentions"
import { MobileToolbarPlugin } from "./plugins/mobile-toolbar"
import { OnChangeHandlerPlugin } from "./plugins/on-change"
import { PageBreakPlugin } from "./plugins/page-break"
import { PollPlugin } from "./plugins/poll"
import {
  OPEN_SHORTCUTS_DIALOG_COMMAND,
  ShortcutsPlugin,
} from "./plugins/shortcuts"
import { DragDropPlugin, SidebarInsertPanel } from "./plugins/sidebar-insert"
import { SlashCommandPlugin } from "./plugins/slash-command"
import { SpeechToTextPlugin } from "./plugins/speech-to-text"
import { StickyPlugin } from "./plugins/sticky"
import { TableActionMenuPlugin } from "./plugins/table-action-menu"
import { TableCellResizerPlugin } from "./plugins/table-cell-resizer"
import { TableHoverActionsPlugin } from "./plugins/table-hover-actions"
import { TableOfContentsPlugin } from "./plugins/table-of-contents"
import { ToolbarPlugin } from "./plugins/toolbar"
import type { EditorChangeData, EditorProps } from "./types"
import { cn } from "./utils/cn"
import { downloadHtmlFile } from "./utils/export-html"
import { validateUrl } from "./utils/url"

function PageContentCard({
  isFrameless,
  isBasic,
  isMobile,
  variant,
  contentClassName,
  minHeightStyle,
  finalPlaceholder,
  anchorRef,
}: {
  isFrameless: boolean
  isBasic: boolean
  isMobile: boolean
  variant: string
  contentClassName?: string
  minHeightStyle: string | number
  finalPlaceholder: React.ReactNode
  anchorRef?: (elem: HTMLDivElement | null) => void
}) {
  const { pageSetup, effectiveWidthPx, effectiveHeightPx, effectivePaddingPx } =
    usePageSetup()

  const isPaged = pageSetup.layoutMode === "paged"
  const isFluid = pageSetup.size === "fluid"

  return (
    <div
      style={{
        width: isFluid || !effectiveWidthPx ? "100%" : `${effectiveWidthPx}px`,
        maxWidth:
          isFluid || !effectiveWidthPx ? "100%" : `${effectiveWidthPx}px`,
        minHeight:
          isPaged && effectiveHeightPx
            ? `${effectiveHeightPx}px`
            : minHeightStyle,
        paddingTop: isFluid ? undefined : `${effectivePaddingPx.top}px`,
        paddingRight: isFluid ? undefined : `${effectivePaddingPx.right}px`,
        paddingBottom: isFluid ? undefined : `${effectivePaddingPx.bottom}px`,
        paddingLeft: isFluid ? undefined : `${effectivePaddingPx.left}px`,
        transform:
          pageSetup.scale !== 1 ? `scale(${pageSetup.scale})` : undefined,
        transformOrigin: "top center",
      }}
      className={cn(
        "universal-editor-page-card relative mx-auto flex flex-1 flex-col transition-all duration-300",
        isPaged &&
          "rounded-xs border border-border/80 bg-card text-card-foreground shadow-xl ring-1 ring-black/5 dark:ring-white/5"
      )}
    >
      <div
        ref={anchorRef}
        className={cn(
          "relative flex flex-1 flex-col",
          !isFrameless && "pl-9 sm:pl-10"
        )}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={cn(
                "universal-editor-input outline-none focus:outline-none",
                isFrameless && "p-0",
                isBasic && "text-sm",
                contentClassName
              )}
              style={{ minHeight: isPaged ? undefined : minHeightStyle }}
            />
          }
          placeholder={
            <div
              className={cn(
                "universal-editor-placeholder pointer-events-none text-muted-foreground/50 transition-opacity duration-150 select-none",
                isFrameless &&
                  "top-2 left-2 text-base leading-relaxed sm:top-3 sm:left-3",
                isBasic &&
                  "top-3 left-3 text-sm leading-relaxed sm:top-3.5 sm:left-3.5",
                isMobile && "top-4 left-4 text-base leading-relaxed",
                variant === "default" &&
                  "top-5 left-9 max-w-[calc(100%-2.5rem)] text-base leading-relaxed break-words sm:top-6 sm:left-10 sm:max-w-[calc(100%-3rem)]"
              )}
            >
              {finalPlaceholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>

      {/* Page Number indicator for Paged mode */}
      {isPaged && pageSetup.showPageNumbers && (
        <div className="mt-auto pt-6 pb-2 text-center font-mono text-[10px] text-muted-foreground/50 select-none print:hidden">
          — 1 —
        </div>
      )}
    </div>
  )
}

function FooterWithShortcuts({
  documentId,
  data,
  readOnly,
  onToggleReadOnly,
  onOpenInspector,
  onExportMarkdown,
  onExportHtml,
}: {
  documentId?: string | number
  data: EditorChangeData | null
  readOnly?: boolean
  onToggleReadOnly?: () => void
  onOpenInspector?: () => void
  onExportMarkdown?: () => void
  onExportHtml?: () => void
}) {
  const [editor] = useLexicalComposerContext()
  return (
    <EditorFooter
      documentId={documentId}
      data={data}
      readOnly={readOnly}
      onToggleReadOnly={onToggleReadOnly}
      onOpenInspector={onOpenInspector}
      onExportMarkdown={onExportMarkdown}
      onExportHtml={onExportHtml}
      onOpenShortcuts={() =>
        editor.dispatchCommand(OPEN_SHORTCUTS_DIALOG_COMMAND, undefined)
      }
    />
  )
}

function ValueSyncPlugin({
  value,
  lastSyncValueRef,
  onSyncState,
}: {
  value?: string
  lastSyncValueRef: React.MutableRefObject<string | undefined>
  onSyncState?: (data: EditorChangeData) => void
}) {
  const [editor] = useLexicalComposerContext()

  // Helper to read and broadcast current editor change data
  const broadcastCurrentState = React.useCallback(() => {
    editor.getEditorState().read(() => {
      const root = $getRoot()
      const text = root.getTextContent()
      const isEmpty = text.trim().length === 0 && root.getChildrenSize() <= 1

      const jsonState = editor.getEditorState().toJSON()
      const json = JSON.stringify(jsonState)

      let html = ""
      try {
        html = $generateHtmlFromNodes(editor, null)
      } catch {}

      let markdown = ""
      try {
        markdown = $convertToMarkdownString(TRANSFORMERS)
      } catch {}

      onSyncState?.({
        json,
        state: jsonState as unknown as Record<string, unknown>,
        html,
        markdown,
        text,
        isEmpty,
      })
    })
  }, [editor, onSyncState])

  // When value prop updates externally (e.g. server notes finished loading from db),
  // sync it into the Lexical editor state
  React.useEffect(() => {
    if (!value) return
    // If value matches what was just produced by typing inside editor, skip!
    if (value === lastSyncValueRef.current) return

    lastSyncValueRef.current = value

    let isJson = false
    try {
      const parsed = JSON.parse(value)
      if (parsed && typeof parsed === "object" && "root" in parsed) {
        isJson = true
        const newEditorState = editor.parseEditorState(value)
        editor.setEditorState(newEditorState)
      }
    } catch {
      // not serialized JSON state, fallback to markdown string
    }

    if (!isJson) {
      editor.update(() => {
        $convertFromMarkdownString(value, TRANSFORMERS)
      })
    }

    const timer = setTimeout(broadcastCurrentState, 50)
    return () => clearTimeout(timer)
  }, [editor, value, lastSyncValueRef, broadcastCurrentState])

  // Fire broadcast on mount so that initial HTML/Markdown is available immediately
  React.useEffect(() => {
    const timer = setTimeout(broadcastCurrentState, 60)
    return () => clearTimeout(timer)
  }, [broadcastCurrentState])

  return null
}

export function Editor({
  variant = "default",
  value,
  onChange,
  onReady,
  placeholder,
  readOnly = false,
  autoFocus = false,
  features = {},
  onUploadImage,
  documentId = "15714558",
  onSave,
  onShare,
  className,
  contentClassName,
  minHeight,
  namespace = "UniversalLexicalEditor",
  header,
  pageSetupConfig,
  onChangePageSetup,
}: EditorProps) {
  const isBasic = variant === "basic"
  const isFrameless = variant === "frameless"
  const isMobile = variant === "mobile"

  const {
    toolbar = !isFrameless && !isMobile && !isBasic,
    floatingToolbar = isFrameless || variant === "default",
    slashCommand = isFrameless || variant === "default",
    statusBar = !isBasic && !isFrameless,
    floatingDock = false,
    sidebarInsert = true,
    markdown = true,
    tables = !isBasic,
    history = true,
    autoFocus: enableAutoFocus = autoFocus,
    autoLink = true,
    floatingLinkEditor = !isBasic,
    codeActionMenu = !isBasic,
    autoEmbed = true,
    collapsible = true,
    pageBreak = true,
    equations = true,
    poll = true,
    layout = true,
    excalidraw = true,
    images = true,
    tableHoverActions = tables,
    tableActionMenu = tables,
    tableCellResizer = tables,
    tableOfContents = variant === "default",
    draggableBlock = !isBasic && !isMobile,
    speechToText = true,
    mentions = true,
    emojis = true,
    sticky = true,
    pageSetup = variant === "default",
    keyboardShortcuts = true,
  } = features

  const defaultPlaceholder = isBasic
    ? "Write a comment or quick note..."
    : isFrameless
      ? 'Press "/" for commands or start writing...'
      : isMobile
        ? "Tap to start writing..."
        : "Start writing content or drag & drop blocks from the sidebar..."

  const finalPlaceholder = placeholder ?? defaultPlaceholder

  const defaultMinHeight = isBasic ? 120 : isFrameless ? 200 : 250
  const finalMinHeight = minHeight ?? defaultMinHeight
  const minHeightStyle =
    typeof finalMinHeight === "number" ? `${finalMinHeight}px` : finalMinHeight

  // Internal state tracking
  const [internalReadOnly, setInternalReadOnly] = React.useState(readOnly)
  const [inspectorOpen, setInspectorOpen] = React.useState(false)
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [latestData, setLatestData] = React.useState<EditorChangeData | null>(
    null
  )
  const [floatingAnchorElem, setFloatingAnchorElem] =
    React.useState<HTMLDivElement | null>(null)

  const onAnchorRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setFloatingAnchorElem(node)
    }
  }, [])

  // Sync external readOnly prop changes
  React.useEffect(() => {
    setInternalReadOnly(readOnly)
  }, [readOnly])

  // Validate initial editor state only on mount or when documentId changes
  // to prevent recreating LexicalComposer initialConfig on every keystroke
  const initialValueRef = React.useRef(value)
  const initialEditorState = React.useMemo(() => {
    const val = initialValueRef.current
    if (!val) return undefined
    try {
      const parsed = JSON.parse(val)
      if (parsed && typeof parsed === "object" && "root" in parsed) {
        return val
      }
    } catch {
      // not serialized JSON state, fallback to markdown string
    }

    return () => {
      $convertFromMarkdownString(val, TRANSFORMERS)
    }
  }, [documentId])

  const initialConfig = React.useMemo(
    () => ({
      namespace,
      theme: editorTheme,
      nodes: DEFAULT_NODES,
      editable: !internalReadOnly,
      editorState: initialEditorState,
      onError: (error: Error) => {
        console.error("[UniversalEditor Error]:", error)
      },
      extensions: [HorizontalRuleExtension],
    }),
    [namespace, internalReadOnly, initialEditorState]
  )

  const lastSyncValueRef = React.useRef<string | undefined>(value)

  const onChangeRef = React.useRef(onChange)
  onChangeRef.current = onChange

  const onReadyRef = React.useRef(onReady)
  onReadyRef.current = onReady

  const handleInternalChange = React.useCallback((data: EditorChangeData) => {
    lastSyncValueRef.current = data.json
    setLatestData(data)
    onChangeRef.current?.(data)
  }, [])

  const handleSyncState = React.useCallback((data: EditorChangeData) => {
    setLatestData(data)
    onReadyRef.current?.(data)
  }, [])

  const handleExportMarkdown = React.useCallback(() => {
    if (!latestData) return
    const blob = new Blob([latestData.markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `document-${documentId}.md`
    a.click()
    URL.revokeObjectURL(url)
  }, [latestData, documentId])

  const handleExportHtml = React.useCallback(async () => {
    if (!latestData) return
    await downloadHtmlFile(
      latestData.html,
      `document-${documentId}.html`,
      `Document ${documentId}`
    )
  }, [latestData, documentId])

  return (
    <PageSetupProvider
      initialConfig={pageSetupConfig}
      onChange={onChangePageSetup}
    >
      <div
        className={cn(
          "relative flex w-full flex-col transition-colors",
          isFrameless && "border-none bg-transparent p-0 shadow-none",
          isBasic &&
            "overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm",
          isMobile &&
            "overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm",
          variant === "default" &&
            "overflow-hidden rounded-xl border border-border/50 bg-card shadow-md ring-1 shadow-black/5 ring-border/20",
          internalReadOnly && "opacity-90",
          className
        )}
      >
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarContext>
            {/* 1. Top Toolbar (Full, Basic, or None for Frameless/Mobile) */}
            {!internalReadOnly && toolbar && (
              <ToolbarPlugin onUploadImage={onUploadImage} />
            )}

            {!internalReadOnly && isBasic && <BasicToolbarPlugin />}

            {/* 2. Main Editor Row (Content Area + Slide-out Sidebar Panel) */}
            <div className="relative flex flex-1 overflow-hidden">
              {/* Content Area */}
              <div
                className={cn(
                  "relative flex flex-1 scrollbar-thin flex-col overflow-y-auto transition-[margin] duration-200 ease-in-out",
                  sidebarOpen ? "sm:mr-80" : "mr-0",
                  isFrameless
                    ? "p-2 sm:p-3"
                    : isBasic
                      ? "p-3 sm:p-3.5"
                      : isMobile
                        ? "p-4"
                        : "p-5 sm:p-6"
                )}
              >
                {header}

                <PageContentCard
                  isFrameless={isFrameless}
                  isBasic={isBasic}
                  isMobile={isMobile}
                  variant={variant}
                  contentClassName={contentClassName}
                  minHeightStyle={minHeightStyle}
                  finalPlaceholder={finalPlaceholder}
                  anchorRef={onAnchorRef}
                />

                {/* 3. Right Vertical Floating Action Dock (Optional) */}
                {floatingDock && (
                  <FloatingActionDock
                    className={cn(
                      "transition-opacity duration-200",
                      sidebarOpen
                        ? "pointer-events-none opacity-0"
                        : "opacity-100"
                    )}
                    onOpenSidebar={
                      sidebarInsert
                        ? () => setSidebarOpen((p) => !p)
                        : undefined
                    }
                    onSave={() => onSave?.(latestData)}
                    onShare={() => onShare?.(latestData)}
                    onExport={() => setInspectorOpen(true)}
                    onClear={() => {}}
                  />
                )}

                {/* 4. Core Plugins */}
                {history && <HistoryPlugin />}
                {enableAutoFocus && <AutoFocusPlugin />}
                <ListPlugin />
                <CheckListPlugin />
                <LinkPlugin validateUrl={validateUrl} />
                {tables && <TablePlugin />}

                <HorizontalRulePlugin />
                {markdown && (
                  <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                )}
                {!internalReadOnly && floatingToolbar && (
                  <FloatingToolbarPlugin />
                )}
                {!internalReadOnly && slashCommand && <SlashCommandPlugin />}

                {/* 5. Drag & Drop Insertion Plugin */}
                <DragDropPlugin />

                {/* Extended Playground Plugins */}
                {autoLink && <AutoLinkPlugin />}
                {collapsible && <CollapsiblePlugin />}
                {pageBreak && <PageBreakPlugin />}
                {equations && <EquationsPlugin />}
                {poll && <PollPlugin />}
                {layout && <LayoutPlugin />}
                {excalidraw && <ExcalidrawPlugin />}
                {images && <ImagesPlugin onUploadImage={onUploadImage} />}
                {!internalReadOnly && autoEmbed && <AutoEmbedPlugin />}
                {!internalReadOnly && floatingLinkEditor && (
                  <FloatingLinkEditorPlugin />
                )}
                <CodeHighlightPlugin />
                {!internalReadOnly && codeActionMenu && (
                  <CodeActionMenuPlugin />
                )}
                {!internalReadOnly && tableHoverActions && (
                  <TableHoverActionsPlugin />
                )}
                {!internalReadOnly && tableActionMenu && (
                  <TableActionMenuPlugin />
                )}
                {!internalReadOnly && tableCellResizer && (
                  <TableCellResizerPlugin />
                )}
                {!internalReadOnly && draggableBlock && !isMobile && (
                  <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                )}
                {!internalReadOnly && speechToText && <SpeechToTextPlugin />}
                {!internalReadOnly && mentions && <MentionsPlugin />}
                {emojis && <EmojisPlugin />}
                {!internalReadOnly && sticky && <StickyPlugin />}
                {!internalReadOnly && pageSetup && <PageSetupPlugin />}
                {keyboardShortcuts && <ShortcutsPlugin />}
                {tableOfContents && <TableOfContentsPlugin />}

                {/* 6. Output Bridge & External Value Synchronizer */}
                <ValueSyncPlugin
                  value={value}
                  lastSyncValueRef={lastSyncValueRef}
                  onSyncState={handleSyncState}
                />
                <OnChangeHandlerPlugin onChange={handleInternalChange} />
              </div>

              {/* 7. Slide-out Insert Tools Sidebar Panel */}
              {!internalReadOnly && sidebarInsert && (
                <SidebarInsertPanel
                  open={sidebarOpen}
                  onClose={() => setSidebarOpen(false)}
                />
              )}
            </div>

            {/* 8. Mobile Bottom Keyboard Toolbar */}
            {!internalReadOnly && isMobile && (
              <MobileToolbarPlugin onUploadImage={onUploadImage} />
            )}

            {/* 9. Footer Status Bar */}
            {statusBar && (
              <FooterWithShortcuts
                documentId={documentId}
                data={latestData}
                readOnly={internalReadOnly}
                onToggleReadOnly={() => setInternalReadOnly((prev) => !prev)}
                onOpenInspector={() => setInspectorOpen(true)}
                onExportMarkdown={handleExportMarkdown}
                onExportHtml={handleExportHtml}
              />
            )}

            {/* 10. Inspector Modal Dialog */}
            <InspectorDialog
              open={inspectorOpen}
              onOpenChange={setInspectorOpen}
              data={latestData}
            />
          </ToolbarContext>
        </LexicalComposer>
      </div>
    </PageSetupProvider>
  )
}

export default Editor
