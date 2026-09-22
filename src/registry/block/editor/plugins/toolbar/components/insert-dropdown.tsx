import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/extension"
import { INSERT_TABLE_COMMAND } from "@lexical/table"
import type { LexicalEditor } from "lexical"
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  Columns2,
  FileImage,
  LayoutTemplate,
  Mic,
  Minus,
  Network,
  Plus,
  Scissors,
  Share2,
  Sigma,
  StickyNote,
  Table as TableIcon,
  Video,
} from "lucide-react"

import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import useModal from "../../../hooks/use-modal"
import { INSERT_COLLAPSIBLE_COMMAND } from "../../../nodes/collapsible-nodes"
import { INSERT_EQUATION_COMMAND } from "../../../nodes/equation-node"
import { INSERT_EXCALIDRAW_COMMAND } from "../../../nodes/excalidraw-node"
import { OPEN_IMAGE_DIALOG_COMMAND } from "../../../nodes/image-node"
import { OPEN_LAYOUT_DIALOG_COMMAND } from "../../../nodes/layout-nodes"
import { INSERT_PAGE_BREAK_COMMAND } from "../../../nodes/page-break-node"
import { INSERT_POLL_COMMAND } from "../../../nodes/poll-node"
import { INSERT_STICKY_COMMAND } from "../../../nodes/sticky-node"
import {
  INSERT_FIGMA_COMMAND,
  INSERT_TWEET_COMMAND,
  INSERT_YOUTUBE_COMMAND,
} from "../../auto-embed"
import { SPEECH_TO_TEXT_COMMAND } from "../../speech-to-text"

