"use client";

import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar as HeroSidebar } from "@heroui-pro/react";

import { cn } from "@/lib/utils";
import type { MenuConfig, RailMenuItem } from "./types";
import { LayoutContext, type RootState } from "./context";
import { findBestRailMenuIdForPathname } from "./sidebar";

export type LayoutProps = {
  headerHeight?: number;
  railWidth?: number;
  sidebarWidth?: number;
  className?: string;
  menu?: MenuConfig;
  children: ReactNode;
  defaultSidebarOpen?: boolean;
};

export function LayoutRoot({
  headerHeight = 3.25,
  railWidth = 4,
  sidebarWidth = 16.5,
  defaultSidebarOpen = true,
  className,
  menu,
  children,
}: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const [railMenuOverride, setRailMenuOverride] = useState<{
    railMenuId: string;
    forPathname: string;
  } | null>(null);

  const allRailItems = useMemo(
    () => collectRailMenuItems(menu),
    [menu],
  );

  const urlRailMenuId = useMemo(
    () =>
      menu
        ? findBestRailMenuIdForPathname(menu, pathname)
        : undefined,
    [menu, pathname],
  );

  const fallbackRailMenuId = useMemo(() => {
    if (!allRailItems.length) return undefined;
    return menu?.defaultRailMenuId ?? allRailItems[0]!.id;
  }, [menu, allRailItems]);

  const activeRailMenuId = useMemo(() => {
    if (!menu) return undefined;
    if (
      railMenuOverride != null &&
      railMenuOverride.forPathname === pathname
    ) {
      return railMenuOverride.railMenuId;
    }
    return urlRailMenuId ?? fallbackRailMenuId;
  }, [
    menu,
    railMenuOverride,
    pathname,
    urlRailMenuId,
    fallbackRailMenuId,
  ]);

  const activeRailMenu = useMemo(() => {
    if (activeRailMenuId == null) return undefined;
    return allRailItems.find((e) => e.id === activeRailMenuId);
  }, [allRailItems, activeRailMenuId]);

  const setActiveRailMenuId = useCallback(
    (id: string) => {
      if (!menu) return;
      setRailMenuOverride({ railMenuId: id, forPathname: pathname });
    },
    [menu, pathname],
  );

  const rootState = useMemo<RootState>(
    () => ({
      headerHeight,
      railWidth,
      sidebarWidth,
      menu,
      activeRailMenuId,
      activeRailMenu,
      setActiveRailMenuId,
    }),
    [
      headerHeight,
      railWidth,
      sidebarWidth,
      menu,
      activeRailMenuId,
      activeRailMenu,
      setActiveRailMenuId,
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

function collectRailMenuItems(menu: MenuConfig | undefined) {
  if (!menu) return [] as RailMenuItem[];
  return menu.rail.flatMap((b) => b.items);
}
