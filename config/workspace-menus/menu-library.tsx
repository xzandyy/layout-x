"use client";

import { Archive, Book, Cube, FileText, Gear, Star } from "@gravity-ui/icons";
import { useMemo } from "react";

import type { RailMenuItem } from "@/components/Layout";

export function useMenuLibrary(): RailMenuItem {
  return useMemo(() => createMenuLibrary(), []);
}

export function createMenuLibrary(): RailMenuItem {
  return {
    label: "Library",
    icon: <Book />,
    sidebar: {
      items: [
        {
          type: "group",
          label: "Catalog",
          menu: [
            {
              icon: <Star />,
              label: "Overview",
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
            {
              icon: <Cube />,
              label: "Building blocks",
              children: [
                {
                  icon: <Cube />,
                  label: "Templates",
                  href: "/workspace/library/templates",
                },
                {
                  icon: <Archive />,
                  label: "Snippets",
                  href: "/workspace/library/snippets",
                },
              ],
            },
          ],
        },
        {
          type: "group",
          label: "Guides",
          menu: [
            {
              icon: <Book />,
              label: "Getting started",
              children: [
                {
                  icon: <Book />,
                  label: "Overview",
                  href: "/workspace/library/guides/overview",
                },
                {
                  icon: <Cube />,
                  label: "Workflows",
                  href: "/workspace/library/guides/workflows",
                },
              ],
            },
          ],
        },
        {
          type: "group",
          label: "Reference",
          menu: [
            {
              icon: <FileText />,
              label: "Docs",
              children: [
                {
                  icon: <Book />,
                  label: "Glossary",
                  href: "/workspace/library/reference/glossary",
                },
                {
                  icon: <FileText />,
                  label: "Changelog",
                  href: "/workspace/library/reference/changelog",
                },
              ],
            },
            {
              icon: <Star />,
              label: "Media library",
              children: [
                {
                  icon: <Star />,
                  label: "Brand kit",
                  href: "/workspace/library/media/brand",
                },
                {
                  icon: <Gear />,
                  label: "Uploads",
                  href: "/workspace/library/media/uploads",
                },
              ],
            },
          ],
        },
      ],
    },
  };
}
