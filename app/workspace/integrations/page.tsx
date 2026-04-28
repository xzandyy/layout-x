"use client";

import { Button } from "@heroui/react";
import { Gear } from "@gravity-ui/icons";
import { useContentHeaderSlot } from "@/components/Layout";

export default function IntegrationsPage() {
  useContentHeaderSlot(
    () => (
      <div className="flex min-w-0 items-center gap-2">
        <code className="hidden max-w-32 truncate rounded bg-canvas-2 px-1.5 py-0.5 font-mono text-[10px] text-fg-3 md:inline">
          oauth.state=ready
        </code>
        <Button
          size="sm"
          variant="primary"
          className="shrink-0 rounded-md gap-1.5 px-2.5!"
        >
          <Gear className="size-3.5" />
          Connect app
        </Button>
      </div>
    ),
    [],
  );

  return (
    <div className="w-full space-y-4 p-5 text-left">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
        Settings
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-fg-1">Integrations</h1>
      <p className="text-[15px] leading-relaxed text-fg-2">
        Settings / Integrations and the gear rail entry, as in the Appkit shell.
      </p>
    </div>
  );
}
