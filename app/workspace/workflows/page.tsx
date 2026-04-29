"use client";

import { Button } from "@heroui/react";
import { FolderFlows } from "@gravity-ui/icons";
import {
  LayoutContentFooterSlot,
  LayoutContentHeaderSlot,
} from "@/components/Layout";

export default function WorkflowsPage() {
  return (
    <>
      <LayoutContentHeaderSlot>
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
          <span className="text-[11px] text-fg-4">Board</span>
          <Button
            size="sm"
            variant="ghost"
            isIconOnly
            aria-label="Board menu"
            className="size-7 min-w-7 rounded-md"
          >
            <FolderFlows className="size-3.5" />
          </Button>
        </div>
      </LayoutContentHeaderSlot>

      <LayoutContentFooterSlot>
        <div className="flex min-w-0 items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 rounded-md gap-1.5 px-2.5! text-fg-2! hover:bg-canvas-2!"
          >
            <FolderFlows className="size-3.5" />
            Add swimlane
          </Button>
        </div>
      </LayoutContentFooterSlot>

      <div className="w-full space-y-4 p-5 text-left">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
          Workflows
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg-1">Workflow board</h1>
        <p className="text-[15px] leading-relaxed text-fg-2">
          Open from the sidebar under All → Board, alongside the Lead → CRM child route.
        </p>
      </div>
    </>
  );
}
