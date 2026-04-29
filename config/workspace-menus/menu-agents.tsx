"use client";

import {
  Book,
  Cube,
  Envelope,
  FaceRobot,
  FileText,
  Star,
} from "@gravity-ui/icons";
import { useMemo } from "react";

import type { RailMenuItem } from "@/components/Layout";

export function useMenuAgents(): RailMenuItem {
  return useMemo(() => createMenuAgents(), []);
}

export function createMenuAgents(): RailMenuItem {
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
