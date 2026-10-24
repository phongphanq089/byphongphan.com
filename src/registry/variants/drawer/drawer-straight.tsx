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

export function DrawerStraight() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Straight Drawer
      </DrawerTrigger>
      <DrawerPopup variant="straight" showBar>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Straight Corners</DrawerTitle>
            <DrawerDescription>
              A minimalist, architectural drawer style with zero radius and no
              nested scaling.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerPanel>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>
                The straight variant disables corner rounding and nested drawer
                scale transforms, presenting a pure flush rectangular sheet
                ideal for terminal, editorial, or modernist designs.
              </p>
              <div className="rounded-none border border-border bg-muted/50 p-4 font-mono text-xs">
                variant=&quot;straight&quot;
              </div>
            </div>
          </DrawerPanel>
          <DrawerFooter variant="bare">
            <DrawerClose render={<Button variant="outline" />}>
              Close
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerPopup>
    </Drawer>
  )
}

export default DrawerStraight
