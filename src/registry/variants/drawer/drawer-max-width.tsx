import { Button } from "@/registry/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/ui/drawer"

export function DrawerMaxWidth() {
  return (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Max Width Drawer
      </DrawerTrigger>
      {/* Apply max-w directly to the entire DrawerPopup with centering and side borders */}
      <DrawerPopup className="mx-auto max-w-lg sm:border-x" showBar>
        <DrawerHeader>
          <DrawerTitle>Centered Max-Width Drawer</DrawerTitle>
          <DrawerDescription>
            The entire DrawerPopup sheet is constrained to a maximum width on
            desktop.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerPanel className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Instead of stretching the entire bottom sheet across ultra-wide
            monitors, the whole <code>DrawerPopup</code> is capped with{" "}
            <code>className=&quot;mx-auto max-w-lg sm:border-x&quot;</code>.
          </p>

          <div className="rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs">
            &lt;DrawerPopup className=&quot;mx-auto max-w-lg sm:border-x&quot;
            showBar&gt;
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="rounded-md border border-border/80 bg-card p-3">
              <div className="text-xs text-muted-foreground">
                Mobile (&lt; 512px)
              </div>
              <div className="text-sm font-semibold">Full Screen Width</div>
            </div>
            <div className="rounded-md border border-border/80 bg-card p-3">
              <div className="text-xs text-muted-foreground">
                Desktop (≥ 512px)
              </div>
              <div className="text-sm font-semibold">Max 32rem (512px)</div>
            </div>
          </div>
        </DrawerPanel>
        <DrawerFooter variant="bare">
          <Button className="w-full sm:w-auto">Confirm</Button>
          <DrawerClose
            render={<Button variant="outline" className="w-full sm:w-auto" />}
          >
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerPopup>
    </Drawer>
  )
}

export default DrawerMaxWidth
