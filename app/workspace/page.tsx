"use client";

import { LayoutContentHeaderSlot } from "@/components/Layout";

export default function WorkspaceHomePage() {
  return (
    <>
      <LayoutContentHeaderSlot>
        <div className="flex min-w-0 items-center gap-2">
          <span className="rounded-md border border-emerald-700/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-emerald-800 dark:text-emerald-200">
            Live workspace
          </span>
          <span className="hidden text-[12px] text-fg-4 sm:inline">
            Home shell · Appkit
          </span>
        </div>
      </LayoutContentHeaderSlot>

      <div className="w-full space-y-4 p-5 text-left">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
          Workspace
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg-1">Home</h1>
        <p className="text-[15px] leading-relaxed text-fg-2">
          EasyX Appkit-style home: Overview in the sidebar and the first rail slot
          for the workspace entry.
        </p>
      </div>
    </>
  );
}
