"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar as HeroSidebar, useSidebar } from "@heroui-pro/react";

import { cn } from "@/lib/utils";
import type { RouteConfig, RailMenuItem } from "./types";
import { findBestEntryIdForPathname } from "./sidebar";

// -- Layout Context -- //

type SidebarState = ReturnType<typeof useSidebar>;

type LayoutBaseValue = {
  headerHeight: number;
  railWidth: number;
  sidebarWidth: number;
  route?: RouteConfig;
  activeEntryId?: string;
  activeEntry?: RailMenuItem;
  setActiveEntryId: (id: string) => void;
};

export type LayoutContextValue = LayoutBaseValue & SidebarState;

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function useLayoutContext(): LayoutContextValue {
  const ctx = useContext(LayoutContext);
  if (ctx == null) {
    throw new Error(
      "Layout subcomponents (Rail, Sidebar, Content, etc.) must be used inside <Layout>.",
    );
  }
  return ctx;
}

export function useLayout() {
  return useLayoutContext();
}

// -- Layout Rail Context -- //

export type LayoutRailContextValue = {
  /** Rail 在移动端填入 Sheet：由 `<Layout.Rail>` 注册，Sidebar 并排展示 */
  mobileRailSlot: ReactNode | null;
  setMobileRailSlot: (node: ReactNode | null) => void;
};

const LayoutRailContext = createContext<LayoutRailContextValue | null>(null);

export function useLayoutRail(): LayoutRailContextValue {
  const ctx = useContext(LayoutRailContext);
  if (ctx == null) {
    throw new Error("Layout rail outlet is only available inside <Layout>.");
  }
  return ctx;
}

function LayoutRailOutletBridge({ children }: { children: ReactNode }) {
  const [mobileRailSlot, setMobileRailSlot] = useState<ReactNode>(null);
  const outlet = useMemo<LayoutRailContextValue>(
    () => ({ mobileRailSlot, setMobileRailSlot }),
    [mobileRailSlot],
  );
  return (
    <LayoutRailContext.Provider value={outlet}>
      {children}
    </LayoutRailContext.Provider>
  );
}

function LayoutContextBridge({
  base,
  children,
}: {
  base: LayoutBaseValue;
  children: ReactNode;
}) {
  const sidebar = useSidebar();

  const value = useMemo<LayoutContextValue>(
    () => ({ ...base, ...sidebar }),
    [base, sidebar],
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

// -- Layout Root（客户端实现，由 `root.tsx` 注入 `defaultSidebarOpen`） -- //

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
    () => (routeMenu ? findBestEntryIdForPathname(routeMenu, pathname) : undefined),
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

  const baseValue = useMemo<LayoutBaseValue>(
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
      <LayoutRailOutletBridge>
        <LayoutContextBridge base={baseValue}>
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
        </LayoutContextBridge>
      </LayoutRailOutletBridge>
    </HeroSidebar.Provider>
  );
}

function collectRailMenuItems(route: RouteConfig | undefined) {
  if (!route) return [] as RailMenuItem[];
  return route.rail.flatMap((b) => b.items);
}
