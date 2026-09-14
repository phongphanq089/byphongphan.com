import type { ComponentApiDoc } from "../types"

export const SELECT_API_REFERENCE: ComponentApiDoc[] = [
  {
    componentName: "Select",
    description:
      "The root context component managing open state, value selection, and keyboard navigation.",
    props: [
      {
        name: "defaultValue?",
        type: "string",
        default: "undefined",
        description: "The initial selected value when rendered unsteadily.",
      },
      {
        name: "value?",
        type: "string",
        description: "The controlled value of the select.",
      },
      {
        name: "onValueChange?",
        type: "(value: string) => void",
        description: "Event handler called when the selected value changes.",
        typeDetails: "(value: string) => void",
      },
      {
        name: "disabled?",
        type: "boolean",
        default: "false",
        description:
          "When true, prevents user interaction and applies muted opacity styling.",
      },
      {
        name: "dir?",
        type: '"ltr" | "rtl"',
        default: '"ltr"',
        description: "The reading direction of the select popover and trigger.",
      },
    ],
  },
  {
    componentName: "SelectTrigger",
    description: "The button element that toggles the select dropdown list.",
    props: [
      {
        name: "className?",
        type: "string",
        description: "Custom CSS class names merged via cn utility.",
      },
      {
        name: "asChild?",
        type: "boolean",
        default: "false",
        description:
          "Change the default rendered element for the passed child.",
      },
    ],
  },
  {
    componentName: "SelectContent",
    description:
      "The floating card element containing grouped or individual select items.",
    props: [
      {
        name: "position?",
        type: '"item-aligned" | "popper"',
        default: '"popper"',
        description: "The positioning mode of the popover menu.",
      },
      {
        name: "sideOffset?",
        type: "number",
        default: "4",
        description:
          "Distance in pixels between the trigger button and popover boundary.",
      },
      {
        name: "className?",
        type: "string",
        description:
          "Additional CSS styles applied to the floating popover card.",
      },
    ],
  },
  {
    componentName: "SelectItem",
    description: "An individual selectable option item inside the menu.",
    props: [
      {
        name: "value",
        type: "string",
        description: "Unique string value identifying this item in callbacks.",
      },
      {
        name: "disabled?",
        type: "boolean",
        default: "false",
        description: "When true, prevents selection of this specific option.",
      },
      {
        name: "className?",
        type: "string",
        description:
          "Custom CSS classes for highlight, active, and focus states.",
      },
    ],
  },
]

export const SELECT_USAGE = {
  importCode: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"`,
  exampleCode: `<Select defaultValue="react">
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Framework" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="react">React</SelectItem>
    <SelectItem value="tanstack">TanStack Start</SelectItem>
  </SelectContent>
</Select>`,
}
