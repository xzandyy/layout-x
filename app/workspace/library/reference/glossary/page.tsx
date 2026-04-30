"use client";

import { Book } from "@gravity-ui/icons";
import { LayoutContentHeaderSlot } from "@/components/Layout";

export default function LibraryReferenceGlossaryPage() {
  return (
    <>
      <LayoutContentHeaderSlot>
        <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-fg-3">
          <Book className="size-3.5 shrink-0" />
          Terms & definitions
        </div>
      </LayoutContentHeaderSlot>

      <div className="w-full space-y-4 p-5 text-left">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
          Reference · Glossary
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg-1">
          Glossary
        </h1>
        <p className="text-[15px] leading-relaxed text-fg-2">
          Shared vocabulary for Library and workspace features.
        </p>
      </div>
    </>
  );
}
