import {
  ActivityIcon,
  LayoutDashboardIcon,
  ScanIcon,
  SettingsIcon,
  ShieldIcon,
} from "lucide-react"
import type { ReactElement } from "react"

import { Field } from "@/registry/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

interface IconPlaceholderProps {
  lucide: string
  tabler: string
  hugeicons: string
  phosphor: string
  remixicon: string
  className?: string
}

interface Item {
  label: string
  value: string | null
  icon: ReactElement<IconPlaceholderProps>
}

const items: Item[] = [
  {
    label: "Select an option",
    value: null,
    icon: <ScanIcon className="size-4 text-muted-foreground" />,
  },
  {
    label: "Dashboard",
    value: "dashboard",
    icon: <LayoutDashboardIcon className="size-4 text-muted-foreground" />,
  },
  {
    label: "Activity",
    value: "activity",
    icon: <ActivityIcon className="size-4 text-muted-foreground" />,
  },
  {
    label: "Security",
    value: "security",
    icon: <ShieldIcon className="size-4 text-muted-foreground" />,
  },
  {
    label: "Settings",
    value: "settings",
    icon: <SettingsIcon className="size-4 text-muted-foreground" />,
  },
]

export function IconSelect() {
  return (
    <Field className="w-xs">
      <Select>
        <SelectTrigger className="[&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80">
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80">
          {items.map((item) => {
            return (
              <SelectItem value={item.value as string} key={item.value}>
                {item?.icon && item.icon}
                <span className="truncate">React</span>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </Field>
  )
}
