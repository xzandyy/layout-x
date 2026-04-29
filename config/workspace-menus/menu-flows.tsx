"use client";

import { FolderFlows } from "@gravity-ui/icons";
import { useMemo } from "react";

import type { RailMenuItem } from "@/components/Layout";

export function useMenuFlows(): RailMenuItem {
  return useMemo(() => createMenuFlows(), []);
}

export function createMenuFlows(): RailMenuItem {
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
