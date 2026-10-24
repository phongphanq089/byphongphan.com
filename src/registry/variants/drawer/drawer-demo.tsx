import { useState } from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Button } from "@/registry/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/registry/ui/drawer"

export function DrawerDemo() {
  const [goal, setGoal] = useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open Drawer
      </DrawerTrigger>
      <DrawerPopup showBar>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <DrawerPanel className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="size-8 shrink-0 rounded-full"
                onClick={() => onClick(-10)}
                disabled={goal <= 200}
              >
                <MinusIcon className="size-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-6xl font-bold tracking-tighter">
                  {goal}
                </div>
                <div className="text-[0.70rem] text-muted-foreground uppercase">
                  Calories/day
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="size-8 shrink-0 rounded-full"
                onClick={() => onClick(10)}
                disabled={goal >= 400}
              >
                <PlusIcon className="size-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            <div className="mt-4 flex h-[90px] w-full items-end justify-between gap-1 rounded-md bg-muted/40 p-2">
              {[40, 65, 80, 55, 90, 70, 85].map((val, idx) => (
                <div
                  key={idx}
                  className="w-full rounded bg-primary/20 transition-all hover:bg-primary/40"
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
          </DrawerPanel>
          <DrawerFooter variant="bare">
            <Button>Submit</Button>
            <DrawerClose render={<Button variant="outline" />}>
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerPopup>
    </Drawer>
  )
}

export default DrawerDemo
