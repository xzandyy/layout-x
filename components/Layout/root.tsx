"use client";

import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar as HeroSidebar } from "@heroui-pro/react";

import { cn } from "@/lib/utils";
import type { MenuConfig, RailMenuItem } from "./types";
import {
  LayoutContext,
  type RootState,
  type LayoutChild,
  renderLayoutChild,
  useLayout,
} from "./context";
import {
  findBestRailMenuForPathname,
  findActiveSidebarNavItem,
} from "./sidebar";

export type LayoutProps = {
  headerHeight?: number;
  railWidth?: number;
  sidebarWidth?: number;
  className?: string;
  menuConfig?: MenuConfig;
  children: LayoutChild;
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
    index: number;
    forPathname: string;
  } | null>(null);

  const allRailItems = useMemo(
    () => collectRailMenuItems(menuConfig),
    [menuConfig],
  );

  const urlRailMenu = useMemo(
    () =>
      menuConfig
        ? findBestRailMenuForPathname(menuConfig, pathname)
        : undefined,
    [menuConfig, pathname],
  );

  const activeRailMenu = useMemo(() => {
    if (!menuConfig) return undefined;
    if (railMenuOverride != null && railMenuOverride.forPathname === pathname) {
      return allRailItems[railMenuOverride.index];
    }
    return urlRailMenu;
  }, [menuConfig, railMenuOverride, pathname, urlRailMenu, allRailItems]);

  const activeSidebarMenu = useMemo(() => {
    const sidebar = activeRailMenu?.sidebar;
    if (!sidebar) return undefined;
    return findActiveSidebarNavItem(sidebar, pathname);
  }, [activeRailMenu, pathname]);

  const setActiveRailMenu = useCallback(
    (item: RailMenuItem) => {
      if (!menuConfig) return;
      const idx = allRailItems.indexOf(item);
      if (idx < 0) return;
      setRailMenuOverride({ index: idx, forPathname: pathname });
    },
    [menuConfig, pathname, allRailItems],
  );

  const rootState = useMemo<RootState>(
    () => ({
      headerHeight,
      railWidth,
      sidebarWidth,
      menuConfig,
      activeRailMenu,
      activeSidebarMenu,
      setActiveRailMenu,
    }),
    [
      headerHeight,
      railWidth,
      sidebarWidth,
      menuConfig,
      activeRailMenu,
      activeSidebarMenu,
      setActiveRailMenu,
    ],
  );

  const shellStyle = useMemo(
    () =>
      ({
        "--layout-sidebar-width": `${sidebarWidth}rem`,
      }) as CSSProperties,
    [sidebarWidth],
  );

  return (
    <HeroSidebar.Provider
      navigate={router.push}
      collapsible="offcanvas"
      defaultOpen={defaultSidebarOpen}
    >
      <LayoutContext rootState={rootState}>
        <LayoutRootBody className={className} style={shellStyle}>
          {children}
        </LayoutRootBody>
      </LayoutContext>
    </HeroSidebar.Provider>
  );
}

function LayoutRootBody({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: LayoutChild;
}) {
  const ctx = useLayout();
  return (
    <div
      className={cn(
        "flex h-dvh max-h-dvh w-dvw max-w-dvw min-h-0 min-w-0 flex-row",
        "bg-canvas text-fg-1",
        className,
      )}
      style={style}
    >
      {renderLayoutChild(children, ctx)}
    </div>
  );
}

function collectRailMenuItems(menuConfig: MenuConfig | undefined) {
  if (!menuConfig) return [] as RailMenuItem[];
  return menuConfig.rail.flatMap((b) => b.items);
}
