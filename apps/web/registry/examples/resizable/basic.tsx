"use client"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@applecn/ui/components/resizable"

export default function ResizableBasic() {
  return (
    // The group sizes itself to its parent — `react-resizable-panels` writes `height: 100%` and
    // `width: 100%` inline, which beats any class — so the height is set on the box around it.
    <div className="h-64 w-full max-w-2xl overflow-hidden rounded-card border-[0.5px] border-separator">
      <ResizablePanelGroup aria-label="Library">
        {/* A number is pixels in react-resizable-panels v4; a bare string is per cent. */}
        <ResizablePanel
          defaultSize="30"
          minSize="20"
          className="bg-sidebar p-4"
        >
          <p className="type-footnote text-label-2">Sidebar</p>
          <p className="type-subheadline">Playlists</p>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="p-4">
          <ResizablePanelGroup orientation="vertical" aria-label="Detail">
            <ResizablePanel className="pb-3">
              <p className="type-footnote text-label-2">Now playing</p>
              <p className="type-subheadline">Drag either seam</p>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="pt-3">
              <p className="type-footnote text-label-2">Up next</p>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
