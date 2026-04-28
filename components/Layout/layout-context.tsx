"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSidebar } from "@heroui-pro/react";

import type { RouteConfig, RailMenuItem } from "./types";

type RawSidebarState = ReturnType<typeof useSidebar>;

export type RootState = {
  headerHeight: number;
  railWidth: number;
  sidebarWidth: number;
  route?: RouteConfig;
  activeEntryId?: string;
  activeEntry?: RailMenuItem;
  setActiveEntryId: (id: string) => void;
};

export type SidebarState = Omit<RawSidebarState, "isOpen" | "setOpen"> & {
  isDesktopOpen: boolean;
  setDesktopOpen: (open: boolean) => void;
  isDesktop: boolean;
};

export type RailState = {
  mobileRailSlot: ReactNode | null;
  setMobileRailSlot: (node: ReactNode | null) => void;
};

export type LayoutContextValue = {
  rootState: RootState;
  sidebarState: SidebarState;
  railState: RailState;
};

const LayoutCtx = createContext<LayoutContextValue | null>(null);

export function useLayout(): LayoutContextValue {
  const ctx = useContext(LayoutCtx);
  if (ctx == null) {
    throw new Error(
      "Layout subcomponents (Rail, Sidebar, Content, etc.) must be used inside <Layout>.",
    );
  }
  return ctx;
}

function mapSidebarState(raw: RawSidebarState): SidebarState {
  const { isOpen, setOpen, ...rest } = raw;
  return {
    ...rest,
    isDesktopOpen: isOpen,
    setDesktopOpen: setOpen,
    isDesktop: !raw.isMobile,
  };
}

export function LayoutContext({
  rootState,
  children,
}: {
  rootState: RootState;
  children: ReactNode;
}) {
  const [mobileRailSlot, setMobileRailSlot] = useState<ReactNode>(null);
  const rawSidebar = useSidebar();
  const sidebarState = useMemo(() => mapSidebarState(rawSidebar), [rawSidebar]);

  const value = useMemo<LayoutContextValue>(
    () => ({
      rootState,
      sidebarState,
      railState: {
        mobileRailSlot,
        setMobileRailSlot,
      },
    }),
    [rootState, sidebarState, mobileRailSlot],
  );

  return <LayoutCtx.Provider value={value}>{children}</LayoutCtx.Provider>;
}
