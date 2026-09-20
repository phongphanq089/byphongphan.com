import { useNavigate } from "@tanstack/react-router"
import { CornerDownLeft } from "lucide-react"
import React, { useCallback } from "react"

import { useTheme } from "@/shared/providers/theme-provider"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/shared/ui/core/command"
import { Kbd } from "@/shared/ui/core/kbd"
import { PPPixelMark } from "@/shared/ui/icons"

import {
  COMMAND_GROUPS,
  COMMAND_MENU_ITEMS,
  type CommandMenuItem,
} from "./command-menu.config"
import { useCommandMenu } from "./use-command-menu"

export function CommandMenu() {
  const { open, setOpen } = useCommandMenu()
  const navigate = useNavigate()
  const { setTheme } = useTheme()

  const handleSelect = useCallback(
    (item: CommandMenuItem) => {
      setOpen(false)

      if (item.action) {
        if (item.action === "theme-light") setTheme("light")
        else if (item.action === "theme-dark") setTheme("dark")
        else if (item.action === "theme-system") setTheme("system")
        return
      }

      if (item.externalUrl) {
        window.open(item.externalUrl, "_blank", "noopener,noreferrer")
        return
      }

      if (item.to) {
        if (item.to.startsWith("/#")) {
          const hash = item.to.replace("/", "")
          if (
            typeof window !== "undefined" &&
            window.location.pathname === "/"
          ) {
            const element = document.querySelector(hash)
            if (element) {
              element.scrollIntoView({ behavior: "smooth" })
              return
            }
          }

          navigate({ to: "/" }).then(() => {
            setTimeout(() => {
              const element = document.querySelector(hash)
              if (element) {
                element.scrollIntoView({ behavior: "smooth" })
              }
            }, 200)
          })
          return
        }

        navigate({ to: item.to })
      }
    },
    [navigate, setOpen, setTheme]
  )

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Quick search and commands navigation"
      className="bg-accent px-2"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="rounded-xl bg-background">
        <CommandEmpty>No results found.</CommandEmpty>

        {COMMAND_GROUPS.map((group, groupIdx) => {
          const groupItems = COMMAND_MENU_ITEMS.filter(
            (item) => item.group === group.id
          )
          if (groupItems.length === 0) return null

          return (
            <React.Fragment key={group.id}>
              {groupIdx > 0 && <CommandSeparator />}
              <CommandGroup heading={group.heading}>
                {groupItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.description || ""} ${item.keywords?.join(" ") || ""}`}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-3 px-3 py-2.5"
                  >
                    {item.icon && (
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-border/40 bg-muted/40 text-muted-foreground group-data-[selected=true]/command-item:border-pp-primary/40 group-data-[selected=true]/command-item:bg-pp-primary/10 group-data-[selected=true]/command-item:text-pp-primary">
                        {item.icon}
                      </div>
                    )}

                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium text-foreground">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="py-0.2 rounded border border-pp-primary/30 bg-pp-primary/15 px-1.5 text-[9px] font-semibold text-pp-primary">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <span className="truncate text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      )}
                    </div>

                    {item.shortcut && item.shortcut.length > 0 && (
                      <CommandShortcut>
                        {item.shortcut.map((key, i) => (
                          <Kbd
                            key={i}
                            className="h-5 min-w-5 px-1 text-[10px] font-semibold tracking-normal text-muted-foreground group-data-[selected=true]/command-item:text-foreground"
                          >
                            {key}
                          </Kbd>
                        ))}
                      </CommandShortcut>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          )
        })}
      </CommandList>

      <div className="flex items-center justify-between px-3.5 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <PPPixelMark size={22} className="text-pp-primary" />
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span>Go to page</span>
          <Kbd className="flex h-5 w-5 items-center justify-center p-0 text-[10px]">
            <CornerDownLeft className="size-3" />
          </Kbd>
        </div>
      </div>
    </CommandDialog>
  )
}
