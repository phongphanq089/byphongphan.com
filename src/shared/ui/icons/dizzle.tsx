import { cn } from "@/shared/lib"

import type { IconProps } from "./index"
const DrizzleORM = ({ size = 24, className, ...props }: IconProps) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={cn("transition-colors duration-200", className)}
  >
    <rect
      width="9.631"
      height="40.852"
      fill="#C5F74F"
      rx="4.816"
      transform="matrix(.87303 .48767 -.49721 .86763 43.48 67.304)"
    />
    <rect
      width="9.631"
      height="40.852"
      fill="#C5F74F"
      rx="4.816"
      transform="matrix(.87303 .48767 -.49721 .86763 76.94 46.534)"
    />
    <rect
      width="9.631"
      height="40.852"
      fill="#C5F74F"
      rx="4.816"
      transform="matrix(.87303 .48767 -.49721 .86763 128.424 46.535)"
    />
    <rect
      width="9.631"
      height="40.852"
      fill="#C5F74F"
      rx="4.816"
      transform="matrix(.87303 .48767 -.49721 .86763 94.957 67.304)"
    />
  </svg>
)

export { DrizzleORM }
