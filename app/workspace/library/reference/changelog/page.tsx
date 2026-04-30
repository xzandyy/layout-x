"use client";

import { FileText } from "@gravity-ui/icons";
import { LayoutContentHeaderSlot } from "@/components/Layout";

export default function LibraryReferenceChangelogPage() {
  return (
    <>
      <LayoutContentHeaderSlot>
        <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-fg-3">
          <FileText className="size-3.5 shrink-0" />
          What shipped
        </div>
      </LayoutContentHeaderSlot>

      <div className="w-full space-y-4 p-5 text-left">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
          Reference · Changelog
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg-1">
          Changelog
        </h1>
        <p className="text-[15px] leading-relaxed text-fg-2">
          Library content and blueprint updates over time.
        </p>
      </div>
    </>
  );
}
