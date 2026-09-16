import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"
import { Field } from "@/shared/ui"

export function HelperTextSelect() {
  return (
    <Field className="w-xs">
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
    </Field>
  )
}
