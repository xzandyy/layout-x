"use client";

import { Button } from "@heroui/react";
import { Book } from "@gravity-ui/icons";
import { LayoutContentHeaderSlot } from "@/components/Layout";

export default function LibraryPage() {
  return (
    <>
      <LayoutContentHeaderSlot>
        <Button
          size="sm"
          variant="ghost"
          className="shrink-0 rounded-md gap-1.5 px-2 text-fg-2! hover:bg-canvas-2! hover:text-fg-1!"
        >
          <Book className="size-3.5" />
          Open catalog
        </Button>
      </LayoutContentHeaderSlot>

      <div className="w-full space-y-4 p-5 text-left">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
          Library
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg-1">Library</h1>
        <p className="text-[15px] leading-relaxed text-fg-2">
          Main index next to Playbooks under the Library → Catalog group in the sidebar.
        </p>
      </div>
    </>
  );
}
