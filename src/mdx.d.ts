declare module "*.mdx" {
  import type { MDXComponents } from "mdx/types"
  import type React from "react"

  export default function MDXContent(props: {
    components?: MDXComponents
  }): React.JSX.Element
}

declare module "poly-decomp" {
  const decomp: unknown
  export default decomp
}
