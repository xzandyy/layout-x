"use client";

import { useCallback, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar as HeroSidebar } from "@heroui-pro/react";

import { cn } from "@/lib/utils";
import type { RouteConfig, RailMenuItem } from "./types";
import { LayoutContext, type RootState } from "./layout-context";
import { findBestEntryIdForPathname } from "./sidebar";

export type LayoutProps = {
  headerHeight?: number;
  railWidth?: number;
  sidebarWidth?: number;
  className?: string;
  routeMenu?: RouteConfig;
  children: ReactNode;
  defaultSidebarOpen?: boolean;
};

export function LayoutRootClient({
  headerHeight = 3.25,
  railWidth = 4,
  sidebarWidth = 16.5,
  defaultSidebarOpen = true,
  className,
  routeMenu,
  children,
}: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const [railOverride, setRailOverride] = useState<{
    entryId: string;
    forPathname: string;
  } | null>(null);

  const allRailItems = useMemo(() => collectRailMenuItems(routeMenu), [routeMenu]);

  const urlEntryId = useMemo(
    () =>
      routeMenu ? findBestEntryIdForPathname(routeMenu, pathname) : undefined,
    [routeMenu, pathname],
  );

  const fallbackId = useMemo(() => {
    if (!allRailItems.length) return undefined;
    return routeMenu?.defaultRailItemId ?? allRailItems[0]!.id;
  }, [routeMenu, allRailItems]);

  const activeEntryId = useMemo(() => {
    if (!routeMenu) return undefined;
    if (railOverride != null && railOverride.forPathname === pathname) {
      return railOverride.entryId;
    }
    return urlEntryId ?? fallbackId;
  }, [routeMenu, railOverride, pathname, urlEntryId, fallbackId]);

  const activeEntry = useMemo(() => {
    if (activeEntryId == null) return undefined;
    return allRailItems.find((e) => e.id === activeEntryId);
  }, [allRailItems, activeEntryId]);

  const setActiveEntryId = useCallback(
    (id: string) => {
      if (!routeMenu) return;
      setRailOverride({ entryId: id, forPathname: pathname });
    },
    [routeMenu, pathname],
  );

  const rootState = useMemo<RootState>(
    () => ({
      headerHeight,
      railWidth,
      sidebarWidth,
      route: routeMenu,
      activeEntryId,
      activeEntry,
      setActiveEntryId,
    }),
    [
      headerHeight,
      railWidth,
      sidebarWidth,
      routeMenu,
      activeEntryId,
      activeEntry,
      setActiveEntryId,
    ],
  );

  return (
    <HeroSidebar.Provider
      navigate={router.push}
      collapsible="offcanvas"
      defaultOpen={defaultSidebarOpen}
    >
      <LayoutContext rootState={rootState}>
        <div
          className={cn(
            "flex h-dvh max-h-dvh w-dvw max-w-dvw min-h-0 min-w-0 flex-row",
            "bg-canvas text-fg-1",
            className,
          )}
          style={
            {
              "--layout-sidebar-width": `${sidebarWidth}rem`,
            } as CSSProperties
          }
        >
          {children}
        </div>
      </LayoutContext>
    </HeroSidebar.Provider>
  );
}

function collectRailMenuItems(route: RouteConfig | undefined) {
  if (!route) return [] as RailMenuItem[];
  return route.rail.flatMap((b) => b.items);
}
