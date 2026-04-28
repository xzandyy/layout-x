import {
  Book,
  CheckDouble,
  Envelope,
  FaceRobot,
  FileText,
  FolderFlows,
  Gear,
  House,
} from "@gravity-ui/icons";

import type { MenuConfig } from "@/components/Layout";

export const workspaceMenus: MenuConfig = {
  defaultRailMenuId: "home",
  rail: [
    {
      items: [
        {
          id: "home",
          label: "Home",
          icon: <House />,
          sidebar: {
            items: [
              {
                type: "group",
                label: "Overview",
                menu: [
                  {
                    icon: <House />,
                    label: "Home",
                    href: "/workspace",
                  },
                ],
              },
            ],
          },
        },
        {
          id: "inbox",
          label: "Inbox",
          icon: <Envelope />,
          sidebar: {
            items: [
              {
                type: "group",
                label: "Inbox",
                menu: [
                  {
                    icon: <Envelope />,
                    label: "Inbox",
                    href: "/workspace/inbox",
                  },
                  {
                    icon: <CheckDouble />,
                    label: "Review",
                    href: "/workspace/inbox/review",
                  },
                ],
              },
            ],
          },
        },
        {
          id: "agents",
          label: "Agents",
          icon: <FaceRobot />,
          sidebar: {
            items: [
              {
                type: "group",
                label: "Agents",
                menu: [
                  {
                    icon: <FaceRobot />,
                    label: "Overview",
                    href: "/workspace/agents",
                  },
                ],
              },
            ],
          },
        },
        {
          id: "workflows",
          label: "Flows",
          icon: <FolderFlows />,
          sidebar: {
            items: [
              {
                type: "group",
                label: "Workflows",
                menu: [
                  {
                    icon: <FolderFlows />,
                    label: "All",
                    children: [
                      {
                        icon: <FolderFlows />,
                        label: "Board",
                        href: "/workspace/workflows",
                      },
                      {
                        icon: <FolderFlows />,
                        label: "Lead → CRM",
                        href: "/workspace/workflows/lead-crm",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          id: "library",
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
        },
        {
          id: "integrations",
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
        },
      ],
    },
  ],
};
