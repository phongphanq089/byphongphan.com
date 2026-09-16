import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"
import { Field } from "@/shared/ui"

export function ColoredBorderSelect() {
  return (
    <Field className="w-xs">
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
    </Field>
  )
}
