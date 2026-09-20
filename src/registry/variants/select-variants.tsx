import type { ComponentVariant } from "@/features/component-ui/types"

import { ColoredBorderSelect } from "./select/colored-border-select"
import { ErrorSelect } from "./select/error-select"
import { HelperTextSelect } from "./select/helper-text-select"
import { IconSelect } from "./select/icon-select"
import { OptionsWithFlag } from "./select/options-with-flag"
import { PlaceholderSelect } from "./select/placeholder-select"
import { SearchAndButton } from "./select/search-and-button"
import { SelectGroupVariant } from "./select/select-group"

export const SELECT_VARIANTS: ComponentVariant[] = [
  {
    id: "placeholder-select",
    title: "With Placeholder",
    component: PlaceholderSelect,
  },
  {
    id: "icon-select",
    title: "With Icon",
    component: IconSelect,
  },
  {
    id: "helper-text-select",
    title: "With Helper Text",
    component: HelperTextSelect,
  },
  {
    id: "select-group",
    title: "Select with options groups",
    component: SelectGroupVariant,
  },
  {
    id: "options-with-flag",
    title: "Select options with flag",
    component: OptionsWithFlag,
  },
  {
    id: "colored-border-select",
    title: "Colored Border",
    component: ColoredBorderSelect,
  },
  {
    id: "error-select",
    title: "Error State",
    component: ErrorSelect,
  },
  {
    id: "search-and-button",
    title: "Error State",
    component: SearchAndButton,
  },
]

export {
  ColoredBorderSelect,
  ErrorSelect,
  HelperTextSelect,
  IconSelect,
  PlaceholderSelect,
}
