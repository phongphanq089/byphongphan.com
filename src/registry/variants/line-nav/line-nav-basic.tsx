import { useState } from "react"
import { LineNav, type LineNavItem } from "@/registry/animated/line-nav"

const BASIC_ITEMS: LineNavItem[] = [
  { title: "Pixel preloader", href: "#pixel-preloader" },
  { title: "Box loading preloader", href: "#box-loading-preloader" },
  { title: "Vercel Liquid simulation", href: "#vercel-liquid" },
  { title: "Ascii Simulation", href: "#ascii-simulation" },
  { title: "Interactive3d Hero", href: "#interactive3d-hero" },
  { title: "Canvas crowd", href: "#canvas-crowd" },
  { title: "Nike menu", href: "#nike-menu" },
  { title: "Apple Navbar V001", href: "#apple-navbar-v001" },
  { title: "Card stack scroll", href: "#card-stack-scroll" },
]

export function LineNavBasic() {
  const [activeHref, setActiveHref] = useState<string>("#pixel-preloader")

  return (
    <div className="mx-auto w-full max-w-sm">
      <LineNav
        items={BASIC_ITEMS}
        activeHref={activeHref}
        scrollActiveIntoView={false}
        onItemClick={(item, e) => {
          e.preventDefault()
          if (item.href) {
            setActiveHref(item.href)
          }
        }}
      />
    </div>
  )
}

export default LineNavBasic
