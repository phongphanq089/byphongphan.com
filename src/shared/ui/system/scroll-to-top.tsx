import { ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/shared/lib/utils"
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/core"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop
      if (scrolled > 300) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }
    window.addEventListener("scroll", toggleVisible)
    return () => window.removeEventListener("scroll", toggleVisible)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          size={"icon-lg"}
          variant={"outline"}
          className={cn("flex", !visible ? "hidden" : "flex")}
        >
          <ChevronUp className="h-5 w-5 text-white/70 transition-colors group-hover:text-white" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Srcoll to top</TooltipContent>
    </Tooltip>
  )
}
