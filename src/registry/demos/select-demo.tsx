import { Field } from "@/registry/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"

export function SelectDemo() {
  return (
    <Field className="w-xs">
      <Select defaultValue="react">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frameworks</SelectLabel>
            <SelectItem value="react">React 19</SelectItem>
            <SelectItem value="nextjs">Next.js 15</SelectItem>
            <SelectItem value="tanstack">TanStack Start</SelectItem>
            <SelectItem value="vue">Vue 3</SelectItem>
            <SelectItem value="svelte">Svelte 5</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
