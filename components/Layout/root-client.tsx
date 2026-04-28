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

// -- Layout Rail Outlet -- //

export type LayoutRailOutletContextValue = {
  /** Rail 在移动端填入 Sheet：由 `<Layout.Rail>` 注册，Sidebar 并排展示 */
  mobileRailSlot: ReactNode | null;
  setMobileRailSlot: (node: ReactNode | null) => void;
};

const LayoutRailOutletContext =
  createContext<LayoutRailOutletContextValue | null>(null);

export function useLayoutRailOutlet(): LayoutRailOutletContextValue {
  const ctx = useContext(LayoutRailOutletContext);
  if (ctx == null) {
    throw new Error("Layout rail outlet is only available inside <Layout>.");
  }
  return ctx;
}

function LayoutRailOutletBridge({ children }: { children: ReactNode }) {
  const [mobileRailSlot, setMobileRailSlot] = useState<ReactNode>(null);
  const outlet = useMemo<LayoutRailOutletContextValue>(
    () => ({ mobileRailSlot, setMobileRailSlot }),
    [mobileRailSlot],
  );
  return (
    <LayoutRailOutletContext.Provider value={outlet}>
      {children}
    </LayoutRailOutletContext.Provider>
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

export type RootProps = {
  headerHeight?: number;
  railWidth?: number;
  sidebarWidth?: number;
  className?: string;
  route?: RouteConfig;
  children: ReactNode;
};

export function LayoutRootClient({
  headerHeight = 3.25,
  railWidth = 4,
  sidebarWidth = 16.5,
  defaultSidebarOpen,
  className,
  route,
  children,
}: RootProps & { defaultSidebarOpen: boolean }) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const [railOverride, setRailOverride] = useState<{
    entryId: string;
    forPathname: string;
  } | null>(null);

  const allRailItems = useMemo(() => collectRailMenuItems(route), [route]);

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
