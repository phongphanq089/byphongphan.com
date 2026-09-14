import { Clock } from "lucide-react"
import React from "react"

import type { ComponentVariant } from "@/features/component-ui/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

// 1. Simple select
export function SimpleSelect() {
  return (
    <div className="w-full max-w-[240px]">
      <Select defaultValue="react">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="nextjs">Next.js</SelectItem>
          <SelectItem value="tanstack">TanStack Start</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

// 2. Select with placeholder
export function PlaceholderSelect() {
  return (
    <div className="w-full max-w-[240px]">
      <Select>
        <SelectTrigger className="w-full text-muted-foreground">
          <SelectValue placeholder="Please select a value" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option-1">Design Systems</SelectItem>
          <SelectItem value="option-2">Micro-frontends</SelectItem>
          <SelectItem value="option-3">Server Components</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

// 3. Select with icon
export function IconSelect() {
  return (
    <div className="w-full max-w-[240px]">
      <Select defaultValue="all-day">
        <SelectTrigger className="w-full gap-2">
          <Clock className="size-3.5 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-day">00:00 AM - 11:59 PM</SelectItem>
          <SelectItem value="morning">08:00 AM - 12:00 PM</SelectItem>
          <SelectItem value="afternoon">01:00 PM - 05:00 PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

// 4. Select with helper text
export function HelperTextSelect() {
  return (
    <div className="flex w-full max-w-[240px] flex-col gap-1.5">
      <Select defaultValue="react">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
          <SelectItem value="solid">Solid</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-[11px] text-muted-foreground">
        Tell us what's your favorite Select framework
      </span>
    </div>
  )
}

// 5. Select with colored border
export function ColoredBorderSelect() {
  return (
    <div className="w-full max-w-[240px]">
      <Select defaultValue="react">
        <SelectTrigger className="w-full border-pp-primary/60 hover:border-pp-primary focus:ring-pp-primary/30">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

// 6. Select with error state
export function ErrorSelect() {
  return (
    <div className="flex w-full max-w-[240px] flex-col gap-1.5">
      <Select defaultValue="invalid-item">
        <SelectTrigger className="w-full border-destructive/80 text-destructive focus:ring-destructive/30">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="invalid-item">React</SelectItem>
          <SelectItem value="valid-item">TypeScript</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-[11px] text-destructive">
        Selected option is invalid
      </span>
    </div>
  )
}

export const SELECT_VARIANTS: ComponentVariant[] = [
  {
    id: "simple-select",
    title: "Simple select (native)",
    description: "Basic select trigger with predefined default value.",
    component: SimpleSelect,
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SimpleSelect() {
  return (
    <Select defaultValue="react">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="nextjs">Next.js</SelectItem>
        <SelectItem value="tanstack">TanStack Start</SelectItem>
      </SelectContent>
    </Select>
  )
}`,
  },
  {
    id: "placeholder-select",
    title: "Select with placeholder (native)",
    description: "Displays muted prompt text before option is selected.",
    component: PlaceholderSelect,
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PlaceholderSelect() {
  return (
    <Select>
      <SelectTrigger className="w-[200px] text-muted-foreground">
        <SelectValue placeholder="Please select a value" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option-1">Design Systems</SelectItem>
        <SelectItem value="option-2">Micro-frontends</SelectItem>
      </SelectContent>
    </Select>
  )
}`,
  },
  {
    id: "icon-select",
    title: "Select with icon (native)",
    description: "Inline decorative or context icon before the active value.",
    component: IconSelect,
    code: `import { Clock } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function IconSelect() {
  return (
    <Select defaultValue="all-day">
      <SelectTrigger className="w-[220px] gap-2">
        <Clock className="size-3.5 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all-day">00:00 AM - 11:59 PM</SelectItem>
        <SelectItem value="morning">08:00 AM - 12:00 PM</SelectItem>
      </SelectContent>
    </Select>
  )
}`,
  },
  {
    id: "helper-text-select",
    title: "Select with helper text (native)",
    description: "Sub-label guidance caption underneath the trigger box.",
    component: HelperTextSelect,
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function HelperTextSelect() {
  return (
    <div className="flex flex-col gap-1.5">
      <Select defaultValue="react">
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-[11px] text-muted-foreground">
        Tell us what's your favorite Select framework
      </span>
    </div>
  )
}`,
  },
  {
    id: "colored-border-select",
    title: "Select with colored border (native)",
    description: "Brand accent stroke highlight for prominent input stages.",
    component: ColoredBorderSelect,
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ColoredBorderSelect() {
  return (
    <Select defaultValue="react">
      <SelectTrigger className="w-[200px] border-primary/60 hover:border-primary">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="vue">Vue</SelectItem>
      </SelectContent>
    </Select>
  )
}`,
  },
  {
    id: "error-select",
    title: "Select with error (native)",
    description:
      "Red invalid status outline paired with form validation message.",
    component: ErrorSelect,
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ErrorSelect() {
  return (
    <div className="flex flex-col gap-1.5">
      <Select defaultValue="react">
        <SelectTrigger className="w-[200px] border-destructive text-destructive">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-[11px] text-destructive">
        Selected option is invalid
      </span>
    </div>
  )
}`,
  },
]
