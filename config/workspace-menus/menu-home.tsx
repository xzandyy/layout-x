"use client";

import { Button } from "@heroui/react";
import {
  FileText,
  House,
  Pin,
  Plus,
  Star,
} from "@gravity-ui/icons";
import { useMemo } from "react";

import type { RailMenuItem } from "@/components/Layout";

export function useMenuHome(): RailMenuItem {
  return useMemo(() => createMenuHome(), []);
}

export function createMenuHome(): RailMenuItem {
  return {
    label: "Home",
    icon: <House />,
    sidebar: {
      items: [
        {
          type: "group",
          label: "HOME",
          menu: [
            {
              icon: <House />,
              label: "Home",
              href: "/workspace",
            },
          ],
        },
        {
          type: "group",
          label: "MY VIEWS",
          menu: [
            {
              icon: <Star className="[&>svg]:size-3.75" />,
              label: "Today",
              href: "/workspace/views/today",
            },
            {
              icon: <FileText className="[&>svg]:size-3.75" />,
              label: "Drafts",
              href: "/workspace/views/drafts",
              chip: "3",
            },
            {
              icon: <Pin className="[&>svg]:size-3.75" />,
              label: "Pinned",
              href: "/workspace/views/pinned",
            },
          ],
        },
        {
          type: "group",
          label: <ChannelsGroupLabel />,
          menu: [
            {
              icon: <span className="text-[11px] text-fg-4">#</span>,
              label: "team-ops",
              href: "/workspace/channels/team-ops",
            },
            {
              icon: <span className="text-[11px] text-fg-4">#</span>,
              label: "sales-signal",
              href: "/workspace/channels/sales-signal",
            },
            {
              icon: <span className="text-[11px] text-fg-4">#</span>,
              label: "product",
              href: "/workspace/channels/product",
            },
            {
              icon: <span className="text-[11px] text-fg-4">#</span>,
              label: "eng-alerts",
              href: "/workspace/channels/eng-alerts",
            },
          ],
        },
        {
          type: "group",
          label: "DIRECT MESSAGES",
          menu: [
            {
              icon: (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#4F8AF7] text-[10px] font-semibold text-white">
                  NG
                </span>
              ),
              label: "Noor Ganguly",
              href: "/workspace/dm/noor-ganguly",
              chip: "2",
            },
            {
              icon: (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-purple-600 text-[10px] font-semibold text-white">
                  CY
                </span>
              ),
              label: "Chloe Yen",
              href: "/workspace/dm/chloe-yen",
            },
            {
              icon: (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-semibold text-white">
                  MF
                </span>
              ),
              label: "Marcus Finch",
              href: "/workspace/dm/marcus-finch",
            },
          ],
        },
      ],
    },
  };
}

function ChannelsGroupLabel() {
  return (
    <div className="flex w-full min-w-0 items-center justify-between gap-2 pr-0.5">
      <span>CHANNELS</span>
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        aria-label="Add channel"
        className="size-6 min-w-6 shrink-0 rounded-md p-0 text-fg-3 hover:bg-canvas-2 hover:text-fg-1"
      >
        <Plus className="size-3.5 text-current" />
      </Button>
    </div>
  );
}
