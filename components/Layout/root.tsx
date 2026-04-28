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
  menuConfig?: MenuConfig;
  children: ReactNode;
  defaultSidebarOpen?: boolean;
};

export function LayoutRoot({
  headerHeight = 3.25,
  railWidth = 4,
  sidebarWidth = 16.5,
  defaultSidebarOpen = true,
  className,
  menuConfig,
  children,
}: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const [railMenuOverride, setRailMenuOverride] = useState<{
    railMenuId: string;
    forPathname: string;
  } | null>(null);

  const allRailItems = useMemo(
    () => collectRailMenuItems(menuConfig),
    [menuConfig],
  );

  const urlRailMenuId = useMemo(
    () =>
      menuConfig
        ? findBestRailMenuIdForPathname(menuConfig, pathname)
        : undefined,
    [menuConfig, pathname],
  );

  const fallbackRailMenuId = useMemo(() => {
    if (!allRailItems.length) return undefined;
    return menuConfig?.defaultRailMenuId ?? allRailItems[0]!.id;
  }, [menuConfig, allRailItems]);

  const activeRailMenuId = useMemo(() => {
    if (!menuConfig) return undefined;
    if (
      railMenuOverride != null &&
      railMenuOverride.forPathname === pathname
    ) {
      return railMenuOverride.railMenuId;
    }
    return urlRailMenuId ?? fallbackRailMenuId;
  }, [
    menuConfig,
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
      if (!menuConfig) return;
      setRailMenuOverride({ railMenuId: id, forPathname: pathname });
    },
    [menuConfig, pathname],
  );

  const rootState = useMemo<RootState>(
    () => ({
      headerHeight,
      railWidth,
      sidebarWidth,
      menuConfig,
      activeRailMenuId,
      activeRailMenu,
      setActiveRailMenuId,
    }),
    [
      headerHeight,
      railWidth,
      sidebarWidth,
      menuConfig,
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

function collectRailMenuItems(menuConfig: MenuConfig | undefined) {
  if (!menuConfig) return [] as RailMenuItem[];
  return menuConfig.rail.flatMap((b) => b.items);
}
