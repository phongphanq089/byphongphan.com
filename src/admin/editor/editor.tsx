import "./styles/lexical-editor.css"

import { TRANSFORMERS } from "@lexical/markdown"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { useMemo, useState } from "react"

import { cn } from "@/shared/lib/utils"

import { EditorStatusBar } from "./components/editor-status-bar"
import { BASIC_EDITOR_NODES } from "./core/nodes"
import { lexicalTheme } from "./core/theme"
import { BasicToolbarPlugin } from "./plugins/basic-toolbar-plugin"
import { EditorBridgePlugin } from "./plugins/editor-bridge-plugin"
import type { EditorChangeData, EditorProps } from "./type"
import { resolveInitialLexicalState } from "./utils/serialize"

export function Editor({
  variant = "default",
  value,
  defaultValue,
  onChange,
  onReady,
  placeholder = "Start writing... (supports Markdown shortcuts like # Heading, **bold**, - list)",
  readOnly = false,
  autoFocus = false,
  features,
  documentId,
  onSave,
  className,
  contentClassName,
  minHeight = 320,
  namespace = "byphongphan-editor",
  header,
}: EditorProps) {
  const [stats, setStats] = useState<EditorChangeData | null>(null)

  const showToolbar =
    features?.toolbar ?? (variant === "default" || variant === "basic")
  const showStatusBar = features?.statusBar ?? variant === "default"
  const enableHistory = features?.history ?? true
  const enableMarkdown = features?.markdown ?? true
  const enableAutoFocus = features?.autoFocus ?? autoFocus

  // Lexical reads `initialConfig` once per mount (use `key` on <Editor /> if you need to reset it).
  const initialConfig = useMemo<InitialConfigType>(
    () => ({
      namespace,
      theme: lexicalTheme,
      nodes: [...BASIC_EDITOR_NODES],
      editable: !readOnly,
      editorState: resolveInitialLexicalState(value ?? defaultValue),
      onError(error: Error) {
        console.error("[LexicalEditor]", error)
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [namespace]
  )

  const minHeightStyle =
    typeof minHeight === "number" ? `${minHeight}px` : minHeight

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden",
          variant === "frameless"
            ? "bg-transparent"
            : "rounded-xl border border-border/70 bg-background/60",
          className
        )}
      >
        {showToolbar && !readOnly && <BasicToolbarPlugin />}

        <div className="relative flex-1 overflow-y-auto">
          {header}

          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  aria-placeholder={placeholder}
                  placeholder={
                    <div className="pointer-events-none absolute top-4 right-4 left-4 text-sm text-muted-foreground/60 select-none sm:top-5 sm:left-6">
                      {placeholder}
                    </div>
                  }
                  style={{ minHeight: minHeightStyle }}
                  className={cn(
                    "lexical-content-editable px-4 py-4 text-sm text-foreground sm:px-6 sm:py-5",
                    contentClassName
                  )}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
        </div>

        {/* Core Lexical Plugins */}
        {enableHistory && <HistoryPlugin />}
        <ListPlugin />
        <LinkPlugin />
        {enableMarkdown && (
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        )}
        {enableAutoFocus && <AutoFocusPlugin />}

        <EditorBridgePlugin
          readOnly={readOnly}
          onChange={onChange}
          onReady={onReady}
          onStatsChange={setStats}
        />

        {showStatusBar && (
          <EditorStatusBar
            stats={stats}
            documentId={documentId}
            onSave={onSave}
          />
        )}
      </div>
    </LexicalComposer>
  )
}
