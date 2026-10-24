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

export function DrawerScrollable() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Scrollable Content
      </DrawerTrigger>
      <DrawerPopup showBar>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Scrollable Content</DrawerTitle>
            <DrawerDescription>
              Built-in smooth scrolling with automatic scroll fade indicators.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerPanel className="max-h-[60vh]">
            <div className="flex flex-col gap-2">
              {Array.from({ length: 48 }, (_, i) => `box-${i}`).map((key) => (
                <div
                  className="flex h-12 shrink-0 items-center justify-between rounded-xl border border-border bg-muted/40 px-4 font-mono text-xs text-muted-foreground"
                  key={key}
                >
                  <span>Item {key}</span>
                  <span className="size-2 rounded-full bg-primary/40" />
                </div>
              ))}
            </div>
          </DrawerPanel>
          <DrawerFooter variant="bare">
            <DrawerClose render={<Button variant="outline" />}>
              Done
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerPopup>
    </Drawer>
  )
}

export default DrawerScrollable
