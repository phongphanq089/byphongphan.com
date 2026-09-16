import { useId } from "react"

import {
  Field,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui"

export function SelectGroupVariant() {
  const id = useId()
  return (
    <Field className="w-xs">
      <Select defaultValue="1">
        <SelectTrigger id={id}>
          <SelectValue placeholder="Select framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Frontend</SelectLabel>
            <SelectItem value="1">React</SelectItem>
            <SelectItem value="2">Vue</SelectItem>
            <SelectItem value="3">Angular</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Backend</SelectLabel>
            <SelectItem value="4">Node.js</SelectItem>
            <SelectItem value="5">Python</SelectItem>
            <SelectItem value="6">Java</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
