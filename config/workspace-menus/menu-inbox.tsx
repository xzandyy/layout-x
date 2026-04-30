"use client";

import { Archive, CheckDouble, Envelope } from "@gravity-ui/icons";
import { useMemo } from "react";

import type { RailMenuItem } from "@/components/Layout";

const inboxUnread = 3;

export function useMenuInbox(): RailMenuItem {
  return useMemo(() => createMenuInbox(inboxUnread), [inboxUnread]);
}

export function createMenuInbox(inboxUnread = 3): RailMenuItem {
  return {
    label: "Inbox",
    icon: <RailInboxIcon unread={inboxUnread} />,
    sidebar: {
      items: [
        {
          type: "group",
          label: "FOLDERS",
          menu: [
            {
              icon: <Envelope className="[&>svg]:size-3.75" />,
              label: "Primary",
              href: "/workspace/inbox",
              chip: "12",
            },
            {
              icon: <CheckDouble className="[&>svg]:size-3.75" />,
              label: "Review",
              href: "/workspace/inbox/review",
              chip: "3",
            },
            {
              icon: <Archive className="[&>svg]:size-3.75" />,
              label: "Archive",
              href: "/workspace/inbox/archive",
            },
          ],
        },
        {
          type: "group",
          label: "LABELS",
          menu: [
            {
              icon: <LabelDot className="bg-red-500" />,
              label: "Urgent",
              href: "/workspace/inbox/labels/urgent",
            },
            {
              icon: <LabelDot className="bg-emerald-600" />,
              label: "Deals",
              href: "/workspace/inbox/labels/deals",
            },
            {
              icon: <LabelDot className="bg-orange-500" />,
              label: "Ops",
              href: "/workspace/inbox/labels/ops",
            },
            {
              icon: <LabelDot className="bg-purple-500" />,
              label: "Growth",
              href: "/workspace/inbox/labels/growth",
            },
          ],
        },
      ],
    },
  };
}

function RailInboxIcon({ unread }: { unread: number }) {
  if (unread <= 0) return <Envelope className="size-5" />;
  return (
    <span className="relative inline-flex [&>svg]:size-5">
      <Envelope className="size-5" />
      <span
        className="absolute -right-2.5 -top-0.5 flex min-h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-red-600 px-[3px] text-[9px] font-semibold leading-none text-white"
        aria-hidden
      >
        {unread > 99 ? "99+" : unread}
      </span>
    </span>
  );
}

function LabelDot({ className }: { className: string }) {
  return (
    <span
      className={`inline-block size-2 shrink-0 rounded-full ${className}`}
      aria-hidden
    />
  );
}
