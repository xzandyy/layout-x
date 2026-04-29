"use client";

import { Button } from "@heroui/react";
import { Envelope } from "@gravity-ui/icons";
import { LayoutContentHeaderSlot } from "@/components/Layout";

export default function InboxPage() {
  return (
    <>
      <LayoutContentHeaderSlot>
        <Button
          size="sm"
          variant="secondary"
          className="shrink-0 rounded-md gap-1.5 px-2.5!"
        >
          <Envelope className="size-3.5" />
          Compose
        </Button>
      </LayoutContentHeaderSlot>

      <div className="w-full space-y-4 p-5 text-left">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
          Inbox
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg-1">Inbox</h1>
        <p className="text-[15px] leading-relaxed text-fg-2">
          Inbox zero by design — matches the Inbox rail and sidebar in the Appkit demo.
        </p>
      </div>
    </>
  );
}
