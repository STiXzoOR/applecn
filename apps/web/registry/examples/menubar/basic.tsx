"use client"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@applecn/ui/components/menubar"

export default function MenubarBasic() {
  return (
    <Menubar className="w-full max-w-lg rounded-control bg-fill-4">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">Finder</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>About Finder</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Settings… <MenubarShortcut>⌘,</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Empty Trash…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Finder Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Folder <MenubarShortcut>⇧⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Open With</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Preview</MenubarItem>
              <MenubarItem>TextEdit</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem>
            Close Window <MenubarShortcut>⌘W</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem defaultChecked>Show Sidebar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show Path Bar</MenubarCheckboxItem>
          <MenubarCheckboxItem>Show Status Bar</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
