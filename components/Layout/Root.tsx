"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar as HeroSidebar, useSidebar } from "@heroui-pro/react";

import { cn } from "@/lib/utils";
import type { RouteConfig, RailMenuItem } from "./types";
import { findBestEntryIdForPathname } from "./sidebar";

// -- Layout Root Context -- //

function collectRailMenuItems(route: RouteConfig | undefined) {
  if (!route) return [] as RailMenuItem[];
  return route.rail.flatMap((b) => b.items);
}

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

/** Layout 域状态 + `useSidebar()` 的侧栏开闭 / 视口等（须在 `<Layout>` 内使用） */
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

function LayoutContextBridge({
  base,
  children,
}: {
  base: LayoutBaseValue;
  children: ReactNode;
}) {
  const sidebar = useSidebar();
  const value: LayoutContextValue = { ...base, ...sidebar };
  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

// -- Layout Root -- //

export type RootProps = {
  headerHeight?: number;
  railWidth?: number;
  sidebarWidth?: number;
  className?: string;
  route?: RouteConfig;
  children: ReactNode;
};

export function LayoutRoot({
  headerHeight = 3.25,
  railWidth = 4,
  sidebarWidth = 16.5,
  className,
  route,
  children,
}: RootProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const [railOverride, setRailOverride] = useState<{
    entryId: string;
    forPathname: string;
  } | null>(null);

  const allRailItems = useMemo(
    () => collectRailMenuItems(route),
    [route],
  );

  const urlEntryId = useMemo(
    () => (route ? findBestEntryIdForPathname(route, pathname) : undefined),
    [route, pathname],
  );

  const fallbackId = useMemo(() => {
    if (!allRailItems.length) return undefined;
    return route?.defaultRailItemId ?? allRailItems[0]!.id;
  }, [route, allRailItems]);

  const activeEntryId = useMemo(() => {
    if (!route) return undefined;
    if (railOverride != null && railOverride.forPathname === pathname) {
      return railOverride.entryId;
    }
    return urlEntryId ?? fallbackId;
  }, [route, railOverride, pathname, urlEntryId, fallbackId]);

  const activeEntry = useMemo(() => {
    if (activeEntryId == null) return undefined;
    return allRailItems.find((e) => e.id === activeEntryId);
  }, [allRailItems, activeEntryId]);

  const setActiveEntryId = useCallback(
    (id: string) => {
      if (!route) return;
      setRailOverride({ entryId: id, forPathname: pathname });
    },
    [route, pathname],
  );

  const baseValue = useMemo<LayoutBaseValue>(
    () => ({
      headerHeight,
      railWidth,
      sidebarWidth,
      route,
      activeEntryId,
      activeEntry,
      setActiveEntryId,
    }),
    [
      headerHeight,
      railWidth,
      sidebarWidth,
      route,
      activeEntryId,
      activeEntry,
      setActiveEntryId,
    ],
  );

  return (
    <HeroSidebar.Provider navigate={router.push} collapsible="offcanvas">
      <LayoutContextBridge base={baseValue}>
        <div
          className={cn(
            "flex h-dvh max-h-dvh w-dvw max-w-dvw min-h-0 min-w-0",
            "flex-col-reverse md:flex-row",
            "bg-canvas text-fg-1",
            className,
          )}
        >
          {children}
        </div>
      </LayoutContextBridge>
    </HeroSidebar.Provider>
  );
}
