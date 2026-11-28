import {
  BellIcon,
  ChevronDownIcon,
  CopyIcon,
  KeyboardIcon,
  PaletteIcon,
  SettingsIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react"
import { useState } from "react"

import {
  GlassDropdownMenu,
  GlassDropdownMenuCheckboxItem,
  GlassDropdownMenuContent,
  GlassDropdownMenuGroup,
  GlassDropdownMenuItem,
  GlassDropdownMenuLabel,
  GlassDropdownMenuRadioGroup,
  GlassDropdownMenuRadioItem,
  GlassDropdownMenuSeparator,
  GlassDropdownMenuShortcut,
  GlassDropdownMenuSub,
  GlassDropdownMenuSubContent,
  GlassDropdownMenuSubTrigger,
  GlassDropdownMenuTrigger,
} from "@/registry/animated/glass-dropdown-menu"

export function GlassDropdownMenuDemo() {
  const [notifications, setNotifications] = useState(true)
  const [density, setDensity] = useState("comfortable")

  return (
    <div className="flex min-h-[360px] w-full items-center justify-center p-6">
      <GlassDropdownMenu opening="stretch">
        <GlassDropdownMenuTrigger>
          Actions
          <ChevronDownIcon aria-hidden="true" className="opacity-60" />
        </GlassDropdownMenuTrigger>

        <GlassDropdownMenuContent>
          <GlassDropdownMenuGroup>
            <GlassDropdownMenuLabel>Workspace</GlassDropdownMenuLabel>
            <GlassDropdownMenuItem index={0}>
              <UserIcon />
              Profile
              <GlassDropdownMenuShortcut>⇧⌘P</GlassDropdownMenuShortcut>
            </GlassDropdownMenuItem>
            <GlassDropdownMenuItem index={1}>
              <CopyIcon />
              Duplicate
              <GlassDropdownMenuShortcut>⌘D</GlassDropdownMenuShortcut>
            </GlassDropdownMenuItem>
            <GlassDropdownMenuSub>
              <GlassDropdownMenuSubTrigger index={2}>
                <SettingsIcon />
                Preferences
              </GlassDropdownMenuSubTrigger>
              <GlassDropdownMenuSubContent>
                <GlassDropdownMenuItem>
                  <PaletteIcon />
                  Appearance
                </GlassDropdownMenuItem>
                <GlassDropdownMenuItem>
                  <BellIcon />
                  Alerts
                </GlassDropdownMenuItem>
                <GlassDropdownMenuItem>
                  <KeyboardIcon />
                  Shortcuts
                </GlassDropdownMenuItem>
              </GlassDropdownMenuSubContent>
            </GlassDropdownMenuSub>
          </GlassDropdownMenuGroup>

          <GlassDropdownMenuSeparator />

          <GlassDropdownMenuCheckboxItem
            checked={notifications}
            index={3}
            onCheckedChange={setNotifications}
            variant="switch"
          >
            Notifications
          </GlassDropdownMenuCheckboxItem>

          <GlassDropdownMenuSeparator />

          <GlassDropdownMenuGroup>
            <GlassDropdownMenuLabel>Density</GlassDropdownMenuLabel>
            <GlassDropdownMenuRadioGroup
              value={density}
              onValueChange={setDensity}
            >
              <GlassDropdownMenuRadioItem index={4} value="compact">
                Compact
              </GlassDropdownMenuRadioItem>
              <GlassDropdownMenuRadioItem index={5} value="comfortable">
                Comfortable
              </GlassDropdownMenuRadioItem>
            </GlassDropdownMenuRadioGroup>
          </GlassDropdownMenuGroup>

          <GlassDropdownMenuSeparator />

          <GlassDropdownMenuItem index={6} variant="destructive">
            <Trash2Icon />
            Delete
            <GlassDropdownMenuShortcut>⌘⌫</GlassDropdownMenuShortcut>
          </GlassDropdownMenuItem>
        </GlassDropdownMenuContent>
      </GlassDropdownMenu>
    </div>
  )
}
