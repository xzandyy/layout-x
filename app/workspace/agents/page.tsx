"use client";

import { Button } from "@heroui/react";
import { FaceRobot } from "@gravity-ui/icons";
import { LayoutContentHeaderSlot } from "@/components/Layout";

export default function AgentsPage() {
  return (
    <>
      <LayoutContentHeaderSlot>
        <div className="flex min-w-0 items-center gap-2">
          <span className="max-w-40 truncate rounded-md bg-canvas-2 px-2 py-1 text-[11px] text-fg-3">
            Model: fast-reasoner
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 gap-1.5 rounded-md px-2.5 text-fg-2! hover:bg-canvas-2! hover:text-fg-1!"
          >
            <FaceRobot className="size-3.5" />
            Run agent
          </Button>
        </div>
      </LayoutContentHeaderSlot>

      <div className="w-full space-y-4 p-5 text-left">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
          Agents
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg-1">Agents</h1>
        <p className="text-[15px] leading-relaxed text-fg-2">
          Agents view and sidebar group, aligned with the Appkit pattern. Header slot: model
          strip + run action.
        </p>
      </div>
    </>
  );
}
