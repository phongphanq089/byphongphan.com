import { MiddleTruncation } from "@/registry/ui/middle-truncation"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/ui/resizable"

export function MiddleTruncationDemo() {
  return (
    <div className="flex w-full items-center justify-center p-2 sm:p-6">
      <div className="w-full max-w-2xl">
        <ResizablePanelGroup
          direction="horizontal"
          className="relative min-h-[360px] w-full items-center justify-start overflow-visible"
        >
          <ResizablePanel
            defaultSize="85%"
            minSize="30%"
            maxSize="100%"
            className="relative flex flex-col justify-center rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl transition-[flex] select-none"
          >
            <div className="flex flex-col gap-6">
              {/* Item 1: Default */}
              <div className="flex flex-col gap-1.5 overflow-hidden">
                <span className="font-mono text-xs tracking-tight whitespace-nowrap text-muted-foreground">
                  &lt;MiddleTruncation&gt;
                </span>
                <MiddleTruncation className="font-mono text-sm text-foreground">
                  /Users/ncdai/Code/chanhdai/src/components/ui/button.tsx
                </MiddleTruncation>
              </div>

              {/* Item 2: end={4} */}
              <div className="flex flex-col gap-1.5 overflow-hidden">
                <span className="font-mono text-xs tracking-tight whitespace-nowrap text-muted-foreground">
                  &lt;MiddleTruncation end={4}&gt;
                </span>
                <MiddleTruncation
                  end={4}
                  className="font-mono text-sm text-foreground"
                >
                  FY26_Q1_Consolidated_Financial_Statements.pdf
                </MiddleTruncation>
              </div>

              {/* Item 3: minEnd={12} */}
              <div className="flex flex-col gap-1.5 overflow-hidden">
                <span className="font-mono text-xs tracking-tight whitespace-nowrap text-muted-foreground">
                  &lt;MiddleTruncation minEnd={12}&gt;
                </span>
                <MiddleTruncation
                  minEnd={12}
                  className="font-mono text-sm text-foreground"
                >
                  /Users/ncdai/Code/chanhdai/node_modules/shadcn/package.json
                </MiddleTruncation>
              </div>

              {/* Item 4: ellipsis=" ... " */}
              <div className="flex flex-col gap-1.5 overflow-hidden">
                <span className="font-mono text-xs tracking-tight whitespace-nowrap text-muted-foreground">
                  &lt;MiddleTruncation ellipsis=" ... "&gt;
                </span>
                <MiddleTruncation
                  ellipsis=" ... "
                  className="font-mono text-sm text-foreground"
                >
                  https://www.apple.com/newsroom/2026/01/FY26_Q1_Consolidated_Financial_Statements.pdf
                </MiddleTruncation>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle
            withHandle
            className="z-20 -ml-1 border-none bg-transparent hover:bg-transparent"
          />

          <ResizablePanel defaultSize="15%" minSize="0%" maxSize="70%" />
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
