"use client";

import { Button } from "@heroui/react";
import { ArrowRight } from "@gravity-ui/icons";
import { LayoutContentHeaderSlot } from "@/components/Layout";

export default function LeadCrmPage() {
  return (
    <>
      <LayoutContentHeaderSlot>
        <div className="flex min-w-0 items-center">
          <Button
            size="sm"
            variant="secondary"
            className="shrink-0 rounded-md gap-1.5 px-2.5!"
          >
            Sync to CRM
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </LayoutContentHeaderSlot>

      <div className="w-full space-y-4 p-5 text-left">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
          Lead → CRM
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg-1">Lead to CRM</h1>
        <p className="text-[15px] leading-relaxed text-fg-2">
          Breadcrumb: Workspace / Workflows / Lead → CRM.
        </p>
      </div>
    </>
  );
}
