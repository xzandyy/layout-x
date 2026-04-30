"use client";

import { Archive } from "@gravity-ui/icons";
import { LayoutContentHeaderSlot } from "@/components/Layout";

export default function LibrarySnippetsPage() {
  return (
    <>
      <LayoutContentHeaderSlot>
        <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-fg-3">
          <Archive className="size-3.5 shrink-0" />
          Saved phrases & blocks
        </div>
      </LayoutContentHeaderSlot>

      <div className="w-full space-y-4 p-5 text-left">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
          Snippets
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg-1">
          Snippets
        </h1>
        <p className="text-[15px] leading-relaxed text-fg-2">
          Short reusable content under Library → Catalog → Building blocks.
        </p>
      </div>
    </>
  );
}
