"use client";

import { Button } from "@heroui/react";
import { FileText } from "@gravity-ui/icons";
import { useContentHeaderSlot } from "@/components/Layout";

export default function PlaybooksPage() {
  useContentHeaderSlot(
    () => (
      <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-dashed border-border-hair px-2 py-1">
        <FileText className="size-3.5 shrink-0 text-fg-3" />
        <Button
          size="sm"
          variant="secondary"
          className="min-h-7 shrink-0 rounded-md px-2 text-[12px]!"
        >
          Clone playbook
        </Button>
      </div>
    ),
    [],
  );

  return (
    <div className="w-full space-y-4 p-5 text-left">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
        Playbooks
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-fg-1">Playbooks</h1>
      <p className="text-[15px] leading-relaxed text-fg-2">
        Library / Playbooks segment in the breadcrumb trail.
      </p>
    </div>
  );
}
