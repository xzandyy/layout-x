"use client";

/**
 * Workspace Rail / 侧栏菜单：`useWorkspaceMenus`、`buildWorkspaceMenuConfig`、各 rail builder 均在本文件。
 */
import { Button } from "@heroui/react";
import {
  Archive,
  Book,
  CheckDouble,
  Cube,
  Envelope,
  FaceRobot,
  FileText,
  FolderFlows,
  Gear,
  House,
  Pin,
  Plus,
  Star,
} from "@gravity-ui/icons";
import { useMemo } from "react";

import type { MenuConfig, RailMenuItem } from "@/components/Layout";

export function useWorkspaceMenus(): MenuConfig {
  return useMemo(() => buildWorkspaceMenuConfig(), []);
}

export const workspaceRailSettings: RailMenuItem = {
  label: "Settings",
  icon: <Gear />,
  sidebar: {
    items: [
      {
        type: "group",
        label: "Settings",
        menu: [
          {
            icon: <Gear />,
            label: "Integrations",
            href: "/workspace/integrations",
          },
        ],
      },
    ],
  },
};

export function buildWorkspaceMenuConfig(): MenuConfig {
  return {
    rail: [
      {
        items: [
          buildRailHome(),
          buildRailInbox(),
          buildRailAgents(),
          buildRailFlows(),
          buildRailLibrary(),
        ],
      },
    ],
  };
}

function buildRailHome(): RailMenuItem {
  return {
    label: "Home",
    icon: <House />,
    sidebar: {
      items: [
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
          label: ChannelsGroupLabel(),
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

function buildRailInbox(): RailMenuItem {
  return {
    label: "Inbox",
    icon: RailInboxIcon(3),
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
              icon: LabelDot("bg-red-500"),
              label: "Urgent",
              href: "/workspace/inbox/labels/urgent",
            },
            {
              icon: LabelDot("bg-emerald-600"),
              label: "Deals",
              href: "/workspace/inbox/labels/deals",
            },
            {
              icon: LabelDot("bg-orange-500"),
              label: "Ops",
              href: "/workspace/inbox/labels/ops",
            },
            {
              icon: LabelDot("bg-purple-500"),
              label: "Growth",
              href: "/workspace/inbox/labels/growth",
            },
          ],
        },
      ],
    },
  };
}

function buildRailAgents(): RailMenuItem {
  return {
    label: "Agents",
    icon: <FaceRobot />,
    sidebar: {
      items: [
        {
          type: "group",
          label: "MINE",
          menu: [
            {
              icon: <FaceRobot className="[&>svg]:size-3.75" />,
              label: "Overview",
              href: "/workspace/agents",
            },
            {
              icon: <Envelope className="[&>svg]:size-3.75 text-[#4F8AF7]" />,
              label: "Inbox Triage",
              href: "/workspace/agents/inbox-triage",
            },
            {
              icon: <FileText className="[&>svg]:size-3.75 text-purple-500" />,
              label: "Contract Review",
              href: "/workspace/agents/contract-review",
            },
            {
              icon: <Star className="[&>svg]:size-3.75 text-amber-500" />,
              label: "Weekly Digest",
              href: "/workspace/agents/weekly-digest",
            },
            {
              icon: <Cube className="[&>svg]:size-3.75 text-orange-500" />,
              label: "Lead Enricher",
              href: "/workspace/agents/lead-enricher",
            },
          ],
        },
        {
          type: "group",
          label: "TEMPLATES",
          menu: [
            {
              icon: <FileText className="[&>svg]:size-3.75 text-[#4F8AF7]" />,
              label: "Meeting notetaker",
              href: "/workspace/agents/templates/meeting-notetaker",
            },
            {
              icon: <Star className="[&>svg]:size-3.75 text-emerald-600" />,
              label: "Standup summariser",
              href: "/workspace/agents/templates/standup-summariser",
            },
            {
              icon: <Book className="[&>svg]:size-3.75 text-purple-500" />,
              label: "PR reviewer",
              href: "/workspace/agents/templates/pr-reviewer",
            },
          ],
        },
      ],
    },
  };
}

function buildRailFlows(): RailMenuItem {
  return {
    label: "Flows",
    icon: <FolderFlows />,
    sidebar: {
      items: [
        {
          type: "group",
          label: "LIVE",
          menu: [
            {
              icon: <FolderFlows className="[&>svg]:size-3.75" />,
              label: "Lead → CRM",
              href: "/workspace/workflows/lead-crm",
            },
            {
              icon: <FolderFlows className="[&>svg]:size-3.75" />,
              label: "Inbox sort + draft",
              href: "/workspace/workflows/inbox-sort-draft",
            },
            {
              icon: <FolderFlows className="[&>svg]:size-3.75" />,
              label: "Contract flag",
              href: "/workspace/workflows/contract-flag",
            },
            {
              icon: <FolderFlows className="[&>svg]:size-3.75" />,
              label: "Weekly brief",
              href: "/workspace/workflows/weekly-brief",
            },
          ],
        },
        {
          type: "group",
          label: "DRAFTS",
          menu: [
            {
              icon: <FolderFlows className="[&>svg]:size-3.75" />,
              label: "Invoice OCR",
              href: "/workspace/workflows/drafts/invoice-ocr",
            },
            {
              icon: <FolderFlows className="[&>svg]:size-3.75" />,
              label: "Signup handoff",
              href: "/workspace/workflows/drafts/signup-handoff",
            },
          ],
        },
      ],
    },
  };
}

function buildRailLibrary(): RailMenuItem {
  return {
    label: "Library",
    icon: <Book />,
    sidebar: {
      items: [
        {
          type: "group",
          label: "Library",
          menu: [
            {
              icon: <Book />,
              label: "Catalog",
              children: [
                {
                  icon: <Book />,
                  label: "Main",
                  href: "/workspace/library",
                },
                {
                  icon: <FileText />,
                  label: "Playbooks",
                  href: "/workspace/library/playbooks",
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

function RailInboxIcon(unread: number) {
  if (unread <= 0) return <Envelope className="size-5" />;
  return (
    <span className="relative inline-flex [&>svg]:size-5">
      <Envelope className="size-5" />
      <span
        className="absolute -right-1 -top-0.5 flex min-h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-red-600 px-[3px] text-[9px] font-semibold leading-none text-white"
        aria-hidden
      >
        {unread > 99 ? "99+" : unread}
      </span>
    </span>
  );
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

function LabelDot(className: string) {
  return (
    <span
      className={`inline-block size-2 shrink-0 rounded-full ${className}`}
      aria-hidden
    />
  );
}
