import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCheck,
  CornerDownLeft,
  ListPlus,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Undo2,
} from "lucide-react"
import { useState } from "react"

import { useListState } from "@/registry/hooks/use-list-state"
import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import { Checkbox } from "@/registry/ui/checkbox"
import { Input } from "@/registry/ui/input"
import { cn } from "@/shared/lib/utils"

interface Task {
  id: string
  title: string
  completed: boolean
}

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Review architectural boundaries", completed: true },
  { id: "2", title: "Create schematic wireframe thumbnail", completed: true },
  { id: "3", title: "Construct interactive demo component", completed: false },
  {
    id: "4",
    title: "Compile documentation and run validation checks",
    completed: false,
  },
]

export function UseListStateDemo() {
  const [tasks, handlers] = useListState<Task>(INITIAL_TASKS)
  const [newTitle, setNewTitle] = useState("")

  const handleAdd = (prepend = false) => {
    if (!newTitle.trim()) return
    const newTask: Task = {
      id: String(Date.now()),
      title: newTitle.trim(),
      completed: false,
    }

    if (prepend) {
      handlers.prepend(newTask)
    } else {
      handlers.append(newTask)
    }
    setNewTitle("")
  }

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="w-full min-w-0 p-3 sm:p-5">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4">
        {/* Header bar */}
        <div className="flex flex-col gap-2 border-b border-border/40 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ListPlus className="size-4 text-primary" />
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Dynamic List State
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {completedCount}/{tasks.length} done
            </Badge>

            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => handlers.setState(INITIAL_TASKS)}
              title="Reset tasks to initial state"
            >
              <RotateCcw className="size-3" />
              Reset
            </Button>
          </div>
        </div>

        {/* Add item input bar */}
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 p-2.5 shadow-xs">
          <Input
            placeholder="Add new task..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAdd(false)
              }
            }}
            className="h-8 flex-1 text-xs"
          />

          <Button
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => handleAdd(false)}
            disabled={!newTitle.trim()}
          >
            <Plus className="size-3.5" />
            Append
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
            onClick={() => handleAdd(true)}
            disabled={!newTitle.trim()}
            title="Add to beginning of list"
          >
            Prepend
          </Button>
        </div>

        {/* Task items list */}
        <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-2 shadow-xs">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-muted-foreground">
              <span>All tasks cleared!</span>
              <button
                type="button"
                onClick={() => handlers.setState(INITIAL_TASKS)}
                className="mt-2 cursor-pointer text-[11px] text-primary hover:underline"
              >
                Restore sample tasks
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-2 rounded-md px-2 py-2 transition-colors hover:bg-muted/20"
                >
                  {/* Left: Checkbox & Title */}
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() =>
                        handlers.setItemProp(
                          index,
                          "completed",
                          !task.completed
                        )
                      }
                      aria-label={`Mark "${task.title}" as ${task.completed ? "incomplete" : "complete"}`}
                    />

                    <span
                      className={cn(
                        "truncate text-xs transition-colors",
                        task.completed
                          ? "text-muted-foreground/60 line-through"
                          : "font-medium text-foreground"
                      )}
                    >
                      {task.title}
                    </span>
                  </div>

                  {/* Right: Reorder & Remove Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        handlers.reorder({ from: index, to: index - 1 })
                      }
                      disabled={index === 0}
                      aria-label="Move item up"
                    >
                      <ArrowUp className="size-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        handlers.reorder({ from: index, to: index + 1 })
                      }
                      disabled={index === tasks.length - 1}
                      aria-label="Move item down"
                    >
                      <ArrowDown className="size-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-destructive"
                      onClick={() => handlers.remove(index)}
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Batch transformers bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={() =>
              handlers.apply((item) => ({ ...item, completed: true }))
            }
            disabled={tasks.length === 0 || completedCount === tasks.length}
          >
            <CheckCheck className="size-3 text-primary" />
            Complete All
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={() =>
              handlers.apply((item) => ({
                ...item,
                completed: !item.completed,
              }))
            }
            disabled={tasks.length === 0}
          >
            Invert
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-muted-foreground hover:text-destructive"
            onClick={() => handlers.filter((item) => !item.completed)}
            disabled={completedCount === 0}
          >
            <Trash2 className="size-3" />
            Clear Completed
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UseListStateDemo
