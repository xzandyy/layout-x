"use client";

import { Button } from "@heroui/react";
import { CheckDouble } from "@gravity-ui/icons";
import { LayoutContentHeaderSlot } from "@/components/Layout";

export default function InboxReviewPage() {
  return (
    <>
      <LayoutContentHeaderSlot>
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-[12px] tabular-nums text-fg-4">Review queue</span>
          <Button
            size="sm"
            variant="primary"
            className="shrink-0 rounded-md gap-1.5 px-2.5!"
          >
            <CheckDouble className="size-3.5" />
            Approve checked
          </Button>
        </div>
      </LayoutContentHeaderSlot>

      <div className="w-full space-y-4 p-5 text-left">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-fg-4">
          Review
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-fg-1">Review</h1>
        <p className="text-[15px] leading-relaxed text-fg-2">
          Breadcrumb segment: Workspace / Inbox / Review.
        </p>
      </div>
    </>
  );
}
