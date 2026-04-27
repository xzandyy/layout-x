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
import { Sidebar as HeroSidebar } from "@heroui-pro/react";

import { cn } from "@/lib/utils";
import type { RouteConfig, RailMenuItem } from "./types";
import { findBestEntryIdForPathname } from "./sidebar";

// -- Layout Root Context -- //

export type LayoutContextValue = {
  headerHeight: number;
  railWidth: number;
  sidebarWidth: number;
  route?: RouteConfig;
  activeEntryId?: string;
  activeEntry?: RailMenuItem;
  setActiveEntryId: (id: string) => void;
};

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

  const urlEntryId = useMemo(
    () => (route ? findBestEntryIdForPathname(route, pathname) : undefined),
    [route, pathname],
  );

  const fallbackId = useMemo(() => {
    if (!route?.entries.length) return undefined;
    return route.defaultEntryId ?? route.entries[0]!.id;
  }, [route]);

  const activeEntryId = useMemo(() => {
    if (!route) return undefined;
    if (railOverride != null && railOverride.forPathname === pathname) {
      return railOverride.entryId;
    }
    return urlEntryId ?? fallbackId;
  }, [route, railOverride, pathname, urlEntryId, fallbackId]);

  const activeEntry = useMemo(() => {
    if (!route || activeEntryId == null) return undefined;
    return route.entries.find((e) => e.id === activeEntryId);
  }, [route, activeEntryId]);

  const setActiveEntryId = useCallback(
    (id: string) => {
      if (!route) return;
      setRailOverride({ entryId: id, forPathname: pathname });
    },
    [route, pathname],
  );

  const value = useMemo<LayoutContextValue>(
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
    <LayoutContext.Provider value={value}>
      <HeroSidebar.Provider navigate={router.push} collapsible="none">
        <div
          className={cn(
            "flex h-dvh max-h-dvh w-dvw max-w-dvw min-h-0 min-w-0",
            "bg-canvas text-fg-1",
            className,
          )}
        >
          {children}
        </div>
      </HeroSidebar.Provider>
    </LayoutContext.Provider>
  );
}