export function InsertDropdown({
  editor,
  onUploadImage: _onUploadImage,
  disabled = false,
}: {
  editor: LexicalEditor
  onUploadImage?: (file: File) => Promise<string>
  disabled?: boolean
}) {
  const [modal, showModal] = useModal()

  const openInsertTableDialog = () => {
    showModal("Insert Table", (onClose) => {
      let rows = 3
      let columns = 3

      return (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Rows
              </label>
              <input
                type="number"
                min="1"
                max="50"
                defaultValue={3}
                onChange={(e) => {
                  rows = parseInt(e.target.value, 10) || 3
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Columns
              </label>
              <input
                type="number"
                min="1"
                max="50"
                defaultValue={3}
                onChange={(e) => {
                  columns = parseInt(e.target.value, 10) || 3
                }}
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                editor.dispatchCommand(INSERT_TABLE_COMMAND, {
                  columns: String(columns),
                  rows: String(rows),
                  includeHeaders: true,
                })
                onClose()
              }}
            >
              Insert Table
            </Button>
          </div>
        </div>
      )
    })
  }

  const openInsertImageDialog = () => {
    editor.dispatchCommand(OPEN_IMAGE_DIALOG_COMMAND, undefined)
  }

  const openInsertEmbedDialog = (
    type: "youtube" | "figma" | "tweet",
    title: string,
    placeholder: string
  ) => {
    showModal(title, (onClose) => {
      let url = ""

      return (
        <div className="space-y-4 pt-1">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              URL Link
            </label>
            <input
              type="url"
              placeholder={placeholder}
              onChange={(e) => {
                url = e.target.value
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (url.trim()) {
                  if (type === "youtube") {
                    editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, url.trim())
                  } else if (type === "figma") {
                    editor.dispatchCommand(INSERT_FIGMA_COMMAND, url.trim())
                  } else if (type === "tweet") {
                    editor.dispatchCommand(INSERT_TWEET_COMMAND, url.trim())
                  }
                }
                onClose()
              }}
            >
              Embed
            </Button>
          </div>
        </div>
      )
    })
  }

  const openInsertEquationDialog = () => {
    showModal("Insert LaTeX Formula", (onClose) => {
      let eq = "\\frac{a}{b} = \\sqrt{c^2 + d^2}"
      let inline = false

      return (
        <div className="space-y-4 pt-1">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              LaTeX Code
            </label>
            <textarea
              rows={3}
              defaultValue={eq}
              onChange={(e) => {
                eq = e.target.value
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              onChange={(e) => {
                inline = e.target.checked
              }}
              className="rounded border-input text-primary"
            />
            <span>Inline Equation (within text paragraph)</span>
          </label>

          <div className="flex justify-end gap-2 border-t border-border pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (eq.trim()) {
                  editor.dispatchCommand(INSERT_EQUATION_COMMAND, {
                    equation: eq.trim(),
                    inline,
                  })
                }
                onClose()
              }}
            >
              Insert Formula
            </Button>
          </div>
        </div>
      )
    })
  }

  const openInsertPollDialog = () => {
    showModal("Insert Poll", (onClose) => {
      let question = ""
      let opt1 = "Option 1"
      let opt2 = "Option 2"

      return (
        <div className="space-y-3 pt-1">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Poll Question
            </label>
            <input
              type="text"
              placeholder="What do you think about...?"
              onChange={(e) => {
                question = e.target.value
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-muted-foreground">
              Options
            </label>
            <input
              type="text"
              defaultValue={opt1}
              placeholder="Option 1"
              onChange={(e) => {
                opt1 = e.target.value
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="text"
              defaultValue={opt2}
              placeholder="Option 2"
              onChange={(e) => {
                opt2 = e.target.value
              }}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                editor.dispatchCommand(INSERT_POLL_COMMAND, {
                  question: question.trim() || "Untitled Poll",
                  options: [
                    opt1.trim() || "Option 1",
                    opt2.trim() || "Option 2",
                  ],
                })
                onClose()
              }}
            >
              Insert Poll
            </Button>
          </div>
        </div>
      )
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="h-8 gap-1.5 px-2 text-xs font-normal hover:bg-muted"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
            <span>Insert</span>
            <ChevronDown className="ml-0.5 h-3 w-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-52">
          <DropdownMenuItem onClick={openInsertTableDialog}>
            <TableIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Table</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={openInsertImageDialog}>
            <FileImage className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Image</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
            }
          >
            <Minus className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Horizontal Rule</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(INSERT_PAGE_BREAK_COMMAND, undefined)
            }
          >
            <Scissors className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Page Break</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined)
            }
          >
            <ChevronRight className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Toggle Details</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(OPEN_LAYOUT_DIALOG_COMMAND, undefined)
            }
          >
            <Columns2 className="mr-2 h-4 w-4 text-primary/80" />
            <span>Columns Layout</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={openInsertPollDialog}>
            <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Poll</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={openInsertEquationDialog}>
            <Sigma className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>LaTeX Equation</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined)
            }
          >
            <Network className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Excalidraw</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(INSERT_STICKY_COMMAND, undefined)
            }
          >
            <StickyNote className="mr-2 h-4 w-4 text-amber-500" />
            <span>Sticky Note</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              openInsertEmbedDialog(
                "youtube",
                "Embed YouTube Video",
                "https://www.youtube.com/watch?v=..."
              )
            }
          >
            <Video className="mr-2 h-4 w-4 text-red-500" />
            <span>YouTube Video</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              openInsertEmbedDialog(
                "figma",
                "Embed Figma Design",
                "https://www.figma.com/file/..."
              )
            }
          >
            <LayoutTemplate className="mr-2 h-4 w-4 text-purple-400" />
            <span>Figma Design</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              openInsertEmbedDialog(
                "tweet",
                "Embed X / Twitter Post",
                "https://x.com/.../status/..."
              )
            }
          >
            <Share2 className="mr-2 h-4 w-4 text-sky-400" />
            <span>X / Tweet</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, undefined)
            }
          >
            <Mic className="mr-2 h-4 w-4 text-rose-500" />
            <span>Speech to Text</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {modal}
    </>
  )
}
