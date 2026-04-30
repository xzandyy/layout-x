"use client";

import { Cube } from "@gravity-ui/icons";
import { LayoutContentHeaderSlot } from "@/components/Layout";

export default function LibraryGuidesWorkflowsPage() {
  return (
    <>
      <LayoutContentHeaderSlot>
        <div className="flex min-w-0 items-center gap-1.5 text-[12px] text-fg-3">
          <Cube className="size-3.5 shrink-0" />
          End-to-end patterns
        </div>
      </LayoutContentHeaderSlot>

      <div className="w-full space-y-4 p-5 text-left">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
          Guides · Workflows
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg-1">
          Workflows
        </h1>
        <p className="text-[15px] leading-relaxed text-fg-2">
          How teams move work through Library-connected automation.
        </p>
      </div>
    </>
  );
}
