import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/ui/select"
import { Field, FieldError, FieldLabel } from "@/shared/ui"

export function ErrorSelect() {
  return (
    <Field className="w-xs" data-invalid>
      <FieldLabel htmlFor="select-fruit-invalid">Favorite Fruit</FieldLabel>
      <Select defaultValue="invalid-item">
        <SelectTrigger className="w-full border-destructive/80 text-destructive focus:ring-destructive/30">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="invalid-item">React</SelectItem>
          <SelectItem value="valid-item">TypeScript</SelectItem>
        </SelectContent>
      </Select>
      <FieldError errors={[{ message: "Please select a valid fruit." }]} />
    </Field>
  )
}
