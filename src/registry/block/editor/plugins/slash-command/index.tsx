/* eslint-disable @typescript-eslint/consistent-type-imports */
import { $createCodeNode } from "@lexical/code"
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/extension"
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin"
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text"
import { $setBlocksType } from "@lexical/selection"
import { INSERT_TABLE_COMMAND } from "@lexical/table"
import type { LexicalEditor } from "lexical"
import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical"
import {
  AtSign,
  BarChart3,
  ChevronRight,
  Code2,
  Columns2,
  Columns3,
  FileImage,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Keyboard,
  LayoutTemplate,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Network,
  Pilcrow,
  Quote,
  Scissors,
  Share2,
  Sigma,
  Smile,
  StickyNote,
  Table as TableIcon,
  Video,
} from "lucide-react"
import type { JSX } from "react"
import * as React from "react"
import { createPortal } from "react-dom"

import { OPEN_PAGE_SETUP_COMMAND } from "../../core/page-setup"
import { INSERT_COLLAPSIBLE_COMMAND } from "../../nodes/collapsible-nodes"
import { INSERT_EQUATION_COMMAND } from "../../nodes/equation-node"
import { INSERT_EXCALIDRAW_COMMAND } from "../../nodes/excalidraw-node"
import { OPEN_IMAGE_DIALOG_COMMAND } from "../../nodes/image-node"
import {
  INSERT_LAYOUT_COMMAND,
  OPEN_LAYOUT_DIALOG_COMMAND,
} from "../../nodes/layout-nodes"
import { INSERT_PAGE_BREAK_COMMAND } from "../../nodes/page-break-node"
import { INSERT_POLL_COMMAND } from "../../nodes/poll-node"
import { INSERT_STICKY_COMMAND } from "../../nodes/sticky-node"
import {
  INSERT_FIGMA_COMMAND,
  INSERT_TWEET_COMMAND,
  INSERT_YOUTUBE_COMMAND,
} from "../auto-embed"
import { OPEN_EMOJI_PICKER_COMMAND } from "../emojis"
import { OPEN_SHORTCUTS_DIALOG_COMMAND } from "../shortcuts"

export class SlashCommandOption extends MenuOption {
  title: string
  description: string
  keywords: string[]
  onSelect: (editor: LexicalEditor) => void

  constructor(
    title: string,
    options: {
      description: string
      icon?: JSX.Element
      keywords?: string[]
      onSelect: (editor: LexicalEditor) => void
    }
  ) {
    super(title)
    this.title = title
    this.description = options.description
    this.icon = options.icon
    this.keywords = options.keywords || []
    this.onSelect = options.onSelect
  }
}

export function SlashCommandPlugin({
  anchorElem = typeof document !== "undefined" ? document.body : null,
}: {
  anchorElem?: HTMLElement | null
}) {
  const [editor] = useLexicalComposerContext()
  const [queryString, setQueryString] = React.useState<string | null>(null)

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  })

  const getBaseOptions = React.useCallback(
    (editorInstance: LexicalEditor): SlashCommandOption[] => [
      new SlashCommandOption("Text", {
        description: "Just start typing with plain text",
        icon: <Pilcrow className="size-4" />,
        keywords: ["normal", "paragraph", "p", "text"],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createParagraphNode())
            }
          })
        },
      }),
      new SlashCommandOption("Heading 1", {
        description: "Large section heading",
        icon: <Heading1 className="size-4" />,
        keywords: ["h1", "title", "big", "heading"],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h1"))
            }
          })
        },
      }),
      new SlashCommandOption("Heading 2", {
        description: "Medium section heading",
        icon: <Heading2 className="size-4" />,
        keywords: ["h2", "subtitle", "heading"],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h2"))
            }
          })
        },
      }),
      new SlashCommandOption("Heading 3", {
        description: "Small section heading",
        icon: <Heading3 className="size-4" />,
        keywords: ["h3", "sub", "heading"],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h3"))
            }
          })
        },
      }),
      new SlashCommandOption("Bullet List", {
        description: "Create a simple bulleted list",
        icon: <List className="size-4" />,
        keywords: ["bullet", "list", "unordered", "ul"],
        onSelect: () => {
          editorInstance.dispatchCommand(
            INSERT_UNORDERED_LIST_COMMAND,
            undefined
          )
        },
      }),
      new SlashCommandOption("Numbered List", {
        description: "Create a list with numbering",
        icon: <ListOrdered className="size-4" />,
        keywords: ["number", "ordered", "ol", "list"],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        },
      }),
      new SlashCommandOption("Checklist", {
        description: "Track tasks with a to-do list",
        icon: <ListTodo className="size-4" />,
        keywords: ["check", "todo", "task", "checklist"],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
        },
      }),
      new SlashCommandOption("Quote", {
        description: "Capture a quotation or callout",
        icon: <Quote className="size-4" />,
        keywords: ["quote", "blockquote", "callout"],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createQuoteNode())
            }
          })
        },
      }),
      new SlashCommandOption("Code Block", {
        description: "Capture a code snippet with highlighting",
        icon: <Code2 className="size-4" />,
        keywords: ["code", "snippet", "codeblock", "pre"],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createCodeNode())
            }
          })
        },
      }),
      new SlashCommandOption("Table", {
        description: "Insert a 3x3 editable data table",
        icon: <TableIcon className="size-4" />,
        keywords: ["table", "grid", "rows", "columns"],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns: "3",
            rows: "3",
            includeHeaders: true,
          })
        },
      }),
      new SlashCommandOption("Divider", {
        description: "Visually divide sections with a line",
        icon: <Minus className="size-4" />,
        keywords: ["divider", "hr", "line", "horizontal"],
        onSelect: () => {
          editorInstance.dispatchCommand(
            INSERT_HORIZONTAL_RULE_COMMAND,
            undefined
          )
        },
      }),
      new SlashCommandOption("Image", {
        description: "Upload file, link web image, or select curated preset",
        icon: <FileImage className="size-4" />,
        keywords: ["image", "photo", "picture", "img", "upload"],
        onSelect: () => {
          editorInstance.dispatchCommand(OPEN_IMAGE_DIALOG_COMMAND, undefined)
        },
      }),
      new SlashCommandOption("Page Break", {
        description: "Insert a page break line for print/export",
        icon: <Scissors className="size-4" />,
        keywords: ["page", "break", "print", "pagination"],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_PAGE_BREAK_COMMAND, undefined)
        },
      }),
      new SlashCommandOption("Toggle List", {
        description: "Collapsible toggle details section",
        icon: <ChevronRight className="size-4" />,
        keywords: ["toggle", "collapse", "details", "accordion"],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined)
        },
      }),
      new SlashCommandOption("Columns Layout", {
        description:
          "Design multi-column layout with customizable ratios & styles",
        icon: <Columns2 className="size-4 text-primary" />,
        keywords: [
          "columns",
          "layout",
          "grid",
          "split",
          "col",
          "cols",
          "2-cols",
          "3-cols",
          "4-cols",
        ],
        onSelect: () => {
          editorInstance.dispatchCommand(OPEN_LAYOUT_DIALOG_COMMAND, undefined)
        },
      }),
      new SlashCommandOption("2 Columns (Equal)", {
        description: "Quick 50% / 50% split columns",
        icon: <Columns2 className="size-4" />,
        keywords: ["2col", "2cols", "half", "split2"],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_LAYOUT_COMMAND, "1fr 1fr")
        },
      }),
      new SlashCommandOption("3 Columns (Equal)", {
        description: "Quick 33% / 33% / 33% tri-fold columns",
        icon: <Columns3 className="size-4" />,
        keywords: ["3col", "3cols", "thirds", "split3"],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_LAYOUT_COMMAND, "1fr 1fr 1fr")
        },
      }),
      new SlashCommandOption("Poll", {
        description: "Create an interactive voting poll",
        icon: <BarChart3 className="size-4" />,
        keywords: ["poll", "vote", "survey", "question"],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_POLL_COMMAND, {
            question: "What should we build next?",
            options: ["AI Autocomplete", "Offline Sync", "Custom Themes"],
          })
        },
      }),
      new SlashCommandOption("Math Equation", {
        description: "Render LaTeX formulas and math expressions",
        icon: <Sigma className="size-4" />,
        keywords: ["math", "equation", "latex", "formula", "tex"],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_EQUATION_COMMAND, {
            equation: "e^{i\\pi} + 1 = 0",
            inline: false,
          })
        },
      }),
      new SlashCommandOption("Emoji", {
        description: "Search and insert emojis",
        icon: <Smile className="size-4" />,
        keywords: ["emoji", "emoticon", "face", "smile", "icon"],
        onSelect: () => {
          editorInstance.dispatchCommand(OPEN_EMOJI_PICKER_COMMAND, undefined)
        },
      }),
      new SlashCommandOption("Mention Member", {
        description: "Mention a teammate with @name",
        icon: <AtSign className="size-4" />,
        keywords: ["mention", "user", "member", "team", "@"],
        onSelect: () => {
          editorInstance.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              selection.insertText("@")
            }
          })
        },
      }),
      new SlashCommandOption("Excalidraw", {
        description: "Draw sketches, wireframes, and diagrams with Excalidraw",
        icon: <Network className="size-4 text-primary" />,
        keywords: [
          "excalidraw",
          "draw",
          "drawing",
          "whiteboard",
          "canvas",
          "sketch",
          "diagram",
          "flowchart",
        ],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined)
        },
      }),
      new SlashCommandOption("Sticky Note", {
        description: "Pin a colorful sticky post-it memo",
        icon: <StickyNote className="size-4 text-amber-500" />,
        keywords: ["sticky", "note", "memo", "post-it", "pin"],
        onSelect: () => {
          editorInstance.dispatchCommand(INSERT_STICKY_COMMAND, undefined)
        },
      }),
      new SlashCommandOption("Page Setup", {
        description: "Configure paper size, orientation & margins",
        icon: <FileText className="size-4 text-primary" />,
        keywords: [
          "page",
          "size",
          "a4",
          "letter",
          "margins",
          "paper",
          "orientation",
          "setup",
          "print",
        ],
        onSelect: () => {
          editorInstance.dispatchCommand(OPEN_PAGE_SETUP_COMMAND, undefined)
        },
      }),
      new SlashCommandOption("YouTube", {
        description: "Embed a playable YouTube video",
        icon: <Video className="size-4" />,
        keywords: ["youtube", "video", "embed"],
        onSelect: () => {
          editorInstance.dispatchCommand(
            INSERT_YOUTUBE_COMMAND,
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          )
        },
      }),
      new SlashCommandOption("Figma", {
        description: "Embed a live Figma design file or frame",
        icon: <LayoutTemplate className="size-4" />,
        keywords: ["figma", "design", "embed"],
        onSelect: () => {
          editorInstance.dispatchCommand(
            INSERT_FIGMA_COMMAND,
            "https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File"
          )
        },
      }),
      new SlashCommandOption("X / Tweet", {
        description: "Embed a tweet post card from X / Twitter",
        icon: <Share2 className="size-4" />,
        keywords: ["tweet", "twitter", "x", "post"],
        onSelect: () => {
          editorInstance.dispatchCommand(
            INSERT_TWEET_COMMAND,
            "https://x.com/lexicaljs/status/1514339965042655234"
          )
        },
      }),
      new SlashCommandOption("Keyboard Shortcuts", {
        description: "View all keyboard shortcuts and hotkeys",
        icon: <Keyboard className="size-4 text-primary" />,
        keywords: [
          "shortcuts",
          "keyboard",
          "hotkeys",
          "keys",
          "help",
          "commands",
          "guide",
        ],
        onSelect: () => {
          editorInstance.dispatchCommand(
            OPEN_SHORTCUTS_DIALOG_COMMAND,
            undefined
          )
        },
      }),
    ],
    []
  )

  const options = React.useMemo(() => {
    const base = getBaseOptions(editor)
    if (!queryString) return base

    const regex = new RegExp(queryString, "i")
    return base.filter(
      (opt) =>
        regex.test(opt.title) ||
        regex.test(opt.description) ||
        opt.keywords.some((k) => regex.test(k))
    )
  }, [editor, getBaseOptions, queryString])

  const onSelectOption = React.useCallback(
    (
      selectedOption: SlashCommandOption,
      nodeToRemove: import("lexical").TextNode | null,
      closeMenu: () => void,
      _matchingString: string
    ) => {
      editor.update(() => {
        if (nodeToRemove) {
          nodeToRemove.remove()
        }
        selectedOption.onSelect(editor)
        closeMenu()
      })
    },
    [editor]
  )

  if (!anchorElem) return null

  return (
    <LexicalTypeaheadMenuPlugin<SlashCommandOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        if (anchorElementRef.current == null || options.length === 0) {
          return null
        }

        return createPortal(
          <div
            className="fixed z-50 max-h-72 w-64 animate-in overflow-y-auto rounded-xl border border-border/80 bg-popover/95 p-1.5 text-popover-foreground shadow-2xl backdrop-blur-md fade-in-0 outline-none select-none zoom-in-95"
            style={{
              top: anchorElementRef.current.getBoundingClientRect().bottom + 6,
              left: anchorElementRef.current.getBoundingClientRect().left,
            }}
          >
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Basic Blocks
            </div>

            <div className="space-y-0.5">
              {options.map((option, index) => {
                const isSelected = selectedIndex === index

                return (
                  <button
                    key={option.key}
                    type="button"
                    tabIndex={-1}
                    onClick={() => {
                      setHighlightedIndex(index)
                      selectOptionAndCleanUp(option)
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors outline-none ${
                      isSelected
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-md border ${
                        isSelected
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/60 bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      {option.icon}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-xs leading-tight font-semibold">
                        {option.title}
                      </span>
                      <span className="truncate text-[11px] leading-normal text-muted-foreground">
                        {option.description}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>,
          anchorElem
        )
      }}
    />
  )
}

export default SlashCommandPlugin
